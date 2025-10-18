from typing import Dict, List, Any, Optional
from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str
    color: str
    is_online: bool = True

class Document(BaseModel):
    id: str
    title: str
    content: str
    created_at: float
    last_modified: float

class RoomState(BaseModel):
    content: str = ""
    users: Dict[str, User] = {}
    documents: Dict[str, Document] = {}
    current_document: str = "main"

# WebSocket message models
class WSMessage(BaseModel):
    type: str
    data: Dict[str, Any] = {}