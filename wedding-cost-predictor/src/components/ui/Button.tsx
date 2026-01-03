import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;