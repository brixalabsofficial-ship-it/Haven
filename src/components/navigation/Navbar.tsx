import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home,
  Compass, 
  Heart, 
  User, 
  Menu, 
  X, 
  Building2, 
  LogOut, 
  PlusCircle, 
  KeyRound,
  ReceiptText
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { toast } from 'sonner';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { savedPropertyIds } = useFavouritesStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/explore') {
      return location.pathname === '/explore' && !location.search;
    }
    if (path === '/explore?type=hostels-pg') {
      return location.pathname === '/explore' && location.search.includes('type=hostels-pg');
    }
    if (path === '/explore?type=flats-apartments') {
      return location.pathname === '/explore' && location.search.includes('type=flats-apartments');
    }
    if (path === '/broker/listings/new') {
      return location.pathname.startsWith('/broker');
    }
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore Properties', path: '/explore', icon: Compass },
    { label: 'Hostels & PG', path: '/explore?type=hostels-pg' },
    { label: 'Flats & Apartments', path: '/explore?type=flats-apartments' },
    { label: 'List a Property', path: '/broker/listings/new', icon: Building2, isGold: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo className="shrink-0" />

        {/* Desktop Navigation Links with animated active tab underline */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0 h-full">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap group rounded-md ${
                  active 
                    ? item.isGold ? 'text-gold-dark font-bold' : 'text-primary font-bold'
                    : item.isGold ? 'text-gold-dark hover:text-primary font-semibold' : 'text-gray-600 hover:text-primary hover:bg-gray-50/80'
                }`}
              >
                {Icon && (
                  <Icon 
                    size={16} 
                    className={`transition-colors ${
                      active 
                        ? item.isGold ? 'text-gold-dark' : 'text-primary' 
                        : item.isGold ? 'text-gold' : 'text-gray-400 group-hover:text-primary'
                    }`} 
                  />
                )}
                <span>{item.label}</span>

                {/* Active Tab Animated Indicator / Underline */}
                {active && (
                  <motion.div
                    layoutId="navbar-active-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-primary rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / Auth Buttons for Desktop */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {user.role === 'tenant' ? (
                <>
                  <Link
                    to="/user/saved"
                    className="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors rounded-md"
                    title="Saved properties"
                  >
                    <Heart size={20} />
                    {savedPropertyIds.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-2xs">
                        {savedPropertyIds.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/user/dashboard"
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:border-primary/40 bg-gray-50 text-sm font-medium text-gray-800 transition-all rounded-md shadow-2xs"
                  >
                    <div className="w-6 h-6 overflow-hidden bg-primary text-white flex items-center justify-center text-xs rounded-full">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/broker/dashboard"
                  className="flex items-center gap-2 px-3.5 py-1.5 bg-primary text-white text-sm font-medium hover:bg-primary-hover shadow-sm transition-all whitespace-nowrap rounded-md"
                >
                  <Building2 size={16} className="text-gold" />
                  <span>Broker Desk</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-destructive hover:bg-gray-100 transition-colors rounded-md"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary-hover px-4 py-2 transition-colors whitespace-nowrap rounded-md hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary text-white hover:bg-primary-hover px-4 py-2.5 shadow-sm transition-all whitespace-nowrap rounded-md active:scale-98"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Medium and Mobile (<1280px): Compact, Clean Right Section */}
        <div className="flex xl:hidden items-center gap-2">
          {isAuthenticated && user && (
            <Link
              to={user.role === 'broker' ? '/broker/dashboard' : '/user/dashboard'}
              className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 hover:border-primary/40 rounded-md"
            >
              <div className="w-6 h-6 bg-primary text-white flex items-center justify-center text-xs shrink-0 rounded-full">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className="text-xs font-bold text-primary border border-primary/20 px-3 py-1.5 hover:bg-primary/5 rounded-md"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-primary border border-gray-200 hover:bg-gray-50 focus:outline-none rounded-md"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Slide-down / Dropdown Menu for <1280px Screens */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                isActive('/') ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home size={18} className={isActive('/') ? 'text-gold' : 'text-primary'} />
              <span>Home</span>
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${
                isActive('/explore') && !location.search ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Compass size={18} className={isActive('/explore') && !location.search ? 'text-gold' : 'text-primary'} />
              <span>Explore All Properties</span>
            </Link>
            <Link
              to="/explore?type=hostels-pg"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                location.search.includes('type=hostels-pg') ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 bg-gold shrink-0" />
              <span>Hostels & Student PG</span>
            </Link>
            <Link
              to="/explore?type=flats-apartments"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium ${
                location.search.includes('type=flats-apartments') ? 'bg-primary text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="w-2 h-2 bg-gold shrink-0" />
              <span>Flats & Apartments</span>
            </Link>
            <Link
              to="/broker/listings/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gold-dark hover:bg-gold/10"
            >
              <Building2 size={18} className="text-gold" />
              <span>List a Property (Broker)</span>
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Signed in as {user.name} ({user.role})
                </div>
                {user.role === 'tenant' ? (
                  <>
                    <Link
                      to="/user/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 font-medium"
                    >
                      Tenant Portal Overview
                    </Link>
                    <Link
                      to="/user/saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Saved Properties ({savedPropertyIds.length})
                    </Link>
                    <Link
                      to="/user/unlocked"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Unlocked Broker Contacts
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/broker/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 font-medium"
                    >
                      Broker Workspace Desk
                    </Link>
                    <Link
                      to="/broker/listings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My Listings Portfolio
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-destructive font-medium hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center text-primary font-bold border border-primary/20 text-sm hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-hover"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
