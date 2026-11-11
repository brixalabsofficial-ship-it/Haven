import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  KeyRound, 
  ReceiptText, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { usePropertyStore } from '../../stores/propertyStore';
import { PropertyCard } from '../../components/property/PropertyCard';
import { formatINR, formatDate } from '../../utils';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { savedPropertyIds, recentlyViewedIds } = useFavouritesStore();
  const { unlockedContacts, getTransactionsByUser } = usePaymentStore();
  const { getPropertyById } = usePropertyStore();

  const userTransactions = user ? getTransactionsByUser(user.id) : [];

  const savedProperties = savedPropertyIds
    .map((id) => getPropertyById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const recentlyViewed = recentlyViewedIds
    .map((id) => getPropertyById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-primary text-white rounded-md p-6 md:p-8 relative overflow-hidden shadow-premium">
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider block">
            Tenant Hub
          </span>
          <h2 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name.split(' ')[0]}!
          </h2>
          <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
            Track your saved stays, unlocked broker connections, and discover newly added PG homes and apartments in your preferred areas.
          </p>
          <div className="pt-2 flex gap-3">
            <Link
              to="/explore"
              className="bg-gold hover:bg-gold-hover text-primary font-bold text-xs px-4 py-2.5 rounded-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <Search size={14} />
              <span>Explore Accommodations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/user/saved"
          className="bg-white p-5 rounded-md border border-gray-100 shadow-subtle hover:border-primary/20 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-md bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Heart size={22} className="fill-current" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Saved Properties</span>
            <h4 className="text-2xl font-bold text-gray-900 tabular-nums">{savedPropertyIds.length}</h4>
          </div>
        </Link>

        <Link
          to="/user/unlocked"
          className="bg-white p-5 rounded-md border border-gray-100 shadow-subtle hover:border-primary/20 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <KeyRound size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Unlocked Contacts</span>
            <h4 className="text-2xl font-bold text-gray-900 tabular-nums">{unlockedContacts.length}</h4>
          </div>
        </Link>

        <Link
          to="/user/payments"
          className="bg-white p-5 rounded-md border border-gray-100 shadow-subtle hover:border-primary/20 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <ReceiptText size={22} />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-medium">Total ₹49 Unlocks</span>
            <h4 className="text-2xl font-bold text-gray-900 tabular-nums">{userTransactions.length}</h4>
          </div>
        </Link>
      </div>

      {/* Unlocked Contacts Quick Preview */}
      {unlockedContacts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">Recently Unlocked Brokers</h3>
            </div>
            <Link
              to="/user/unlocked"
              className="text-xs font-semibold text-primary hover:text-gold-dark flex items-center gap-1"
            >
              <span>View All ({unlockedContacts.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedContacts.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-md border border-emerald-100 shadow-subtle flex gap-4 items-center"
              >
                <img
                  src={item.propertyCoverImage}
                  alt={item.propertyTitle}
                  className="w-20 h-20 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{item.propertyTitle}</h4>
                  <p className="text-xs text-gray-500 mb-2 truncate">Broker: {item.brokerName}</p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${item.brokerPhone}`}
                      className="text-xs bg-emerald-600 text-white font-medium px-3 py-1 rounded-md hover:bg-emerald-700"
                    >
                      Call: {item.brokerPhone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Saved Properties Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Saved Stays ({savedProperties.length})</h3>
          <Link
            to="/user/saved"
            className="text-xs font-semibold text-primary hover:text-gold-dark flex items-center gap-1"
          >
            <span>Manage Saved</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.slice(0, 3).map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-md border border-dashed border-gray-200 text-center space-y-2">
            <Heart size={28} className="mx-auto text-gray-300" />
            <h4 className="text-sm font-semibold text-gray-700">No saved properties yet</h4>
            <p className="text-xs text-gray-400">Tap the heart icon on any stay to bookmark it for later.</p>
          </div>
        )}
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.slice(0, 3).map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
