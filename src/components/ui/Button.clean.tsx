type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
};

const Button = ({
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25',
    secondary: 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600 hover:text-white focus:ring-slate-500',
    outline: 'bg-transparent text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
  };
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
    >
      {label}
    </button>
  );
};

export default Button;
