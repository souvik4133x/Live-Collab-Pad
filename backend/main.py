# # main.py
# import asyncio
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# from fastapi.responses import FileResponse
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Dict, List
# import os

# # For PDF Generation
# from reportlab.platypus import SimpleDocTemplate, Paragraph
# from reportlab.lib.styles import getSampleStyleSheet
# from reportlab.lib.units import inch
# from fastapi import HTTPException

# # --- App Setup ---
# app = FastAPI()

# # --- CORS Middleware ---
# origins = [
#     "http://localhost:3000",
#     "http://localhost:5173",
#     "http://localhost:5500",  # Added port 5500
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- In-Memory Storage ---
# class ConnectionManager:
#     def __init__(self):
#         self.rooms: Dict[str, Dict[str, any]] = {}
#         self.active_connections: Dict[str, List[WebSocket]] = {}

#     async def connect(self, websocket: WebSocket, room_id: str):
#         await websocket.accept()
#         if room_id not in self.rooms:
#             self.rooms[room_id] = {"content": "", "connections": []}
#         if room_id not in self.active_connections:
#             self.active_connections[room_id] = []
        
#         self.rooms[room_id]["connections"].append(websocket)
#         self.active_connections[room_id].append(websocket)
        
#         # Send current content to the newly connected client
#         await websocket.send_text(self.rooms[room_id]["content"])

#     def disconnect(self, websocket: WebSocket, room_id: str):
#         if room_id in self.rooms:
#             if websocket in self.rooms[room_id]["connections"]:
#                 self.rooms[room_id]["connections"].remove(websocket)
            
#         if room_id in self.active_connections:
#             if websocket in self.active_connections[room_id]:
#                 self.active_connections[room_id].remove(websocket)
            
#         # If no one is in the room, we could optionally clear it
#         if room_id in self.rooms and not self.rooms[room_id]["connections"]:
#             del self.rooms[room_id]
#         if room_id in self.active_connections and not self.active_connections[room_id]:
#             del self.active_connections[room_id]

#     async def broadcast(self, message: str, room_id: str, sender: WebSocket):
#         if room_id in self.rooms:
#             self.rooms[room_id]["content"] = message
#             # Broadcast the message to all clients in the same room except the sender
#             for connection in self.rooms[room_id]["connections"]:
#                 if connection != sender:
#                     await connection.send_text(message)

# manager = ConnectionManager()

# # --- WebSocket Endpoint ---
# @app.websocket("/ws/{room_id}")
# async def websocket_endpoint(websocket: WebSocket, room_id: str):
#     await manager.connect(websocket, room_id)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await manager.broadcast(data, room_id, websocket)
#     except WebSocketDisconnect:
#         manager.disconnect(websocket, room_id)
#         print(f"Client disconnected from room {room_id}")

# from fastapi import BackgroundTasks

# @app.get("/download/{room_id}")
# async def download_pdf(room_id: str):
#     from io import BytesIO
#     import base64
#     from fastapi.responses import JSONResponse

#     if room_id not in manager.rooms:
#         raise HTTPException(status_code=404, detail="Room not found")

#     content = manager.rooms[room_id].get("content", "")
#     if not content.strip():
#         raise HTTPException(status_code=400, detail="Room is empty")

#     # Create a safe filename
#     safe_room_id = "".join(c for c in room_id if c.isalnum() or c in (' ', '-', '_')).rstrip()
    
#     # Process content for PDF
#     pdf_content = (
#         content.replace('&', '&amp;')
#                .replace('<', '&lt;')
#                .replace('>', '&gt;')
#                .replace('\n', '<br/>')
#     )
    
#     # Generate PDF in memory
#     buffer = BytesIO()
#     doc = SimpleDocTemplate(buffer, pagesize=(8.5 * inch, 11 * inch))
#     styles = getSampleStyleSheet()
#     story = [Paragraph(pdf_content, styles['Normal'])]
#     doc.build(story)
    
#     # Get PDF data and encode as base64
#     pdf_data = base64.b64encode(buffer.getvalue()).decode()
    
#     return JSONResponse({
#         "pdf_data": pdf_data,
#         "filename": f"{safe_room_id}_document.pdf"
#     })

# @app.get("/")
# def read_root():
#     return {"message": "Collaborative Document Editor Backend is running."}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5500)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.websocket import router as websocket_router
from routes.documents import router as documents_router

app = FastAPI(title="Collab Editor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(websocket_router, tags=["websocket"])
app.include_router(documents_router, prefix="/api", tags=["documents"])

@app.get("/")
def read_root():
    return {"message": "Collaborative Document Editor API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)