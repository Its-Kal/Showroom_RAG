from sqlalchemy.orm import Session
from sqlalchemy import select
from models.chat_model import ChatSession, ChatMessage
from typing import List, Optional
import uuid

class ChatRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_session(self, user_id: Optional[str] = None) -> ChatSession:
        """Membuat chat session baru dengan status 'ai_only'"""
        session = ChatSession(
            id=str(uuid.uuid4()),
            user_id=user_id,
            status="ai_only"
        )
        self.session.add(session)
        self.session.commit()
        self.session.refresh(session)
        return session

    def get_session(self, session_id: str) -> Optional[ChatSession]:
        """Mengambil chat session berdasarkan ID"""
        return self.session.get(ChatSession, session_id)

    def get_sessions_by_sales(self, sales_id: str) -> List[ChatSession]:
        """Mengambil semua chat session yang ditugaskan ke sales tertentu"""
        stmt = select(ChatSession).where(ChatSession.sales_id == sales_id)
        return list(self.session.execute(stmt).scalars().all())

    def get_all_active_sessions(self) -> List[ChatSession]:
        """Mengambil semua chat session yang aktif (untuk admin)"""
        stmt = select(ChatSession).where(ChatSession.status != "closed")
        return list(self.session.execute(stmt).scalars().all())

    def assign_sales(self, session_id: str, sales_id: str) -> ChatSession:
        """Assign sales ke chat session"""
        session = self.get_session(session_id)
        if session:
            session.sales_id = sales_id
            session.status = "with_sales"
            self.session.commit()
            self.session.refresh(session)
        return session

    def add_message(self, session_id: str, message: str, sender_type: str, sender_id: Optional[str] = None) -> ChatMessage:
        """Menambahkan pesan baru ke chat session"""
        chat_message = ChatMessage(
            id=str(uuid.uuid4()),
            session_id=session_id,
            message=message,
            sender_type=sender_type,
            sender_id=sender_id
        )
        self.session.add(chat_message)
        self.session.commit()
        self.session.refresh(chat_message)
        return chat_message

    def get_session_messages(self, session_id: str) -> List[ChatMessage]:
        """Mengambil semua pesan dalam chat session"""
        stmt = select(ChatMessage).where(
            ChatMessage.session_id == session_id
        ).order_by(ChatMessage.created_at)
        return list(self.session.execute(stmt).scalars().all())

    def close_session(self, session_id: str) -> ChatSession:
        """Menutup chat session"""
        session = self.get_session(session_id)
        if session:
            session.status = "closed"
            self.session.commit()
            self.session.refresh(session)
        return session

    def get_chat_metrics(self, sales_id: str) -> dict:
        """Mengambil metrik chat untuk sales tertentu"""
        # Contoh implementasi sederhana
        active_sessions = select(ChatSession).where(
            ChatSession.sales_id == sales_id,
            ChatSession.status == "with_sales"
        )
        closed_sessions = select(ChatSession).where(
            ChatSession.sales_id == sales_id,
            ChatSession.status == "closed"
        )
        
        return {
            "active_sessions": len(list(self.session.execute(active_sessions).scalars().all())),
            "closed_sessions": len(list(self.session.execute(closed_sessions).scalars().all()))
        }