import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Building2, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { toast } from 'sonner';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [role, setRole] = useState<UserRole>('tenant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please enter name and email');
      return;
    }

    register({
      name,
      email,
      phone,
      role,
      agencyName: role === 'broker' ? agencyName || 'Independent Broker' : undefined,
    });

    toast.success(`Welcome to Haven, ${name}!`);
    if (role === 'broker') {
      navigate('/broker/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-md p-8 shadow-elevated border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Haven Account</h2>
          <p className="text-xs text-gray-500">Join the modern rental discovery marketplace</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-md">
          <button
            type="button"
            onClick={() => setRole('tenant')}
            className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === 'tenant' ? 'bg-white text-primary shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User size={14} />
            <span>I am a Tenant</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('broker')}
            className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === 'broker' ? 'bg-primary text-white shadow-xs' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Building2 size={14} />
            <span>I am a Broker</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Nair"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98460 00000"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {role === 'broker' && (
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Agency / Property Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Calicut Living Hub"
                className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Register as {role === 'broker' ? 'Broker' : 'Tenant'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
