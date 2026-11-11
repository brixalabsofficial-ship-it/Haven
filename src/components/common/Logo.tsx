import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  showTagline = true,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const taglineSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  const textColor =
    variant === 'light'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-primary'
      : 'text-primary dark:text-white';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-md bg-primary text-gold border border-gold/30 shadow-subtle group-hover:scale-[1.03] transition-transform">
        <Home size={iconSize} className="text-gold stroke-[2.2]" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-md bg-gold border-2 border-white" />
      </div>
      <div className="flex flex-col">
        <span className={`font-sans font-bold tracking-tight leading-none ${textSize} ${textColor}`}>
          Haven<span className="text-gold">.</span>
        </span>
        {showTagline && (
          <span className={`font-sans font-medium tracking-wider text-muted-foreground uppercase mt-0.5 ${taglineSize}`}>
            Rent. List. Connect.
          </span>
        )}
      </div>
    </Link>
  );
};
