import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  Check, 
  RefreshCcw, 
  Building2,
  MapPin,
  Sparkles,
  Crosshair,
  Loader2,
  MapPinOff,
  Navigation
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PropertyCard } from '../../components/property/PropertyCard';
import { usePropertyStore } from '../../stores/propertyStore';
import {
  Property,
  PropertyCategory,
  GenderPreference,
  OccupancyType,
  FurnishingStatus,
} from '../../types';
import { formatINR } from '../../utils';
import {
  Coordinates,
  formatDistance,
  getCurrentPosition,
  haversineDistanceKm,
  resolvePropertyCoordinates,
} from '../../utils/geo';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties } = usePropertyStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read filter query params
  const querySearch = searchParams.get('search') || searchParams.get('location') || '';
  const queryCategory = (searchParams.get('category') as PropertyCategory | 'All') || 'All';
  const queryCity = searchParams.get('city') || 'All';
  const queryMaxRent = searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : 100000;
  const queryTypeGroup = searchParams.get('type') || '';

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'All'>(queryCategory);
  const [selectedCity, setSelectedCity] = useState<string>(queryCity);
  const [maxRent, setMaxRent] = useState<number>(queryMaxRent);
  const [selectedGender, setSelectedGender] = useState<GenderPreference | 'All'>('All');
  const [selectedOccupancy, setSelectedOccupancy] = useState<OccupancyType | 'All'>('All');
  const [selectedFurnishing, setSelectedFurnishing] = useState<FurnishingStatus | 'All'>('All');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    'newest' | 'price_low' | 'price_high' | 'popularity' | 'distance'
  >('newest');

  // "Near Me" location state
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'active' | 'error'>('idle');
  const [geoError, setGeoError] = useState('');
  const [radiusKm, setRadiusKm] = useState(0); // 0 = any distance

  const nearRequested = searchParams.get('near') === '1';

  const requestNearMe = useCallback(async () => {
    setGeoStatus('locating');
    setGeoError('');

    try {
      const coords = await getCurrentPosition();
      setUserLocation(coords);
      setGeoStatus('active');
      setSortBy('distance');
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('near', '1');
          return next;
        },
        { replace: true }
      );
      toast.success('Showing verified stays nearest to you');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to access your location.';
      setGeoStatus('error');
      setGeoError(message);
      toast.error(message);
    }
  }, [setSearchParams]);

  const clearNearMe = useCallback(() => {
    setUserLocation(null);
    setGeoStatus('idle');
    setGeoError('');
    setRadiusKm(0);
    setSortBy((current) => (current === 'distance' ? 'newest' : current));
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('near');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const distanceTo = useCallback(
    (property: Property): number | null => {
      if (!userLocation) return null;
      const coords = resolvePropertyCoordinates(property);
      if (!coords) return null;
      return haversineDistanceKm(userLocation, coords);
    },
    [userLocation]
  );

  // Auto-start geolocation when arriving from a "Near Me" link
  React.useEffect(() => {
    if (nearRequested && !userLocation && geoStatus === 'idle') {
      void requestNearMe();
    }
  }, [nearRequested, userLocation, geoStatus, requestNearMe]);

  // Sync state whenever URL search parameters change (e.g. clicking Navbar links)
  React.useEffect(() => {
    setSearchTerm(searchParams.get('search') || searchParams.get('location') || '');
    setSelectedCategory((searchParams.get('category') as PropertyCategory | 'All') || 'All');
    setSelectedCity(searchParams.get('city') || 'All');
    if (searchParams.get('maxRent')) {
      setMaxRent(Number(searchParams.get('maxRent')));
    }
  }, [searchParams]);

  const categories: (PropertyCategory | 'All')[] = [
    'All',
    'Hostels',
    'PG Accommodation',
    'Shared Rooms',
    'Private Rooms',
    'Flats',
    'Apartments',
    'Houses',
  ];

  const cities = ['All', 'Kozhikode', 'Ramanattukara', 'Feroke', 'Kochi', 'Malappuram', 'Tirur', 'Bengaluru'];

  const amenitiesList = [
    'Wi-Fi',
    'Food',
    'AC',
    'Parking',
    'Power backup',
    'CCTV',
    'Attached bathroom',
    'Laundry',
    'Drinking water',
    'Housekeeping',
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setMaxRent(100000);
    setSelectedGender('All');
    setSelectedOccupancy('All');
    setSelectedFurnishing('All');
    setSelectedAmenities([]);
    setSortBy('newest');
    setUserLocation(null);
    setGeoStatus('idle');
    setGeoError('');
    setRadiusKm(0);
    setSearchParams({});
  };

  // Filtered & Sorted Properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        // Status filter: only published properties
        if (p.status !== 'published') return false;

        // Search text: title, description, locality, city
        if (searchTerm.trim()) {
          const s = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(s);
          const matchLoc = p.locality.toLowerCase().includes(s);
          const matchCity = p.city.toLowerCase().includes(s);
          const matchCat = p.category.toLowerCase().includes(s);
          if (!matchTitle && !matchLoc && !matchCity && !matchCat) return false;
        }

        // Navbar compound types: Hostels & PG or Flats & Apartments
        if (queryTypeGroup === 'hostels-pg') {
          if (p.category !== 'Hostels' && p.category !== 'PG Accommodation') return false;
        } else if (queryTypeGroup === 'flats-apartments') {
          if (p.category !== 'Flats' && p.category !== 'Apartments') return false;
        } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // City
        if (selectedCity !== 'All' && p.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

        // Max Rent
        if (p.monthlyRent > maxRent) return false;

        // Gender preference
        if (selectedGender !== 'All' && p.genderPreference !== 'Any' && p.genderPreference !== selectedGender) {
          return false;
        }

        // Occupancy
        if (selectedOccupancy !== 'All' && p.occupancyType !== selectedOccupancy) return false;

        // Furnishing
        if (selectedFurnishing !== 'All' && p.furnishing !== selectedFurnishing) return false;

        // Amenities
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) => p.amenities.includes(amenity));
          if (!hasAll) return false;
        }

        // Distance radius (only when "Near Me" is active)
        if (userLocation && radiusKm > 0) {
          const distance = distanceTo(p);
          if (distance === null || distance > radiusKm) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && userLocation) {
          const distanceA = distanceTo(a) ?? Number.POSITIVE_INFINITY;
          const distanceB = distanceTo(b) ?? Number.POSITIVE_INFINITY;
          return distanceA - distanceB;
        }
        if (sortBy === 'price_low') return a.monthlyRent - b.monthlyRent;
        if (sortBy === 'price_high') return b.monthlyRent - a.monthlyRent;
        if (sortBy === 'popularity') return b.viewCount + b.unlockCount * 5 - (a.viewCount + a.unlockCount * 5);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    properties,
    searchTerm,
    selectedCategory,
    selectedCity,
    maxRent,
    selectedGender,
    selectedOccupancy,
    selectedFurnishing,
    selectedAmenities,
    sortBy,
    queryTypeGroup,
    userLocation,
    radiusKm,
    distanceTo,
  ]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedCategory !== 'All' || queryTypeGroup ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    (maxRent < 100000 ? 1 : 0) +
    (selectedGender !== 'All' ? 1 : 0) +
    (selectedOccupancy !== 'All' ? 1 : 0) +
    (selectedFurnishing !== 'All' ? 1 : 0) +
    selectedAmenities.length +
    (userLocation ? 1 : 0) +
    (userLocation && radiusKm > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Search & Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Properties</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Showing <span className="font-semibold text-primary">{filteredProperties.length}</span> verified accommodations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[190px] md:w-80 md:flex-none">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, title, locality..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Near Me Toggle */}
          {userLocation ? (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold shadow-xs shrink-0">
              <Navigation size={14} className="text-gold" />
              <span>Near Me On</span>
              <button
                onClick={clearNearMe}
                aria-label="Turn off near me"
                className="ml-0.5 text-white/70 hover:text-white transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={requestNearMe}
              disabled={geoStatus === 'locating'}
              title="Find properties near my current location"
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-primary text-xs font-semibold border border-gray-200 hover:border-primary/40 shadow-xs transition-colors shrink-0 disabled:opacity-70 disabled:cursor-wait"
            >
              {geoStatus === 'locating' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Crosshair size={14} />
              )}
              <span>{geoStatus === 'locating' ? 'Locating...' : 'Near Me'}</span>
            </button>
          )}

          {/* Distance Radius (visible when location is active) */}
          {userLocation && (
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              aria-label="Distance radius"
              className="text-xs py-2 px-2.5 bg-white border border-gray-200 rounded-md focus:outline-none text-gray-700 shadow-xs cursor-pointer shrink-0"
            >
              <option value={0}>Any distance</option>
              <option value={1}>Within 1 km</option>
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs md:text-sm py-2 px-3 bg-white border border-gray-200 rounded-md focus:outline-none text-gray-700 shadow-xs cursor-pointer shrink-0"
          >
            {userLocation && <option value="distance">Sort: Nearest first</option>}
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
          </select>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-sm shrink-0"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-gold text-primary font-bold rounded-md text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Geolocation error / permission helper */}
      {geoStatus === 'error' && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <MapPinOff size={17} className="shrink-0" />
          <p className="flex-1 leading-relaxed">
            {geoError} Allow location access in your browser settings, then try again to see
            properties sorted by distance.
          </p>
          <button
            onClick={requestNearMe}
            className="shrink-0 bg-amber-900 text-white font-semibold px-3 py-1.5 hover:bg-amber-950 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Property Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 space-y-6 bg-white p-6 rounded-md border border-gray-100 shadow-subtle h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gold" />
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-primary hover:text-gold-dark font-medium flex items-center gap-1"
              >
                <RefreshCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs px-3 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-primary text-white font-medium shadow-xs'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check size={13} className="text-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Location / City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Locations' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Max Rent Range */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Max Monthly Rent
              </label>
              <span className="text-xs font-bold text-primary tabular-nums">
                {maxRent >= 100000 ? 'Any Rent' : formatINR(maxRent)}
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="100000"
              step="1000"
              value={maxRent}
              onChange={(e) => setMaxRent(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₹3,000</span>
              <span>₹50,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Gender Preference
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['All', 'Male', 'Female', 'Family'] as (GenderPreference | 'All')[]).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`text-xs py-1.5 px-2 rounded-md border text-center transition-all ${
                    selectedGender === gender
                      ? 'border-primary bg-primary/5 text-primary font-semibold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Furnishing
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'] as (FurnishingStatus | 'All')[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFurnishing(f)}
                    className={`text-[11px] py-1.5 px-1.5 rounded-md border text-center transition-all truncate ${
                      selectedFurnishing === f
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {f}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Key Amenities
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {amenitiesList.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded-md border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Property Grid Area */}
        <main className="col-span-1 md:col-span-3">
          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-gray-400">Active filters:</span>
              {queryTypeGroup === 'hostels-pg' && (
                <span className="bg-primary text-white text-xs px-2.5 py-1 flex items-center gap-1 font-semibold">
                  Type: Hostels & PG
                  <button onClick={() => setSearchParams({})}><X size={12} /></button>
                </span>
              )}
              {queryTypeGroup === 'flats-apartments' && (
                <span className="bg-primary text-white text-xs px-2.5 py-1 flex items-center gap-1 font-semibold">
                  Type: Flats & Apartments
                  <button onClick={() => setSearchParams({})}><X size={12} /></button>
                </span>
              )}
              {selectedCategory !== 'All' && !queryTypeGroup && (
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}><X size={12} /></button>
                </span>
              )}
              {selectedCity !== 'All' && (
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  City: {selectedCity}
                  <button onClick={() => setSelectedCity('All')}><X size={12} /></button>
                </span>
              )}
              {selectedGender !== 'All' && (
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  For: {selectedGender}
                  <button onClick={() => setSelectedGender('All')}><X size={12} /></button>
                </span>
              )}
              {maxRent < 100000 && (
                <span className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  Under {formatINR(maxRent)}
                  <button onClick={() => setMaxRent(100000)}><X size={12} /></button>
                </span>
              )}
              {selectedAmenities.map((amenity) => (
                <span key={amenity} className="bg-gold/20 text-gold-dark text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  {amenity}
                  <button onClick={() => toggleAmenity(amenity)}><X size={12} /></button>
                </span>
              ))}
              <button
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-md border border-dashed border-gray-300 p-8 space-y-4">
              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No properties matched your criteria</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your budget range, clearing specific amenities, or searching for broader terms like "Kozhikode" or "Hostels".
              </p>
              <button
                onClick={handleClearAll}
                className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-primary-hover shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in">
          <div className="w-full max-h-[85vh] bg-white rounded-md overflow-y-auto p-6 pb-28 sm:pb-6 space-y-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">Filter Properties</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-md border ${
                      selectedCategory === cat
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Apply & Close */}
            <div className="pt-4 flex gap-3 border-t border-gray-100">
              <button
                onClick={handleClearAll}
                className="w-1/3 py-3 border border-gray-200 text-xs font-semibold rounded-md text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-md shadow-sm"
              >
                Show Results ({filteredProperties.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
