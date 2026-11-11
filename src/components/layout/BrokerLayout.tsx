import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Building, 
  PlusCircle, 
  KeyRound, 
  Coins, 
  UserSquare2, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { MobileBottomBar } from '../navigation/MobileBottomBar';
import toast from 'react-hot-toast';

interface BrokerLayoutProps {
  children: React.ReactNode;
}

export const BrokerLayout: React.FC<BrokerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out of Broker Desk');
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', fullLabel: 'Overview & Analytics', path: '/broker/dashboard', icon: BarChart3 },
    { label: 'My Listings', fullLabel: 'My Listings', path: '/broker/listings', icon: Building },
    { label: 'Add Property', fullLabel: 'Add Property', path: '/broker/listings/new', icon: PlusCircle },
    { label: 'Unlocks & Leads', fullLabel: 'Contact Unlocks & Leads', path: '/broker/unlocks', icon: KeyRound },
    { label: 'Earnings', fullLabel: 'Earnings & Payouts', path: '/broker/earnings', icon: Coins },
    { label: 'Profile', fullLabel: 'Broker Profile', path: '/broker/profile', icon: UserSquare2 },
    { label: 'Settings', fullLabel: 'Settings', path: '/broker/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-28 md:pb-0">
      {/* Sidebar Desktop only */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col justify-between shrink-0 shadow-premium">
        <div>
          <div className="p-6 border-b border-primary-light/40 flex items-center justify-between">
            <Logo variant="light" size="sm" />
          </div>

          <div className="p-4 border-b border-primary-light/40 bg-primary-hover/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden bg-gold text-primary font-bold flex items-center justify-center shrink-0 rounded-md">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name.charAt(0) || 'B'
                )}
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
                  <ShieldCheck size={14} className="text-gold shrink-0" />
                </div>
                <p className="text-xs text-gray-300 truncate">{user?.agencyName || 'Verified Broker'}</p>
                <span className="inline-block mt-0.5 text-[9px] font-semibold tracking-wider uppercase bg-gold/20 text-gold px-2 py-0.5 rounded">
                  Verified Broker
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors rounded-md ${
                    active
                      ? 'bg-gold text-primary font-bold shadow-sm'
                      : 'text-gray-200 hover:text-white hover:bg-primary-light/50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-primary' : 'text-gray-300'} />
                  {item.fullLabel}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-primary-light/40 space-y-2">
          <Link
            to="/explore"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-primary-light/40 transition-colors rounded-md"
          >
            <span>View Public Marketplace</span>
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors rounded-md"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        {/* Sticky Mobile & Desktop Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 -ml-1 text-gray-700 hover:bg-gray-100 rounded-lg active:scale-95 transition-all"
              aria-label="Open Broker Navigation"
            >
              <Menu size={22} />
            </button>
            <Logo size="sm" showTagline={false} />
            <div className="hidden sm:block pl-2 border-l border-gray-200 min-w-0">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider block">
                Broker Portal
              </span>
              <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">
                {user?.agencyName || 'Property Management & Leads'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/broker/listings/new"
              className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 md:px-4 py-2 transition-colors flex items-center gap-1.5 shadow-sm rounded-lg active:scale-95"
            >
              <PlusCircle size={15} className="text-gold" />
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden font-bold">Add</span>
            </Link>

            <Link
              to="/broker/profile"
              className="w-8 h-8 rounded-full overflow-hidden bg-gold text-primary font-bold flex items-center justify-center text-xs border border-gold/40 shadow-xs shrink-0"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'B'
              )}
            </Link>
          </div>
        </header>

        {/* Mobile Horizontal Sub-Navigation Tab Strip */}
        <div className="md:hidden sticky top-[57px] z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all shrink-0 ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }`}
              >
                <Icon size={14} className={active ? 'text-gold' : 'text-gray-500'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-5 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden animate-in fade-in"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div 
            className="w-4/5 max-w-xs bg-primary text-white h-full flex flex-col justify-between shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-primary-light/40">
                <Logo variant="light" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-gray-300 hover:text-white rounded-lg active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User summary in drawer */}
              <div className="py-4 border-b border-primary-light/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gold text-primary font-bold flex items-center justify-center shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'B'
                  )}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
                  <p className="text-xs text-gray-300 truncate">{user?.agencyName || 'Verified Broker'}</p>
                </div>
              </div>

              {/* Nav links */}
              <nav className="py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-gold text-primary font-bold shadow-sm'
                          : 'text-gray-200 hover:text-white hover:bg-primary-light/50'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-primary' : 'text-gray-300'} />
                      {item.fullLabel}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom drawer actions */}
            <div className="pt-4 border-t border-primary-light/40 space-y-2">
              <Link
                to="/explore"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-primary-light/40 rounded-lg transition-colors"
              >
                <span>View Public Marketplace</span>
                <ExternalLink size={14} />
              </Link>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Glass Mobile Bottom Bar */}
      <MobileBottomBar />
    </div>
  );
};
