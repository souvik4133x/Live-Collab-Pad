from fastapi import APIRouter, HTTPException
from managers.connection_manager import manager
import base64
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

router = APIRouter()

@router.get("/download/{room_id}")
async def download_pdf(room_id: str):
    if room_id not in manager.rooms:
        raise HTTPException(status_code=404, detail="Room not found")

    content = manager.rooms[room_id].content
    if not content.strip():
        raise HTTPException(status_code=400, detail="Room is empty")

    # Create a safe filename
    safe_room_id = "".join(c for c in room_id if c.isalnum() or c in (' ', '-', '_')).rstrip()
    
    # Process content for PDF
    pdf_content = (
        content.replace('&', '&amp;')
               .replace('<', '&lt;')
               .replace('>', '&gt;')
               .replace('\n', '<br/>')
    )
    
    # Generate PDF in memory
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=(8.5 * inch, 11 * inch))
    styles = getSampleStyleSheet()
    story = [Paragraph(pdf_content, styles['Normal'])]
    doc.build(story)
    
    # Get PDF data and encode as base64
    pdf_data = base64.b64encode(buffer.getvalue()).decode()
    
    return {
        "pdf_data": pdf_data,
        "filename": f"{safe_room_id}_document.pdf"
    }