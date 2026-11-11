import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  Navigation
} from 'lucide-react';
import { Property } from '../../types';
import { formatINR } from '../../utils';
import { formatDistance } from '../../utils/geo';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { usePaymentStore } from '../../stores/paymentStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface PropertyCardProps {
  property: Property;
  distanceKm?: number;
  onQuickUnlock?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  distanceKm,
  onQuickUnlock,
}) => {
  const { toggleSave, isSaved } = useFavouritesStore();
  const { isContactUnlocked } = usePaymentStore();
  const { user } = useAuthStore();

  const saved = isSaved(property.id);
  const unlocked = isContactUnlocked(property.id, user?.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSave(property.id);
    if (newState) {
      toast.success('Property saved to your favourites');
    } else {
      toast('Removed from saved properties');
    }
  };

  return (
    <div className="group bg-white rounded-md border border-gray-200/90 hover:border-primary/40 shadow-subtle hover:shadow-elevated transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Link to={`/property/${property.id}`} className="block w-full h-full">
          <img
            src={property.coverImage || property.images[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-primary/90 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-sm transition-transform duration-300 group-hover:scale-105">
            {property.category}
          </span>
          {property.featured && (
            <span className="bg-gold text-primary font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Sparkles size={11} className="fill-primary" />
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={saved ? 'Remove from saved' : 'Save property'}
          className={`absolute top-3 right-3 p-2 rounded-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 ${
            saved
              ? 'bg-red-500 text-white shadow-md scale-105'
              : 'bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 shadow-sm'
          }`}
        >
          <Heart size={16} className={saved ? 'fill-current stroke-current' : 'stroke-current'} />
        </button>

        {/* Unlocked Badge Overlay if unlocked */}
        {unlocked && (
          <div className="absolute bottom-3 left-3 bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <CheckCircle2 size={12} />
            Broker Unlocked
          </div>
        )}

        {/* Rent badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-primary shadow-sm tabular-nums border border-gray-100 transition-colors duration-200 group-hover:border-primary/20">
          {formatINR(property.monthlyRent)}
          <span className="text-[10px] text-gray-500 font-normal">/mo</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin size={13} className="text-gold shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="truncate">
                {property.locality}, {property.city}
              </span>
            </div>
            {typeof distanceKm === 'number' && (
              <span
                className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 border border-primary/10 px-1.5 py-0.5 tabular-nums rounded-sm"
                title="Distance from your current location"
              >
                <Navigation size={10} className="text-gold" />
                {formatDistance(distanceKm)}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/property/${property.id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary line-clamp-1 transition-colors duration-200 text-base mb-2">
              {property.title}
            </h3>
          </Link>

          {/* Quick Specs */}
          <div className="flex items-center gap-2.5 text-xs text-gray-600 mb-3 flex-wrap">
            {property.occupancyType && (
              <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 transition-colors duration-200 group-hover:border-primary/20">
                <Users size={12} className="text-gray-400" />
                {property.occupancyType} Sharing
              </span>
            )}
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 transition-colors duration-200 group-hover:border-primary/20">
              {property.furnishing}
            </span>
            {property.genderPreference && property.genderPreference !== 'Any' && (
              <span className="bg-primary/5 text-primary text-[11px] font-medium px-2 py-0.5 rounded-md border border-primary/10">
                For {property.genderPreference}
              </span>
            )}
          </div>

          {/* Amenity tags (first 3) */}
          <div className="flex flex-wrap gap-1 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[10px] text-gray-500 bg-gray-100/70 px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] text-gray-400 self-center">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Broker & Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md overflow-hidden bg-gray-200 shrink-0 ring-1 ring-gray-200 transition-all duration-200 group-hover:ring-primary/40">
              {property.brokerAvatar ? (
                <img
                  src={property.brokerAvatar}
                  alt={property.brokerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-600">
                  {property.brokerName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                {property.brokerName}
              </span>
              {property.isBrokerVerified && (
                <ShieldCheck size={13} className="text-emerald-600 fill-emerald-100 shrink-0" />
              )}
            </div>
          </div>

          {unlocked ? (
            <Link
              to={`/property/${property.id}`}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-md border border-emerald-200 transition-all duration-200 shadow-2xs hover:shadow-xs"
            >
              <span>View Contact</span>
              <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to={`/property/${property.id}`}
              className="text-xs font-semibold text-primary group-hover:text-gold-dark flex items-center gap-1 transition-all duration-200"
            >
              <span>View Details</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
