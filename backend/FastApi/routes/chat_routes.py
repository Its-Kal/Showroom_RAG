from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from db import get_db
from controllers.chat_controller import ChatController
from auth import require_permission, get_current_active_user
from models.user_model import User
from schemas_definition import ChatSessionCreate, ChatSessionRead, ChatMessageCreate, ChatMessageRead, ChatMetrics

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post("/sessions", response_model=ChatSessionRead)
async def create_chat_session(
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Membuat chat session baru dengan AI"""
    controller = ChatController(db)
    return controller.create_chat_session(user_id)

@router.get("/sessions/me", response_model=List[ChatSessionRead])
async def get_my_chat_sessions(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mengambil chat sessions yang ditugaskan ke sales yang login"""
    if not current_user.role or current_user.role.name not in ['sales', 'admin', 'admin_utama']:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses")
    
    controller = ChatController(db)
    return controller.get_sales_sessions(current_user.id)

@router.get("/sessions", response_model=List[ChatSessionRead])
async def get_all_chat_sessions(
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("chat.view_all"))
):
    """Mengambil semua chat sessions (admin only)"""
    controller = ChatController(db)
    return controller.get_all_sessions()

@router.post("/sessions/{session_id}/assign", response_model=ChatSessionRead)
async def assign_sales(
    session_id: str,
    sales_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("chat.assign_sales"))
):
    """Assign sales ke chat session (admin only)"""
    controller = ChatController(db)
    return controller.assign_sales_to_session(session_id, sales_id)

@router.post("/sessions/{session_id}/messages", response_model=ChatMessageRead)
async def add_message(
    session_id: str,
    message: ChatMessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Menambahkan pesan ke chat session"""
    controller = ChatController(db)
    session = controller.get_chat_session(session_id)
    
    # Cek permission
    if message.sender_type == "sales":
        if not current_user.role or "chat.reply" not in [p.name for p in current_user.role.permissions]:
            raise HTTPException(status_code=403, detail="Tidak memiliki izin untuk membalas")
        if session.sales_id != current_user.id:
            raise HTTPException(status_code=403, detail="Hanya dapat membalas chat yang ditugaskan")
            
    return controller.add_chat_message(
        session_id=session_id,
        message=message.message,
        sender_type=message.sender_type,
        sender_id=current_user.id if message.sender_type == "sales" else None
    )

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
async def get_session_messages(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mengambil pesan dalam chat session"""
    controller = ChatController(db)
    session = controller.get_chat_session(session_id)
    
    # Cek akses
    has_chat_view_all = current_user.role and "chat.view_all" in [p.name for p in current_user.role.permissions]
    is_assigned_sales = session.sales_id == current_user.id
    
    if not (has_chat_view_all or is_assigned_sales):
        raise HTTPException(status_code=403, detail="Tidak memiliki akses ke chat ini")
        
    return controller.get_session_messages(session_id)

@router.post("/sessions/{session_id}/close", response_model=ChatSessionRead)
async def close_session(
    session_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Menutup chat session"""
    controller = ChatController(db)
    session = controller.get_chat_session(session_id)
    
    # Cek permission
    has_chat_view_all = current_user.role and "chat.view_all" in [p.name for p in current_user.role.permissions]
    is_assigned_sales = session.sales_id == current_user.id
    
    if not (has_chat_view_all or is_assigned_sales):
        raise HTTPException(status_code=403, detail="Tidak memiliki akses untuk menutup chat ini")
        
    return controller.close_chat_session(session_id)

@router.get("/metrics/me", response_model=ChatMetrics)
async def get_my_chat_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Mengambil metrik chat untuk sales yang login"""
    if not current_user.role or "chat.metrics" not in [p.name for p in current_user.role.permissions]:
        raise HTTPException(status_code=403, detail="Tidak memiliki akses ke metrik")
        
    controller = ChatController(db)
    return controller.get_sales_chat_metrics(current_user.id)