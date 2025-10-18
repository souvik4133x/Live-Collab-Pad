from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from managers.connection_manager import manager

router = APIRouter()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    username = websocket.query_params.get("username", "Anonymous")
    
    user_id = await manager.connect(websocket, room_id, username)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data["type"] == "content_update":
                await manager.update_content(data["content"], room_id, user_id)
            elif data["type"] == "user_typing":
                await manager.broadcast_message({
                    "type": "user_typing",
                    "user_id": user_id,
                    "is_typing": data["is_typing"]
                }, room_id, exclude_user=user_id)
                
    except WebSocketDisconnect:
        await manager.disconnect(websocket, room_id, user_id)