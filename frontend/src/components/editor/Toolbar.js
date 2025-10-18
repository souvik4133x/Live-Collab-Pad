import React from 'react';

const Toolbar = ({ onFormat, onAction, canUndo, canRedo }) => {
  return (
    <div className="editor-toolbar">
      {/* Version Control & Actions */}
      <div className="toolbar-section">
        <div className="toolbar-group">
          <button 
            className={`toolbar-btn ${!canUndo ? 'disabled' : ''}`}
            onClick={() => canUndo && onAction('undo')}
            title="Undo"
            disabled={!canUndo}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 5L3 9L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className={`toolbar-btn ${!canRedo ? 'disabled' : ''}`}
            onClick={() => canRedo && onAction('redo')}
            title="Redo"
            disabled={!canRedo}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 9H7.5C5.01472 9 3 11.0147 3 13.5C3 15.9853 5.01472 18 7.5 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5L21 9L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => onAction('save')}
            title="Save"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onAction('print')}
            title="Print"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2H18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 14H6V22H18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Text Formatting */}
      <div className="toolbar-section">
        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('bold')}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('italic')}
            title="Italic"
          >
            <em>I</em>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('underline')}
            title="Underline"
          >
            <u>U</u>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('bullet')}
            title="Bullet List"
          >
            <span>•</span>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('number')}
            title="Numbered List"
          >
            <span>1.</span>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('heading1')}
            title="Heading 1"
          >
            H1
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('heading2')}
            title="Heading 2"
          >
            H2
          </button>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="toolbar-section">
        <div className="toolbar-group">
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('alignLeft')}
            title="Align Left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('alignCenter')}
            title="Align Center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          
          <button 
            className="toolbar-btn"
            onClick={() => onFormat('alignRight')}
            title="Align Right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;