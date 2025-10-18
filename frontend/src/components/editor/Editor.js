

// import React, { useState, useEffect } from 'react';
// import { useEditor } from '../../contexts/EditorContext';
// import { useWebSocket } from '../../hooks/useWebSocket';
// import Toolbar from './Toolbar';

// const Editor = () => {
//   const { state } = useEditor();
//   const { sendMessage } = useWebSocket();
//   const [localContent, setLocalContent] = useState(state.content);

//   useEffect(() => {
//     setLocalContent(state.content);
//   }, [state.content]);

//   const handleContentChange = (e) => {
//     const newContent = e.target.value;
//     setLocalContent(newContent);
//     sendMessage({
//       type: 'content_update',
//       content: newContent
//     });
//   };

//   return (
//     <div className="editor-container">
//       {/* Toolbar */}
//       <Toolbar />
      
//       {/* Editor Content */}
//       <div className="editor-content">
//         <textarea
//           value={localContent}
//           onChange={handleContentChange}
//           className="editor-textarea"
//           placeholder="Start typing collaboratively... ✨"
//           autoFocus
//         />
//       </div>
//     </div>
//   );
// };

// export default Editor;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import Toolbar from './Toolbar';

const Editor = () => {
  const { state } = useEditor();
  const { sendMessage } = useWebSocket();
  const editorRef = useRef(null);
  const [history, setHistory] = useState([{ content: '', timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const lastContentRef = useRef('');

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && state.content !== lastContentRef.current) {
      editorRef.current.innerHTML = state.content || '';
      lastContentRef.current = state.content || '';
      
      // Add to history if it's a new content from server
      if (state.content && state.content !== history[historyIndex]?.content) {
        addToHistory(state.content);
      }
    }
  }, [state.content]);

  // Add content to history
  const addToHistory = useCallback((content) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ content, timestamp: Date.now() });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.innerHTML;
    
    // Only update if content actually changed
    if (newContent !== lastContentRef.current) {
      lastContentRef.current = newContent;
      
      // Add to history for undo/redo
      addToHistory(newContent);
      
      // Send to other users
      sendMessage({
        type: 'content_update',
        content: newContent
      });
    }
  }, [addToHistory, sendMessage]);

  // Handle formatting
  const handleFormat = useCallback((format) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    document.execCommand('styleWithCSS', false, true);

    switch (format) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      case 'bullet':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'number':
        document.execCommand('insertOrderedList', false, null);
        break;
      case 'heading1':
        document.execCommand('formatBlock', false, '<h1>');
        break;
      case 'heading2':
        document.execCommand('formatBlock', false, '<h2>');
        break;
      case 'alignLeft':
        document.execCommand('justifyLeft', false, null);
        break;
      case 'alignCenter':
        document.execCommand('justifyCenter', false, null);
        break;
      case 'alignRight':
        document.execCommand('justifyRight', false, null);
        break;
      default:
        break;
    }

    // Trigger change after formatting
    handleContentChange();
    editorRef.current.focus();
  }, [handleContentChange]);

  // Handle actions
  const handleAction = useCallback((action) => {
    if (!editorRef.current) return;

    switch (action) {
      case 'undo':
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const previousContent = history[newIndex].content;
          editorRef.current.innerHTML = previousContent;
          lastContentRef.current = previousContent;
          sendMessage({
            type: 'content_update',
            content: previousContent
          });
        }
        break;

      case 'redo':
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const nextContent = history[newIndex].content;
          editorRef.current.innerHTML = nextContent;
          lastContentRef.current = nextContent;
          sendMessage({
            type: 'content_update',
            content: nextContent
          });
        }
        break;

      case 'save':
        // Auto-save is already handled
        console.log('Content saved:', lastContentRef.current);
        break;

      case 'print':
        const printContent = editorRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Document</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  margin: 40px;
                  color: #000;
                }
                h1 { font-size: 24px; margin-bottom: 20px; }
                h2 { font-size: 20px; margin-bottom: 15px; }
                ul, ol { margin: 10px 0; padding-left: 30px; }
                strong { font-weight: bold; }
                em { font-style: italic; }
                u { text-decoration: underline; }
              </style>
            </head>
            <body>
              <div>${printContent}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        break;

      default:
        break;
    }
  }, [history, historyIndex, sendMessage]);

  // Handle paste to clean up formatting
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleContentChange();
  }, [handleContentChange]);

  return (
    <div className="editor-container">
      {/* Toolbar */}
      <Toolbar 
        onFormat={handleFormat}
        onAction={handleAction}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />
      
      {/* ContentEditable Editor */}
      <div className="editor-content">
        <div
          ref={editorRef}
          className="rich-text-editor"
          contentEditable
          onInput={handleContentChange}
          onPaste={handlePaste}
          onKeyDown={(e) => {
            // Handle tab key for indentation
            if (e.key === 'Tab') {
              e.preventDefault();
              document.execCommand('insertText', false, '    ');
              handleContentChange();
            }
          }}
          placeholder="Start typing collaboratively... ✨"
          suppressContentEditableWarning={true}
        />
      </div>
    </div>
  );
};

export default Editor;