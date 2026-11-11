import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Building2, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFavouritesStore } from '../../stores/favouritesStore';

export const MobileBottomBar: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { savedPropertyIds } = useFavouritesStore();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_10px_35px_0_rgba(8,61,46,0.16)] p-1.5 flex items-center justify-around transition-all rounded-[12px]">
      {/* Home */}
      <Link
        to="/"
        className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-1 transition-all rounded-[8px] ${
          isActive('/')
            ? 'bg-primary/10 text-primary font-bold shadow-xs'
            : 'text-gray-600 hover:text-primary hover:bg-white/60 active:scale-95'
        }`}
      >
        <Home size={19} className={isActive('/') ? 'text-primary' : 'text-gray-500'} />
        <span className="text-[10px] tracking-tight">Home</span>
      </Link>

      {/* Explore */}
      <Link
        to="/explore"
        className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-1 transition-all rounded-[8px] ${
          isActive('/explore')
            ? 'bg-primary/10 text-primary font-bold shadow-xs'
            : 'text-gray-600 hover:text-primary hover:bg-white/60 active:scale-95'
        }`}
      >
        <Compass size={19} className={isActive('/explore') ? 'text-primary' : 'text-gray-500'} />
        <span className="text-[10px] tracking-tight">Explore</span>
      </Link>

      {/* Saved */}
      <Link
        to="/user/saved"
        className={`flex-1 relative flex flex-col items-center gap-1 py-1.5 px-1 transition-all rounded-[8px] ${
          isActive('/user/saved')
            ? 'bg-primary/10 text-primary font-bold shadow-xs'
            : 'text-gray-600 hover:text-primary hover:bg-white/60 active:scale-95'
        }`}
      >
        <div className="relative">
          <Heart size={19} className={isActive('/user/saved') ? 'text-primary fill-primary/20' : 'text-gray-500'} />
          {savedPropertyIds.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-gold text-white text-[9px] font-bold px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-[4px]">
              {savedPropertyIds.length}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Saved</span>
      </Link>

      {/* List / Broker */}
      <Link
        to="/broker/dashboard"
        className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-1 transition-all rounded-[8px] ${
          isActive('/broker')
            ? 'bg-gold/20 text-gold-dark font-bold shadow-xs'
            : 'text-gray-600 hover:text-gold-dark hover:bg-white/60 active:scale-95'
        }`}
      >
        <Building2 size={19} className={isActive('/broker') ? 'text-gold-dark' : 'text-gray-500'} />
        <span className="text-[10px] tracking-tight">Broker</span>
      </Link>

      {/* Account / Portal */}
      <Link
        to={
          isAuthenticated
            ? user?.role === 'broker'
              ? '/broker/dashboard'
              : '/user/dashboard'
            : '/login'
        }
        className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-1 transition-all rounded-[8px] ${
          isActive('/user/dashboard') || isActive('/user/profile') || isActive('/login')
            ? 'bg-primary/10 text-primary font-bold shadow-xs'
            : 'text-gray-600 hover:text-primary hover:bg-white/60 active:scale-95'
        }`}
      >
        <User
          size={19}
          className={
            isActive('/user/dashboard') || isActive('/user/profile') || isActive('/login')
              ? 'text-primary'
              : 'text-gray-500'
          }
        />
        <span className="text-[10px] tracking-tight truncate max-w-full">
          {isAuthenticated ? (user?.role === 'broker' ? 'Desk' : 'Portal') : 'Sign In'}
        </span>
      </Link>
    </nav>
  );
};
