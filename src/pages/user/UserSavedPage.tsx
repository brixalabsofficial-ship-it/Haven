import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ArrowRight } from 'lucide-react';
import { useFavouritesStore } from '../../stores/favouritesStore';
import { usePropertyStore } from '../../stores/propertyStore';
import { PropertyCard } from '../../components/property/PropertyCard';

export const UserSavedPage: React.FC = () => {
  const { savedPropertyIds } = useFavouritesStore();
  const { getPropertyById } = usePropertyStore();

  const savedProperties = savedPropertyIds
    .map((id) => getPropertyById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            You have saved <span className="font-semibold text-primary">{savedProperties.length}</span> accommodations to review later.
          </p>
        </div>
        <Link
          to="/explore"
          className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-md shadow-xs hover:bg-primary-hover flex items-center gap-1.5 w-fit"
        >
          <Search size={14} />
          <span>Find More Stays</span>
        </Link>
      </div>

      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-md p-12 text-center border border-dashed border-gray-200 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-md bg-red-50 text-red-400 flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Your saved list is empty</h3>
          <p className="text-xs text-gray-500">
            Click the heart button on any hostel, room, or apartment card while exploring to keep it organized here.
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
