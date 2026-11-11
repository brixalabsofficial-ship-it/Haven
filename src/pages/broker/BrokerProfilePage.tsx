import React, { useState } from 'react';
import { UserSquare2, ShieldCheck, Save, Building, Award, Star } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const BrokerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [agencyName, setAgencyName] = useState(user?.agencyName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [experience, setExperience] = useState(user?.experience || '7+ years in Kozhikode & Malappuram');
  const [description, setDescription] = useState(
    user?.description || 'Specializing in student hostels near NIT Calicut and executive flats.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      agencyName,
      phone,
      email,
      experience,
      description,
    });
    toast.success('Broker profile updated successfully');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Broker Profile & Verification</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Public profile presented to tenants upon unlocking contact information.
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-md overflow-hidden bg-primary text-gold font-bold text-2xl flex items-center justify-center shrink-0 border-2 border-gold/40 shadow-sm">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name.charAt(0) || 'B'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                Verified Haven Broker
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.agencyName}</p>
            <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
              <span className="flex items-center gap-1 font-semibold text-gold-dark">
                <Star size={13} className="fill-gold" />
                {user?.rating || 4.9} Rating
              </span>
              <span>•</span>
              <span>{user?.totalReviews || 84} Verified Inquiries</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Broker Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Agency / Brand Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Experience & Coverage Area</label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Bio / Profile Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-2.5 rounded-md shadow-sm flex items-center gap-2"
            >
              <Save size={14} className="text-gold" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
