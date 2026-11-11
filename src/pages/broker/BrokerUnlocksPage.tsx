import React from 'react';
import { KeyRound, ShieldCheck, PhoneCall, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { formatDate } from '../../utils';

export const BrokerUnlocksPage: React.FC = () => {
  const { user } = useAuthStore();
  const { transactions } = usePaymentStore();

  const brokerId = user?.id || 'broker-1';
  // Filter transactions belonging to this broker's properties
  const unlocks = transactions.filter((t) => t.brokerId === brokerId && t.status === 'successful');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Unlocks & Tenant Inquiries</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time log of prospective tenants who unlocked your direct contact via ₹49 fee.
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle overflow-hidden">
        {unlocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Tenant Name</th>
                  <th className="py-3 px-4">Property Inquired</th>
                  <th className="py-3 px-4">Paid Fee</th>
                  <th className="py-3 px-4">Unlocked Date</th>
                  <th className="py-3 px-4">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {unlocks.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-800">{u.id}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{u.userName}</td>
                    <td className="py-3.5 px-4 text-gray-600 max-w-[200px] truncate">{u.propertyTitle}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">₹49.00</td>
                    <td className="py-3.5 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4 uppercase text-gray-400 font-mono text-[11px]">{u.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <KeyRound size={28} className="mx-auto text-gray-300" />
            <h4 className="text-sm font-bold text-gray-700">No contact unlocks yet</h4>
            <p className="text-xs text-gray-400">When tenants unlock your phone number, leads will populate here in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
};
