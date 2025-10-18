import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import Button from '../common/Button';

const Header = () => {
  const { state, dispatch } = useEditor();

  const handleLeaveRoom = () => {
    dispatch({ type: 'LEAVE_ROOM' });
  };

  const toggleMobileMenu = () => {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('mobile-open');
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          {/* Left Side - Menu Button (Mobile Only) */}
          <div className="header-left">
            {state.currentRoom && (
              <button 
                className="mobile-menu-button"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Center - Brand */}
          <div className="header-center">
            <div className="brand">
              <h1>Live Collab Pad</h1>
              <p>Real-time document collaboration</p>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="header-right">
            {state.currentRoom && (
              <Button 
                variant="secondary" 
                onClick={handleLeaveRoom}
                className="leave-room-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="btn-icon">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Leave Room
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Overlay */}
      <div 
        className="overlay" 
        onClick={toggleMobileMenu}
      ></div>
    </>
  );
};

export default Header;