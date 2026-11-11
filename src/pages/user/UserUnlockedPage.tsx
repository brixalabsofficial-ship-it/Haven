import React from 'react';
import { Link } from 'react-router-dom';
import { 
  KeyRound, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight, 
  Building, 
  CheckCircle2, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { usePaymentStore } from '../../stores/paymentStore';
import { formatINR, formatDate } from '../../utils';

export const UserUnlockedPage: React.FC = () => {
  const { unlockedContacts } = usePaymentStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Unlocked Broker Contacts</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          All property broker numbers and WhatsApp links unlocked via one-time ₹49 payments.
        </p>
      </div>

      {unlockedContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unlockedContacts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-md border border-gray-100 shadow-subtle p-5 flex flex-col justify-between hover:shadow-premium transition-all space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.propertyCoverImage}
                  alt={item.propertyTitle}
                  className="w-24 h-24 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block mb-1">
                    {item.propertyCategory}
                  </span>
                  <Link to={`/property/${item.propertyId}`}>
                    <h3 className="font-bold text-sm text-gray-900 hover:text-primary transition-colors line-clamp-1">
                      {item.propertyTitle}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{item.propertyLocation}</p>
                  <p className="text-xs font-bold text-primary mt-1 tabular-nums">
                    {formatINR(item.propertyRent)}/mo
                  </p>
                </div>
              </div>

              {/* Unlocked Contact Details */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-md p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Broker:</span>
                  <span className="font-semibold text-gray-800">{item.brokerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Direct Phone:</span>
                  <a href={`tel:${item.brokerPhone}`} className="font-bold text-emerald-800 hover:underline">
                    {item.brokerPhone}
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Unlocked On:</span>
                  <span className="text-gray-600">{formatDate(item.unlockedAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${item.brokerPhone}`}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall size={14} />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${item.brokerWhatsapp}?text=${encodeURIComponent(
                    `Hi ${item.brokerName}, I am contacting you through Haven regarding your property: ${item.propertyTitle}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-md p-12 text-center border border-dashed border-gray-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <KeyRound size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No contacts unlocked yet</h3>
          <p className="text-xs text-gray-500">
            Browse rental listings and unlock a verified broker's direct phone & WhatsApp for ₹49.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-md shadow-sm hover:bg-primary-hover"
          >
            <span>Explore Properties</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};
