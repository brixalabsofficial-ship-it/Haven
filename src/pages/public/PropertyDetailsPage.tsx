import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Heart, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Lock, 
  Calendar, 
  Users, 
  Utensils, 
  Clock, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { usePropertyStore } from '../../stores/propertyStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { useAuthStore } from '../../stores/authStore';
import { PaymentModal } from '../../components/payments/PaymentModal';
import { formatINR, formatDate } from '../../utils';
import { toast } from 'sonner';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { getPropertyById, incrementViewCount } = usePropertyStore();
  const { isContactUnlocked, getUnlockedContact } = usePaymentStore();
  const { toggleSave, isSaved, addRecentlyViewed } = useFavouritesStore();
  const { user } = useAuthStore();

  const property = id ? getPropertyById(id) : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (property) {
      incrementViewCount(property.id);
      addRecentlyViewed(property.id);
      window.scrollTo(0, 0);
    }
  }, [property?.id]);

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Property Listing Not Found</h2>
        <p className="text-sm text-gray-500">The rental accommodation you are looking for may have been removed or leased.</p>
        <Link
          to="/explore"
          className="inline-block bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-sm"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const saved = isSaved(property.id);
  const unlocked = isContactUnlocked(property.id, user?.id);
  const unlockedData = unlocked ? getUnlockedContact(property.id, user?.id) : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} on Haven: ${formatINR(property.monthlyRent)}/mo`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Listing link copied to clipboard!');
    }
  };

  const handleFavoriteClick = () => {
    const newState = toggleSave(property.id);
    if (newState) {
      toast.success('Property saved to your favourites');
    } else {
      toast.info('Removed from saved properties');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to properties</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-md border border-gray-200 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
            title="Share listing"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-md border transition-colors ${
              saved
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-gray-200 text-gray-600 hover:text-red-500 hover:bg-gray-50'
            }`}
            title="Save property"
          >
            <Heart size={16} className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>

      {/* 1. PROPERTY GALLERY */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[460px] rounded-md overflow-hidden shadow-subtle border border-gray-100 relative">
          {/* Main Cover Image (takes 3 cols on desktop) */}
          <div className="md:col-span-3 relative h-full bg-gray-100 group">
            <img
              src={property.images[activeImageIndex] || property.coverImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? property.images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === property.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-black/40 text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <button
              onClick={() => setIsGalleryModalOpen(true)}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
            >
              <Maximize2 size={14} />
              <span>Full View ({property.images.length} photos)</span>
            </button>
          </div>

          {/* Side Thumbnails Column */}
          <div className="hidden md:flex flex-col gap-3 h-full">
            {property.images.slice(0, 3).map((img, idx) => (
              <div
                key={img + idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`flex-1 relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  activeImageIndex === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN DETAILS & BROKER SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Details, Specifications, Amenities, Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div className="space-y-3 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-md">
                {property.category}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                {property.furnishing}
              </span>
              {property.genderPreference && property.genderPreference !== 'Any' && (
                <span className="bg-gold/15 text-gold-dark text-xs px-2.5 py-1 rounded-md font-semibold">
                  For {property.genderPreference}
                </span>
              )}
              {property.status === 'rented' && (
                <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-md font-bold">
                  Currently Rented
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-gold shrink-0" />
              <span>{property.address || `${property.locality}, ${property.city}`}</span>
              {property.landmark && (
                <span className="text-gray-400">({property.landmark})</span>
              )}
            </div>
          </div>

          {/* Quick Snapshot Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-md border border-gray-100 shadow-subtle text-center">
            <div className="p-2 border-r border-gray-100 last:border-none">
              <span className="text-[11px] text-gray-400 uppercase font-bold block mb-1">Occupancy</span>
              <span className="text-sm font-bold text-gray-900">{property.occupancyType}</span>
            </div>
            <div className="p-2 border-r border-gray-100 last:border-none">
              <span className="text-[11px] text-gray-400 uppercase font-bold block mb-1">Available</span>
              <span className="text-sm font-bold text-emerald-700">{property.availableFrom}</span>
            </div>
            <div className="p-2 border-r border-gray-100 last:border-none">
              <span className="text-[11px] text-gray-400 uppercase font-bold block mb-1">Deposit</span>
              <span className="text-sm font-bold text-gray-900 tabular-nums">{formatINR(property.securityDeposit)}</span>
            </div>
            <div className="p-2">
              <span className="text-[11px] text-gray-400 uppercase font-bold block mb-1">Suitable For</span>
              <span className="text-sm font-bold text-gray-900 truncate block">
                {property.suitableFor?.join(', ') || 'All'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">About this property</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Hostel / PG Specific Details */}
          {property.isHostelOrPG && (
            <div className="p-6 bg-gold/5 rounded-md border border-gold/20 space-y-4">
              <div className="flex items-center gap-2">
                <Utensils size={18} className="text-gold-dark" />
                <h4 className="font-bold text-gray-900 text-sm">Hostel & PG Policies</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block mb-0.5">Food Facility:</span>
                  <span className="font-semibold text-gray-800">
                    {property.foodIncluded ? `Included (${property.foodType} Meals)` : 'Self-cooking / Tiffin service'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">Gate Curfew Time:</span>
                  <span className="font-semibold text-gray-800">{property.curfewTime || 'No strict curfew'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block mb-0.5">Check-in & Verification Rule:</span>
                  <span className="text-gray-700">{property.checkInRules || 'Standard ID proof and guardian contact required.'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Amenities & Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-md bg-white border border-gray-100 shadow-xs text-xs font-medium text-gray-800"
                >
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules and restrictions */}
          {property.rules && property.rules.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">House Rules & Terms</h3>
              <ul className="space-y-2">
                {property.rules.map((rule) => (
                  <li key={rule} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-md bg-gold shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Location preview (Static map placeholder without paid API keys) */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Location & Neighborhood</h3>
            <div className="relative rounded-md overflow-hidden h-52 bg-slate-100 border border-gray-200 flex items-center justify-center text-center p-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-md bg-primary text-gold flex items-center justify-center mx-auto shadow-md">
                  <MapPin size={20} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">{property.locality}, {property.city}</h4>
                <p className="text-xs text-gray-500 max-w-sm">
                  {property.address}
                </p>
                <span className="inline-block text-[10px] text-gray-400 bg-white px-2.5 py-0.5 rounded-md border border-gray-200">
                  Static Interactive Demonstration Map
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & ₹49 Broker Unlock Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-md p-6 border border-gray-200 shadow-premium space-y-6">
              {/* Rent Price Header */}
              <div className="pb-5 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary tabular-nums">
                    {formatINR(property.monthlyRent)}
                  </span>
                  <span className="text-xs text-gray-500 font-normal">/ month</span>
                </div>
                {property.maintenanceCharges ? (
                  <p className="text-xs text-gray-500 mt-1">
                    + {formatINR(property.maintenanceCharges)} maintenance
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600 mt-1 font-medium">
                    ✓ Zero extra maintenance fee
                  </p>
                )}
              </div>

              {/* Broker Profile */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-primary text-white font-bold flex items-center justify-center shrink-0">
                    {property.brokerAvatar ? (
                      <img
                        src={property.brokerAvatar}
                        alt={property.brokerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      property.brokerName.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-gray-900">{property.brokerName}</h4>
                      {property.isBrokerVerified && (
                        <ShieldCheck size={16} className="text-emerald-600 fill-emerald-100 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{property.brokerExperience || 'Verified Haven Partner'}</p>
                    <div className="flex items-center gap-1 text-[11px] text-gold-dark font-medium mt-0.5">
                      <span>★ {property.brokerRating || '4.9'}</span>
                      <span className="text-gray-400">• Verified Broker</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Unlock Section: Hidden vs Revealed */}
              {unlocked ? (
                /* REVEALED CONTACT */
                <div className="p-4 bg-emerald-50 rounded-md border border-emerald-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Broker Contact Details Unlocked</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-800 pt-1">
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-md border border-emerald-100">
                      <span className="text-gray-500">Phone:</span>
                      <a href={`tel:${property.brokerPhone}`} className="font-bold text-emerald-800 hover:underline">
                        {property.brokerPhone}
                      </a>
                    </div>
                    <div className="flex justify-between items-center bg-white p-2.5 rounded-md border border-emerald-100">
                      <span className="text-gray-500">WhatsApp:</span>
                      <span className="font-bold text-emerald-800">+{property.brokerWhatsapp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={`tel:${property.brokerPhone}`}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <PhoneCall size={14} />
                      <span>Call Broker</span>
                    </a>
                    <a
                      href={`https://wa.me/${property.brokerWhatsapp}?text=${encodeURIComponent(
                        `Hi ${property.brokerName}, I am contacting you via Haven regarding your listing: ${property.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <p className="text-[10px] text-gray-500 text-center">
                    Saved in your Unlocked Contacts history.
                  </p>
                </div>
              ) : (
                /* LOCKED CONTACT CTA */
                <div className="p-5 bg-primary/5 rounded-md border border-primary/10 space-y-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-primary">Broker Contact Protected</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Direct phone number and WhatsApp access requires a verified unlock.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <span className="text-xs text-gray-500">One-time Unlock Fee:</span>
                    <span className="text-lg font-extrabold text-primary tabular-nums">₹49</span>
                  </div>

                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Unlock Broker Contact (₹49)</span>
                    <ShieldCheck size={14} className="text-gold" />
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Instant demo checkout • Direct phone & WhatsApp reveal
                  </p>
                </div>
              )}

              {/* Safety banner */}
              <div className="pt-2 text-[11px] text-gray-400 space-y-1">
                <p>• Verified property broker identity</p>
                <p>• Never transfer full advance before inspecting the premises in person</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment simulation modal */}
      <PaymentModal
        property={property}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Full-screen Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 backdrop-blur-md animate-in fade-in">
          <div className="flex justify-between items-center text-white pb-4">
            <span className="text-sm font-medium">
              Photo {activeImageIndex + 1} of {property.images.length}
            </span>
            <button
              onClick={() => setIsGalleryModalOpen(false)}
              className="p-2 rounded-md hover:bg-white/10 text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <img
              src={property.images[activeImageIndex]}
              alt="full screen property"
              className="max-h-[85vh] max-w-full object-contain rounded-md"
            />
          </div>
          <div className="flex justify-center gap-2 py-4 overflow-x-auto">
            {property.images.map((img, i) => (
              <img
                key={img + i}
                src={img}
                alt="thumb"
                onClick={() => setActiveImageIndex(i)}
                className={`w-16 h-12 object-cover rounded-md cursor-pointer border-2 ${
                  activeImageIndex === i ? 'border-gold' : 'border-transparent opacity-60'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
