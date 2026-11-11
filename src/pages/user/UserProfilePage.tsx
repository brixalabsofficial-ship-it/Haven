import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const UserProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLocation, setPreferredLocation] = useState(user?.preferredLocation || 'Kozhikode');
  const [budget, setBudget] = useState(user?.budget?.toString() || '8500');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      preferredLocation,
      budget: Number(budget),
    });
    toast.success('Tenant profile updated successfully');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tenant Profile</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your personal details and accommodation discovery preferences.
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-primary text-white font-bold text-xl flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{user?.name}</h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md">
                Verified Tenant Account
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Preferred City</label>
              <input
                type="text"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Monthly Budget (₹)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-5 py-2.5 rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save size={14} className="text-gold" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
