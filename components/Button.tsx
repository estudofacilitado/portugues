
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  className = "", 
  size = 'md',
  variant = 'primary'
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0";
  
  const variants = {
    primary: "bg-green-500 text-white hover:bg-green-600",
    secondary: "bg-blue-600 text-white hover:bg-blue-700"
  };

  const sizes = {
    md: "px-8 py-4 text-sm",
    lg: "px-12 py-6 text-lg"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
