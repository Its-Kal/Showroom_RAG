from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from repositories.chat_repository import ChatRepository
from models.chat_model import ChatSession, ChatMessage

class ChatController:
    def __init__(self, session: Session):
        self.repo = ChatRepository(session)

    def create_chat_session(self, user_id: Optional[str] = None) -> ChatSession:
        """Membuat chat session baru"""
        return self.repo.create_session(user_id)

    def get_chat_session(self, session_id: str) -> ChatSession:
        """Mengambil chat session berdasarkan ID"""
        session = self.repo.get_session(session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session tidak ditemukan"
            )
        return session

    def get_sales_sessions(self, sales_id: str) -> List[ChatSession]:
        """Mengambil chat sessions untuk sales tertentu"""
        return self.repo.get_sessions_by_sales(sales_id)

    def get_all_sessions(self) -> List[ChatSession]:
        """Mengambil semua chat sessions (untuk admin)"""
        return self.repo.get_all_active_sessions()

    def assign_sales_to_session(self, session_id: str, sales_id: str) -> ChatSession:
        """Assign sales ke chat session"""
        session = self.get_chat_session(session_id)  # This will raise 404 if not found
        
        # Verify session can be assigned
        if session.status == "closed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tidak dapat assign sales ke chat yang sudah ditutup"
            )
        
        return self.repo.assign_sales(session_id, sales_id)

    def add_chat_message(
        self, 
        session_id: str, 
        message: str, 
        sender_type: str,
        sender_id: Optional[str] = None
    ) -> ChatMessage:
        """Menambahkan pesan ke chat session"""
        session = self.get_chat_session(session_id)  # This will raise 404 if not found
        
        if session.status == "closed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tidak dapat menambahkan pesan ke chat yang sudah ditutup"
            )
            
        # Validasi sender_type
        if sender_type not in ["user", "ai", "sales"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tipe pengirim tidak valid"
            )
            
        # Jika sender adalah sales, pastikan session dalam status with_sales
        if sender_type == "sales" and session.status != "with_sales":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sales hanya dapat mengirim pesan setelah chat di-assign"
            )
            
        return self.repo.add_message(session_id, message, sender_type, sender_id)

    def get_session_messages(self, session_id: str) -> List[ChatMessage]:
        """Mengambil semua pesan dalam chat session"""
        session = self.get_chat_session(session_id)  # This will raise 404 if not found
        return self.repo.get_session_messages(session_id)

    def close_chat_session(self, session_id: str) -> ChatSession:
        """Menutup chat session"""
        session = self.get_chat_session(session_id)  # This will raise 404 if not found
        return self.repo.close_session(session_id)

    def get_sales_chat_metrics(self, sales_id: str) -> dict:
        """Mengambil metrik chat untuk sales"""
        return self.repo.get_chat_metrics(sales_id)