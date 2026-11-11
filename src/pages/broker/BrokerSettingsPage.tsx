import React from 'react';
import { RotateCcw, ShieldAlert, Database, Info } from 'lucide-react';
import { usePropertyStore } from '../../stores/propertyStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { imageStorage } from '../../services/indexedDbService';
import toast from 'react-hot-toast';

export const BrokerSettingsPage: React.FC = () => {
  const { resetToDefault: resetProperties } = usePropertyStore();
  const { resetToDefault: resetPayments } = usePaymentStore();
  const { resetFavourites } = useFavouritesStore();

  const handleResetData = async () => {
    if (window.confirm('Reset all demo state (listings, images, leads) to initial seed data?')) {
      resetProperties();
      resetPayments();
      resetFavourites();
      await imageStorage.clearAllImages();
      toast.success('Broker demo environment reset to factory defaults');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Broker Desk Settings</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Local configuration and demo environment tools.
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 md:p-8 space-y-6">
        <div>
          <h3 className="font-bold text-sm text-gray-900 mb-1">Demo Persistence Controls</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            All listings you publish, status updates (e.g. marked as Rented), and uploaded property images are persisted in your local browser sandbox.
          </p>
        </div>

        <div className="p-4 bg-red-50/70 border border-red-100 rounded-md flex items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-red-900">Reset Demo Data</h4>
            <p className="text-[11px] text-red-700">Restore factory sample listings, clear leads, and purge IndexedDB</p>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 bg-destructive text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Reset Demo</span>
          </button>
        </div>

        <div className="p-4 bg-primary/5 rounded-md border border-primary/10 flex items-start gap-3">
          <Info size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600 space-y-1">
            <span className="font-bold text-primary block">Future Architecture Prepared:</span>
            <p>Designed for easy drop-in replacement with Neon PostgreSQL, Cloudflare R2 / S3 object storage, and Razorpay webhook verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
