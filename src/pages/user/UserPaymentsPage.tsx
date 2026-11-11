import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ReceiptText, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import { formatDate } from '../../utils';

export const UserPaymentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getTransactionsByUser } = usePaymentStore();

  const transactions = user ? getTransactionsByUser(user.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment & Transaction History</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Log of all simulated ₹49 broker contact unlocks and payment attempts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-md border border-primary/10 w-fit">
          <ShieldCheck size={15} className="text-gold" />
          <span>Simulated ₹49 Gateway Ledger</span>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="bg-white rounded-md border border-gray-100 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase font-semibold">
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Broker</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-900">
                      {txn.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-800 max-w-[200px] truncate">
                      {txn.propertyTitle}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {txn.brokerName}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-gray-500 font-mono">
                      {txn.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 tabular-nums">
                      ₹{txn.amount}.00
                    </td>
                    <td className="py-3.5 px-4">
                      {txn.status === 'successful' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                          <CheckCircle2 size={12} />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-destructive px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                          <AlertCircle size={12} />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {formatDate(txn.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/property/${txn.propertyId}`}
                        className="text-primary hover:text-gold-dark font-semibold inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md p-12 text-center border border-dashed border-gray-200 max-w-lg mx-auto space-y-3">
          <ReceiptText size={28} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-800">No payment records yet</h3>
          <p className="text-xs text-gray-500">
            When you unlock broker contact numbers on Haven, receipts will be listed here.
          </p>
        </div>
      )}
    </div>
  );
};
