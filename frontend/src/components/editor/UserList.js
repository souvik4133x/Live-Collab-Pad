// import React from 'react';
// import { useEditor } from '../../contexts/EditorContext';

// const UserList = () => {
//   const { state } = useEditor();
//   const usersArray = Object.values(state.users || {});

//   return (
//     <div className="sidebar-section">
//       <div className="section-header">
//         <h3>Online Users</h3>
//         <span className="badge badge-primary">{usersArray.length}</span>
//       </div>
      
//       <div className="users-grid">
//         {usersArray.map(user => (
//           <div key={user.id} className="user-card">
//             <div 
//               className="user-color-indicator"
//               style={{ 
//                 backgroundColor: user.color,
//                 width: '12px',
//                 height: '12px',
//                 borderRadius: '50%'
//               }}
//             />
//             <div className="user-info">
//               <div className="user-name">{user.username}</div>
//               <div className="user-status">
//                 <div className="status-indicator"></div>
//                 <span>online</span>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {usersArray.length === 0 && (
//           <div className="empty-state">
//             <div className="empty-state-icon">👥</div>
//             <p>No users online</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserList;

import React from 'react';
import { useEditor } from '../../contexts/EditorContext';

const UserList = () => {
  const { state } = useEditor();
  const usersArray = Object.values(state.users || {});

  return (
    <div className="sidebar-section">
      <div className="section-header">
        <h3>Online Users</h3>
        <span className="user-count">{usersArray.length}</span>
      </div>
      
      <div className="users-container">
        {usersArray.map(user => (
          <div key={user.id} className="user-item">
            <div 
              className="user-avatar"
              style={{ backgroundColor: user.color }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-role">Collaborator</div>
            </div>
            <div className="user-status">
              <div className="status-dot online"></div>
            </div>
          </div>
        ))}
        
        {usersArray.length === 0 && (
          <div className="empty-users">
            <div className="empty-icon">👥</div>
            <div className="empty-text">No users online</div>
            <div className="empty-subtext">Invite others to join!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;