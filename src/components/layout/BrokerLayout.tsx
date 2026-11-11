import React from 'react';
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
  ShieldCheck
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

  const handleLogout = () => {
    logout();
    toast.success('Signed out of Broker Desk');
    navigate('/');
  };

  const navItems = [
    { label: 'Overview & Analytics', path: '/broker/dashboard', icon: BarChart3 },
    { label: 'My Listings', path: '/broker/listings', icon: Building },
    { label: 'Add Property', path: '/broker/listings/new', icon: PlusCircle },
    { label: 'Contact Unlocks & Leads', path: '/broker/unlocks', icon: KeyRound },
    { label: 'Earnings & Payouts', path: '/broker/earnings', icon: Coins },
    { label: 'Broker Profile', path: '/broker/profile', icon: UserSquare2 },
    { label: 'Settings', path: '/broker/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar Desktop only */}
      <aside className="hidden md:flex w-64 bg-primary text-white flex-col justify-between shrink-0 shadow-premium">
        <div>
          <div className="p-6 border-b border-primary-light/40 flex items-center justify-between">
            <Logo variant="light" size="sm" />
          </div>

          <div className="p-4 border-b border-primary-light/40 bg-primary-hover/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden bg-gold text-primary font-bold flex items-center justify-center shrink-0">
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
                <span className="inline-block mt-0.5 text-[9px] font-semibold tracking-wider uppercase bg-gold/20 text-gold px-2 py-0.5">
                  Verified Broker
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gold text-primary font-bold shadow-sm'
                      : 'text-gray-200 hover:text-white hover:bg-primary-light/50'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-primary' : 'text-gray-300'} />
                  {item.label}
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
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-primary-light/40 transition-colors"
          >
            <span>View Public Marketplace</span>
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" className="md:hidden mr-1" showTagline={false} />
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                Broker Workspace
              </span>
              <h1 className="text-sm md:text-lg font-bold text-gray-900 leading-tight truncate">
                Property Management & Leads
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/broker/listings/new"
              className="text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-3 md:px-4 py-2 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle size={15} className="text-gold" />
              <span className="hidden sm:inline">Add New Property</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>

      {/* Glass Mobile Bottom Bar */}
      <MobileBottomBar />
    </div>
  );
};
