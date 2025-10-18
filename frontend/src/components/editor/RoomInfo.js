// import React from 'react';
// import { useEditor } from '../../contexts/EditorContext';
// import Button from '../common/Button';

// const RoomInfo = () => {
//   const { state } = useEditor();

//   const handleDownload = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/download/${state.currentRoom}`);
//       const data = await response.json();
      
//       const pdfData = atob(data.pdf_data);
//       const pdfArray = new Uint8Array(pdfData.length);
//       for (let i = 0; i < pdfData.length; i++) {
//         pdfArray[i] = pdfData.charCodeAt(i);
//       }
//       const pdfBlob = new Blob([pdfArray], { type: 'application/pdf' });
      
//       const downloadUrl = window.URL.createObjectURL(pdfBlob);
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.download = data.filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert(`Failed to download PDF: ${error.message}`);
//     }
//   };

//   const wordCount = state.content ? state.content.split(/\s+/).filter(word => word.length > 0).length : 0;
//   const charCount = state.content ? state.content.length : 0;

//   return (
//     <div className="sidebar-section">
//       <div className="section-header">
//         <h3>Room Information</h3>
//       </div>
      
//       <div className="room-meta">
//         <div className="meta-item">
//           <span className="meta-label">Room Name</span>
//           <span className="meta-value">{state.currentRoom}</span>
//         </div>
//         <div className="meta-item">
//           <span className="meta-label">Online Users</span>
//           <span className="meta-value">{Object.values(state.users || {}).length}</span>
//         </div>
//         <div className="meta-item">
//           <span className="meta-label">Document</span>
//           <span className="meta-value">Main Document</span>
//         </div>
//       </div>

//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-number">{wordCount}</div>
//           <div className="stat-label">Words</div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-number">{charCount}</div>
//           <div className="stat-label">Characters</div>
//         </div>
//       </div>

//       <div className="quick-actions">
//         <Button 
//           variant="primary" 
//           onClick={handleDownload}
//           className="btn-full"
//         >
//           Download PDF
//         </Button>
//         <Button 
//           variant="secondary"
//           className="btn-full"
//           onClick={() => navigator.clipboard.writeText(window.location.href)}
//         >
//           Copy Link
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RoomInfo;
import React from 'react';
import { useEditor } from '../../contexts/EditorContext';

const RoomInfo = () => {
  const { state } = useEditor();

  // Calculate stats from HTML content
  const getTextContent = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const textContent = state.content ? getTextContent(state.content) : '';
  const wordCount = textContent ? textContent.split(/\s+/).filter(word => word.length > 0).length : 0;
  const charCount = textContent ? textContent.length : 0;
  const paragraphCount = state.content ? (state.content.match(/<p[^>]*>/g) || []).length : 0;

  return (
    <div className="sidebar-section">
      <div className="section-header">
        <h3>Room Information</h3>
      </div>
      
      <div className="room-meta-grid">
        <div className="meta-item">
          <div className="meta-content">
            <div className="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10L12 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="meta-text">
              <div className="meta-label">Room Name</div>
              <div className="meta-value">{state.currentRoom}</div>
            </div>
          </div>
        </div>
        
        <div className="meta-item">
          <div className="meta-content">
            <div className="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="meta-text">
              <div className="meta-label">Online Users</div>
              <div className="meta-value">{Object.values(state.users || {}).length}</div>
            </div>
          </div>
        </div>
        
        <div className="meta-item">
          <div className="meta-content">
            <div className="meta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="meta-text">
              <div className="meta-label">Status</div>
              <div className="meta-value status">
                <div className="status-indicator"></div>
                <span>Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{wordCount}</div>
          <div className="stat-label">Words</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔤</div>
          <div className="stat-number">{charCount}</div>
          <div className="stat-label">Characters</div>
        </div>
       
      </div>
    </div>
  );
};

export default RoomInfo;