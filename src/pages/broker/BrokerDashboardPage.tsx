import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Eye, 
  KeyRound, 
  Coins, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { useAuthStore } from '../../stores/authStore';
import { usePropertyStore } from '../../stores/propertyStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { formatINR } from '../../utils';

export const BrokerDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getPropertiesByBroker } = usePropertyStore();
  const { getTransactionsByBroker } = usePaymentStore();

  const brokerId = user?.id || 'broker-1';
  const brokerProperties = getPropertiesByBroker(brokerId);
  const brokerTransactions = getTransactionsByBroker(brokerId);

  // Derived metrics from actual data
  const totalListings = brokerProperties.length;
  const activeListings = brokerProperties.filter((p) => p.status === 'published').length;
  const rentedListings = brokerProperties.filter((p) => p.status === 'rented').length;
  const totalViews = brokerProperties.reduce((acc, curr) => acc + curr.viewCount, 0);
  const totalUnlocks = brokerProperties.reduce((acc, curr) => acc + curr.unlockCount, 0);
  const simulatedEarnings = totalUnlocks * 49;

  // Chart data derived from broker properties
  const performanceChartData = brokerProperties.map((p) => ({
    name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
    views: p.viewCount,
    unlocks: p.unlockCount,
    earnings: p.unlockCount * 49,
  }));

  const monthlyTrendData = [
    { month: 'Oct', unlocks: Math.floor(totalUnlocks * 0.25), earnings: Math.floor(totalUnlocks * 0.25) * 49 },
    { month: 'Nov', unlocks: Math.floor(totalUnlocks * 0.35), earnings: Math.floor(totalUnlocks * 0.35) * 49 },
    { month: 'Dec', unlocks: Math.floor(totalUnlocks * 0.40), earnings: Math.floor(totalUnlocks * 0.40) * 49 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-primary text-white rounded-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-premium relative overflow-hidden">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-gold uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Verified Broker Console</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            {user?.agencyName || 'Malabar Living & PG Hub'}
          </h2>
          <p className="text-xs md:text-sm text-gray-200">
            Monitor real-time accommodation inquiries, contact unlocks, and occupancy rates across your listed properties.
          </p>
        </div>

        <div className="z-10 flex gap-3">
          <Link
            to="/broker/listings/new"
            className="bg-gold hover:bg-gold-hover text-primary font-bold text-xs px-5 py-3 rounded-md transition-all shadow-md flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Post New Listing</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-gray-400 block mb-1">Total Listings</span>
          <h3 className="text-2xl font-extrabold text-gray-900 tabular-nums">{totalListings}</h3>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-emerald-600 block mb-1">Active / Live</span>
          <h3 className="text-2xl font-extrabold text-emerald-700 tabular-nums">{activeListings}</h3>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-amber-600 block mb-1">Rented Out</span>
          <h3 className="text-2xl font-extrabold text-amber-700 tabular-nums">{rentedListings}</h3>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-gray-400 block mb-1">Total Views</span>
          <h3 className="text-2xl font-extrabold text-gray-900 tabular-nums">{totalViews}</h3>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-primary block mb-1">Contact Unlocks</span>
          <h3 className="text-2xl font-extrabold text-primary tabular-nums">{totalUnlocks}</h3>
        </div>

        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-subtle">
          <span className="text-[11px] font-semibold text-gold-dark block mb-1">Simulated Value</span>
          <h3 className="text-2xl font-extrabold text-gold-dark tabular-nums">{formatINR(simulatedEarnings)}</h3>
        </div>
      </div>

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Listing Performance */}
        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-subtle space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Listing Engagement</h3>
              <p className="text-xs text-gray-500">Live views and ₹49 unlocks per property</p>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-md">
              Live Data
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#083D2E', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="views" name="Property Views" fill="#083D2E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unlocks" name="Contact Unlocks" fill="#D4A64A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Earnings Trend */}
        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-subtle space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Unlock Growth Trend</h3>
              <p className="text-xs text-gray-500">Monthly contact unlock volume</p>
            </div>
            <span className="text-xs font-semibold text-gold-dark bg-gold/10 px-2.5 py-1 rounded-md">
              Quarterly
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#083D2E', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="unlocks" stroke="#D4A64A" strokeWidth={2} fillOpacity={1} fill="#D4A64A" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Properties Quick Table */}
      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Your Property Portfolio</h3>
          <Link
            to="/broker/listings"
            className="text-xs font-semibold text-primary hover:text-gold-dark flex items-center gap-1"
          >
            <span>Manage All ({brokerProperties.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                <th className="py-2.5 px-3">Listing</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Rent</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Views</th>
                <th className="py-2.5 px-3">Unlocks</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brokerProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img src={prop.coverImage} alt={prop.title} className="w-10 h-10 rounded-md object-cover" />
                      <span className="font-semibold text-gray-900 max-w-[200px] truncate">{prop.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{prop.category}</td>
                  <td className="py-3 px-3 font-bold text-gray-900 tabular-nums">{formatINR(prop.monthlyRent)}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      prop.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 tabular-nums text-gray-600">{prop.viewCount}</td>
                  <td className="py-3 px-3 tabular-nums font-bold text-primary">{prop.unlockCount}</td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/broker/listings/${prop.id}/edit`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
