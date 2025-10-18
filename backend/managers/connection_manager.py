import asyncio
from fastapi import WebSocket
from typing import Dict, List
import uuid
import time
from models.room_models import RoomState, User, Document

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, RoomState] = {}
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_websocket_map: Dict[str, str] = {}  # user_id -> room_id

    async def connect(self, websocket: WebSocket, room_id: str, username: str):
        await websocket.accept()
        
        if room_id not in self.rooms:
            # Initialize room with proper Pydantic models
            self.rooms[room_id] = RoomState(
                content="",
                users={},
                documents={},
                current_document="main"
            )
            # Create main document as Pydantic model
            self.rooms[room_id].documents["main"] = Document(
                id="main",
                title="Main Document",
                content="",
                created_at=time.time(),
                last_modified=time.time()
            )
        
        user_id = str(uuid.uuid4())[:8]
        user_color = self._get_user_color(len(self.rooms[room_id].users))
        
        # Create user as Pydantic model
        self.rooms[room_id].users[user_id] = User(
            id=user_id,
            username=username,
            color=user_color
        )
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        self.user_websocket_map[user_id] = room_id
        
        # Send current room state to new user
        await self._send_room_state(room_id)
        
        # Notify others about new user
        await self.broadcast_message({
            "type": "user_joined",
            "user": self.rooms[room_id].users[user_id].dict(),
            "users": {uid: user.dict() for uid, user in self.rooms[room_id].users.items()}
        }, room_id, exclude_user=user_id)
        
        return user_id

    async def disconnect(self, websocket: WebSocket, room_id: str, user_id: str):
        if room_id in self.rooms and user_id in self.rooms[room_id].users:
            del self.rooms[room_id].users[user_id]
            
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
        
        if user_id in self.user_websocket_map:
            del self.user_websocket_map[user_id]
        
        # Notify others about user leaving
        if room_id in self.rooms:
            await self.broadcast_message({
                "type": "user_left",
                "user_id": user_id,
                "users": {uid: user.dict() for uid, user in self.rooms[room_id].users.items()}
            }, room_id)
        
        # Clean up empty rooms
        self._cleanup_room(room_id)

    async def broadcast_message(self, message: dict, room_id: str, exclude_user: str = None):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_json(message)
                except:
                    continue

    async def update_content(self, content: str, room_id: str, user_id: str):
        if room_id in self.rooms:
            # Update room content
            self.rooms[room_id].content = content
            
            # Update current document content
            current_doc_id = self.rooms[room_id].current_document
            if current_doc_id in self.rooms[room_id].documents:
                # Update the document's content
                doc = self.rooms[room_id].documents[current_doc_id]
                doc.content = content
                doc.last_modified = time.time()
            
            await self.broadcast_message({
                "type": "content_update",
                "content": content,
                "user_id": user_id
            }, room_id, exclude_user=user_id)

    async def _send_room_state(self, room_id: str):
        if room_id in self.rooms:
            room = self.rooms[room_id]
            await self.broadcast_message({
                "type": "room_state",
                "content": room.content,
                "users": {uid: user.dict() for uid, user in room.users.items()},
                "documents": {doc_id: doc.dict() for doc_id, doc in room.documents.items()},
                "current_document": room.current_document
            }, room_id)

    def _get_user_color(self, index: int):
        colors = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"]
        return colors[index % len(colors)]

    def _cleanup_room(self, room_id: str):
        if room_id in self.rooms and not self.rooms[room_id].users:
            del self.rooms[room_id]
        if room_id in self.active_connections and not self.active_connections[room_id]:
            del self.active_connections[room_id]

manager = ConnectionManager()