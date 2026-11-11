import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemoUser, loginAsDemoBroker } = useAuthStore();

  const [email, setEmail] = useState('user@haven.demo');
  const [password, setPassword] = useState('Demo@123');

  const from = (location.state as any)?.from?.pathname || '/explore';

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email');
      return;
    }
    const success = login(email);
    if (success) {
      toast.success(`Signed in as ${email}`);
      if (email.toLowerCase().includes('broker')) {
        navigate('/broker/dashboard');
      } else {
        navigate(from === '/login' ? '/user/dashboard' : from);
      }
    }
  };

  const handleDemoTenant = () => {
    loginAsDemoUser();
    toast.success('Signed in as Tenant (Demo)');
    navigate('/user/dashboard');
  };

  const handleDemoBroker = () => {
    loginAsDemoBroker();
    toast.success('Signed in as Broker (Demo)');
    navigate('/broker/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-md p-8 shadow-elevated border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back to Haven</h2>
          <p className="text-xs text-gray-500">Sign in to manage listings, saved properties, and unlocked contacts</p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="bg-primary/5 rounded-md p-4 border border-primary/10 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <ShieldCheck size={15} className="text-gold" />
            <span>Instant Demo Logins</span>
          </div>
          <p className="text-[11px] text-gray-600">
            One-click switches between Tenant & Broker persona:
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleDemoTenant}
              className="py-2.5 px-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-md text-xs font-semibold text-center transition-all shadow-xs"
            >
              <div className="flex items-center justify-center gap-1.5">
                <User size={13} className="text-primary" />
                <span>Tenant (Rahul)</span>
              </div>
            </button>
            <button
              onClick={handleDemoBroker}
              className="py-2.5 px-3 bg-primary hover:bg-primary-hover text-white rounded-md text-xs font-semibold text-center transition-all shadow-xs"
            >
              <div className="flex items-center justify-center gap-1.5">
                <Building2 size={13} className="text-gold" />
                <span>Broker (Nihal)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
