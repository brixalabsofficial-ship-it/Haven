import React from 'react';
import { RotateCcw, ShieldCheck, Database, Trash2 } from 'lucide-react';
import { usePropertyStore } from '../../stores/propertyStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { imageStorage } from '../../services/indexedDbService';
import { toast } from 'sonner';

export const UserSettingsPage: React.FC = () => {
  const { resetToDefault: resetProperties } = usePropertyStore();
  const { resetToDefault: resetPayments } = usePaymentStore();
  const { resetFavourites } = useFavouritesStore();

  const handleResetDemoData = async () => {
    if (window.confirm('Reset all demo state (properties, unlock history, saved items) to factory seed data?')) {
      resetProperties();
      resetPayments();
      resetFavourites();
      await imageStorage.clearAllImages();
      toast.success('All demo data has been reset to defaults');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings & Demo Controls</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Local persistence preferences and application sandbox controls.
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 space-y-6">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">Demo State Management</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Haven stores uploaded listing pictures in browser IndexedDB, and listing states, favorites, and unlock records in LocalStorage.
          </p>
        </div>

        <div className="p-4 bg-red-50/70 border border-red-100 rounded-md flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-red-900">Reset Demo Data</h4>
            <p className="text-[11px] text-red-700">Restore factory properties, clear simulated transactions, and flush IndexedDB</p>
          </div>
          <button
            onClick={handleResetDemoData}
            className="px-3.5 py-2 bg-destructive text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
        </div>

        <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
          <p>• Haven Frontend MVP v1.0.0</p>
          <p>• Architecture ready for future PostgreSQL & Razorpay backend integration</p>
        </div>
      </div>
    </div>
  );
};
