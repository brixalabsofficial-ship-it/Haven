import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart, 
  KeyRound, 
  ReceiptText, 
  UserCircle, 
  Settings, 
  LogOut, 
  Search
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { MobileBottomBar } from '../navigation/MobileBottomBar';
import { toast } from 'sonner';

interface UserLayoutProps {
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Saved Properties', path: '/user/saved', icon: Heart },
    { label: 'Unlocked Contacts', path: '/user/unlocked', icon: KeyRound },
    { label: 'Payment History', path: '/user/payments', icon: ReceiptText },
    { label: 'My Profile', path: '/user/profile', icon: UserCircle },
    { label: 'Settings', path: '/user/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Sidebar Desktop only */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Logo size="sm" />
          </div>

          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden bg-primary text-white font-medium flex items-center justify-center shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name.charAt(0) || 'U'
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{user?.name}</h4>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                <span className="inline-block mt-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.2">
                  Tenant
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-gold' : 'text-gray-400'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/explore"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Search size={16} />
            Search Properties
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium text-destructive hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" className="md:hidden mr-1" showTagline={false} />
            <h1 className="text-base md:text-lg font-bold text-gray-900 truncate">Tenant Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explore"
              className="text-xs font-medium bg-primary text-white hover:bg-primary-hover px-3.5 py-1.5 transition-colors flex items-center gap-1.5"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Explore Stays</span>
              <span className="sm:hidden">Explore</span>
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
