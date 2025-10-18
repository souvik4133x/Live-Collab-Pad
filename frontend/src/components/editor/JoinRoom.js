import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import Button from '../common/Button';

const JoinRoom = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [roomCreated, setRoomCreated] = useState(false);
  const { dispatch } = useEditor();

  const generateRoomId = () => {
    const adjectives = ['Swift', 'Bright', 'Clear', 'Quick', 'Smart', 'Fresh', 'Calm', 'Wise', 'Bold', 'Deep'];
    const nouns = ['Tiger', 'Eagle', 'Ocean', 'Forest', 'River', 'Mountain', 'Star', 'Sun', 'Moon', 'Cloud'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${adjective}${noun}${number}`;
  };

  const handleCreateRoom = () => {
    if (usernameInput.trim()) {
      const roomId = generateRoomId();
      setGeneratedRoomId(roomId);
      setRoomCreated(true);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomIdInput.trim() && usernameInput.trim()) {
      dispatch({
        type: 'JOIN_ROOM',
        payload: {
          room: roomIdInput.trim(),
          username: usernameInput.trim() || 'Anonymous'
        }
      });
    }
  };

  const copyRoomId = (roomId) => {
    navigator.clipboard.writeText(roomId);
  };

  const confirmJoinRoom = () => {
    if (generatedRoomId && usernameInput.trim()) {
      dispatch({
        type: 'JOIN_ROOM',
        payload: {
          room: generatedRoomId,
          username: usernameInput.trim() || 'Anonymous'
        }
      });
    }
  };

  const resetCreateRoom = () => {
    setGeneratedRoomId('');
    setRoomCreated(false);
  };

  return (
    <div className="join-room-container">
      <div className="join-room-header">
        <div className="join-room-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2>Start Collaborating</h2>
        <p>Create a new room or join an existing one</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('create');
            resetCreateRoom();
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create Room
        </button>
        <button 
          className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Join Room
        </button>
      </div>

      {/* Username Input (Common for both tabs) */}
      <div className="form-group">
        <div className="input-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="input-icon">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your name"
            className="form-input"
          />
        </div>
      </div>

      {/* Create Room Tab */}
      {activeTab === 'create' && (
        <div className="tab-content">
          {!roomCreated ? (
            <>
              <div className="room-preview">
                <div className="room-info">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="info-icon">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <h3>Ready to Create a Room?</h3>
                  <p>Click the button below to generate a unique Room ID.</p>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateRoom}
                variant="primary" 
                className="action-btn"
                disabled={!usernameInput.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="btn-icon">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Generate Room ID
              </Button>
            </>
          ) : (
            <>
              <div className="room-preview created">
                <div className="success-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="room-id-display">
                  <span className="room-id-label">Your Room ID:</span>
                  <div className="room-id-value">
                    {generatedRoomId}
                    <button 
                      className="copy-btn"
                      onClick={() => copyRoomId(generatedRoomId)}
                      title="Copy Room ID"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M16 8V6C16 5.46957 15.7893 4.96086 15.4142 4.58579C15.0391 4.21071 14.5304 4 14 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V14C4 14.5304 4.21071 15.0391 4.58579 15.4142C4.96086 15.7893 5.46957 16 6 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 8H18C18.5304 8 19.0391 8.21071 19.4142 8.58579C19.7893 8.96086 20 9.46957 20 10V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H10C9.46957 20 8.96086 19.7893 8.58579 19.4142C8.21071 19.0391 8 18.5304 8 18V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="room-instruction">
                  Share this Room ID with others so they can join your collaboration session.
                </p>
              </div>
              
              <div className="action-buttons">
                <Button 
                  onClick={confirmJoinRoom}
                  variant="primary" 
                  className="action-btn join-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="btn-icon">
                    <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Enter Room
                </Button>
                <Button 
                  onClick={resetCreateRoom}
                  variant="secondary" 
                  className="action-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="btn-icon">
                    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Generate New ID
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Join Room Tab */}
      {activeTab === 'join' && (
        <form onSubmit={handleJoinRoom} className="tab-content">
          <div className="form-group">
            <div className="input-container">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="input-icon">
                <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 10L12 14L8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Enter Room ID"
                className="form-input"
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            variant="primary" 
            className="action-btn"
            disabled={!roomIdInput.trim() || !usernameInput.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="btn-icon">
              <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Join Room
          </Button>
        </form>
      )}

      {/* Features List */}
      <div className="join-room-features">
        <div className="feature">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 12H4M12 2V4M20 12H22M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Auto-generated Room IDs</span>
        </div>
        <div className="feature">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M19.4 15C19.2669 15.3031 19.1337 15.6062 19.0006 15.9094C18.5298 16.9271 18.0589 17.9448 17.5881 18.9625C17.2806 19.6421 16.5594 20 15.8281 20H8.17188C7.44063 20 6.71937 19.6421 6.41187 18.9625C5.47031 16.95 4.52875 14.9375 3.58719 12.925C3.34656 12.3414 3.34656 11.6586 3.58719 11.075C4.52875 9.0625 5.47031 7.05 6.41187 5.0375C6.71937 4.35791 7.44063 4 8.17188 4H15.8281C16.5594 4 17.2806 4.35791 17.5881 5.0375C18.0589 6.0552 18.5298 7.0729 19.0006 8.0906C19.1337 8.3938 19.2669 8.6969 19.4 9" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>No sign-up required</span>
        </div>
        <div className="feature">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.27002 6.96002L12 12L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Real-time collaboration</span>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;