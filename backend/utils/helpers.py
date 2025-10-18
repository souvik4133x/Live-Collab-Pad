from fastapi import WebSocket
from typing import Dict, List
import uuid

class ConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, Dict] = {}
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str, username: str):
        await websocket.accept()
        
        if room_id not in self.rooms:
            self.rooms[room_id] = {
                "content": "",
                "users": {},
                "documents": {"main": {"title": "Main Document", "content": ""}}
            }
        
        user_id = str(uuid.uuid4())[:8]
        self.rooms[room_id]["users"][user_id] = {
            "username": username,
            "color": self._get_user_color(len(self.rooms[room_id]["users"]))
        }
        
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)
        
        # Send current room state to new user
        await self._send_room_state(room_id)
        return user_id

    def disconnect(self, websocket: WebSocket, room_id: str, user_id: str):
        if room_id in self.rooms and user_id in self.rooms[room_id]["users"]:
            del self.rooms[room_id]["users"][user_id]
            
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
        
        # Clean up empty rooms
        if room_id in self.rooms and not self.rooms[room_id]["users"]:
            del self.rooms[room_id]
        if room_id in self.active_connections and not self.active_connections[room_id]:
            del self.active_connections[room_id]

    async def broadcast_message(self, message: dict, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_json(message)
                except:
                    continue

    async def update_content(self, content: str, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id]["content"] = content
            await self.broadcast_message({
                "type": "content_update",
                "content": content
            }, room_id)

    async def _send_room_state(self, room_id: str):
        if room_id in self.rooms:
            await self.broadcast_message({
                "type": "room_state",
                "content": self.rooms[room_id]["content"],
                "users": self.rooms[room_id]["users"]
            }, room_id)

    def _get_user_color(self, index: int):
        colors = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"]
        return colors[index % len(colors)]

manager = ConnectionManager()