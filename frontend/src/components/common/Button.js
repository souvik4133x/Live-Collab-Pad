import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'purple', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = "btn font-bold py-2 px-4 rounded transition-all duration-200";
  const variants = {
    purple: "bg-purple-600 hover:bg-purple-700 text-white",
    pink: "bg-pink-600 hover:bg-pink-700 text-white",
    gray: "bg-gray-600 hover:bg-gray-700 text-white"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;