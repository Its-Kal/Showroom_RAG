from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ChatSessionBase(BaseModel):
    user_id: Optional[str] = None
    sales_id: Optional[str] = None
    status: str

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionRead(ChatSessionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class ChatMessageBase(BaseModel):
    message: str
    sender_type: str  # 'user', 'ai', 'sales'

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageRead(ChatMessageBase):
    id: str
    session_id: str
    sender_id: Optional[str]
    created_at: datetime
    
    class Config:
        orm_mode = True

class ChatMetrics(BaseModel):
    active_sessions: int
    closed_sessions: int