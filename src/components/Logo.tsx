import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-16 w-auto',
    xl: 'h-24 w-auto',
  };

  if (!showText) {
    // Just the logo symbol
    return (
      <div className={`inline-flex items-center ${className}`}>
        <svg 
          className={sizeClasses[size]}
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Logo Symbol */}
          <rect x="8" y="6" width="24" height="28" fill="var(--color-primary-blue)" rx="3"/>
          <rect x="11" y="9" width="18" height="22" fill="none" stroke="white" strokeWidth="2"/>
          <circle cx="20" cy="20" r="3" fill="white"/>
        </svg>
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg 
        className={sizeClasses[size]}
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Logo Symbol */}
        <rect x="8" y="6" width="24" height="28" fill="var(--color-primary-blue)" rx="3"/>
        <rect x="11" y="9" width="18" height="22" fill="none" stroke="white" strokeWidth="2"/>
        <circle cx="20" cy="20" r="3" fill="white"/>
      </svg>
      
      <div className="flex flex-col">
        <span className="text-neutral-dark font-bold text-lg leading-tight">ASTRA</span>
        <span className="text-accent-orange font-medium text-sm leading-tight">LT</span>
      </div>
    </div>
  );
};

export default Logo;
