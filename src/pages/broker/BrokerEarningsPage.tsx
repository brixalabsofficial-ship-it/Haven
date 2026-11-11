import React from 'react';
import { Coins, TrendingUp, ShieldCheck, Download } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePropertyStore } from '../../stores/propertyStore';
import { formatINR } from '../../utils';

export const BrokerEarningsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getPropertiesByBroker } = usePropertyStore();

  const brokerProperties = getPropertiesByBroker(user?.id || 'broker-1');
  const totalUnlocks = brokerProperties.reduce((acc, curr) => acc + curr.unlockCount, 0);
  const simulatedEarnings = totalUnlocks * 49;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Earnings & Unlock Payouts</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Simulated broker revenue dashboard tracking ₹49 contact unlocks.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gold/15 text-gold-dark text-xs font-bold px-3 py-1.5 rounded-md border border-gold/30">
          <ShieldCheck size={14} />
          <span>Verified Direct Connection Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs text-gray-500 font-medium">Accumulated Simulated Value</span>
          <h3 className="text-3xl font-extrabold text-primary tabular-nums">{formatINR(simulatedEarnings)}</h3>
          <p className="text-[11px] text-emerald-600 font-medium">From {totalUnlocks} verified unlocks</p>
        </div>

        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs text-gray-500 font-medium">Next Demo Settlement</span>
          <h3 className="text-3xl font-extrabold text-gray-900 tabular-nums">{formatINR(simulatedEarnings)}</h3>
          <p className="text-[11px] text-gray-400">Scheduled bi-weekly cycle</p>
        </div>

        <div className="bg-white p-6 rounded-md border border-gray-100 shadow-subtle space-y-1">
          <span className="text-xs text-gray-500 font-medium">Platform Processing Fee</span>
          <h3 className="text-3xl font-extrabold text-gray-900 tabular-nums">0%</h3>
          <p className="text-[11px] text-emerald-600 font-medium">Zero brokerage commission</p>
        </div>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 space-y-4">
        <h3 className="text-base font-bold text-gray-900">Earnings Breakdown by Property</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                <th className="py-2.5 px-3">Listing</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Total Unlocks</th>
                <th className="py-2.5 px-3">Unit Fee</th>
                <th className="py-2.5 px-3 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brokerProperties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-3 font-semibold text-gray-900">{p.title}</td>
                  <td className="py-3 px-3 text-gray-600">{p.category}</td>
                  <td className="py-3 px-3 tabular-nums font-bold text-primary">{p.unlockCount}</td>
                  <td className="py-3 px-3 text-gray-500">₹49</td>
                  <td className="py-3 px-3 text-right font-extrabold text-gray-900 tabular-nums">
                    {formatINR(p.unlockCount * 49)}
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
