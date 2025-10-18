import React from 'react';

const UserAvatar = ({ user, size = 'md', showTooltip = true }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  // Safe user data handling
  const safeUser = user || { username: 'Unknown', color: '#6b7280' };
  
  const getInitials = (username) => {
    if (!username) return '??';
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative group">
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm`}
        style={{ backgroundColor: safeUser.color }}
      >
        {getInitials(safeUser.username)}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {safeUser.username}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;