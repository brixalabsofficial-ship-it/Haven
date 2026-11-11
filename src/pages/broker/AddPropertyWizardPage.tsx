import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Upload, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Utensils
} from 'lucide-react';
import { usePropertyStore } from '../../stores/propertyStore';
import { useAuthStore } from '../../stores/authStore';
import { PropertyCategory, OccupancyType, FurnishingStatus, GenderPreference } from '../../types';
import { imageStorage } from '../../services/indexedDbService';
import toast from 'react-hot-toast';

export const AddPropertyWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { addProperty } = usePropertyStore();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Hostels');
  const [description, setDescription] = useState('');
  
  // Location
  const [state, setState] = useState('Kerala');
  const [district, setDistrict] = useState('Kozhikode');
  const [city, setCity] = useState('Kozhikode');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  // Pricing
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [maintenanceCharges, setMaintenanceCharges] = useState('0');

  // Specs
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Furnished');
  const [occupancyType, setOccupancyType] = useState<OccupancyType>('Single');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>('Any');
  const [availableFrom, setAvailableFrom] = useState('Immediately');

  // Hostel specific
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [foodType, setFoodType] = useState<'Veg' | 'Non-Veg' | 'Both'>('Both');
  const [curfewTime, setCurfewTime] = useState('10:00 PM');
  const [checkInRules, setCheckInRules] = useState('College/office ID mandatory at check-in');

  // Amenities
  const availableAmenities = [
    'Wi-Fi', 'Food', 'AC', 'Parking', 'Power backup', 'CCTV',
    'Attached bathroom', 'Laundry', 'Drinking water', 'Housekeeping', 'Elevator', 'Security'
  ];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Wi-Fi', 'Food', 'Drinking water', 'Housekeeping'
  ]);

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [coverIndex, setCoverIndex] = useState(0);

  // Contact
  const [brokerPhone, setBrokerPhone] = useState(user?.phone || '+91 98461 23456');
  const [brokerWhatsapp, setBrokerWhatsapp] = useState('919846123456');

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageId = `img-${Date.now()}-${i}`;
      try {
        const dataUrl = await imageStorage.saveImage(imageId, file);
        setImageUrls((prev) => [...prev, dataUrl]);
        toast.success(`Uploaded ${file.name} to persistent storage`);
      } catch {
        toast.error('Failed to store image in IndexedDB');
      }
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !monthlyRent) {
      toast.error('Please fill required property title and rent');
      return;
    }

    const newProp = addProperty({
      title,
      description: description || `${category} situated in ${locality}, ${city}. Includes modern amenities and direct verified broker access.`,
      category,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit) || Number(monthlyRent),
      maintenanceCharges: Number(maintenanceCharges) || 0,
      state,
      district,
      city,
      locality: locality || city,
      address: address || `${locality}, ${city}, ${state}`,
      landmark,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      furnishing,
      occupancyType,
      genderPreference,
      availableFrom,
      isHostelOrPG: category === 'Hostels' || category === 'PG Accommodation',
      foodIncluded: category === 'Hostels' || category === 'PG Accommodation' ? foodIncluded : false,
      foodType: foodIncluded ? foodType : 'None',
      curfewTime,
      checkInRules,
      amenities: selectedAmenities,
      rules: ['Valid photo identification required', 'Pay rent on or before 5th of every month'],
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'],
      coverImage: imageUrls[coverIndex] || imageUrls[0],
      brokerId: user?.id || 'broker-1',
      brokerName: user?.name || 'Muhammed Nihal',
      brokerPhone,
      brokerWhatsapp,
      brokerAvatar: user?.avatar,
      brokerExperience: user?.experience || 'Verified Local Partner',
      brokerRating: user?.rating || 4.9,
      isBrokerVerified: true,
      status: 'published',
    });

    toast.success('Property published live on Haven Marketplace!');
    navigate('/broker/listings');
  };

  const steps = [
    'Basic Info',
    'Location',
    'Pricing',
    'Specs & Hostels',
    'Amenities',
    'Photos',
    'Review',
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">List a Rental Accommodation</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Step-by-step verified property onboarding with instant photo persistence.
        </p>
      </div>

      {/* Wizard Progress Tracker */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-gray-100">
        {steps.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isDone = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;
          return (
            <button
              key={stepName}
              type="button"
              onClick={() => setCurrentStep(stepNum)}
              className="flex items-center gap-1.5 text-xs shrink-0 px-2 py-1"
            >
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-primary text-gold ring-2 ring-gold/40'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <Check size={12} /> : stepNum}
              </span>
              <span className={`font-medium ${isCurrent ? 'text-primary font-bold' : 'text-gray-400'}`}>
                {stepName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-md border border-gray-100 shadow-subtle p-6 md:p-8">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 1: Basic Information</h3>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Property Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Silver Crest Executive Boys Hostel & PG"
                required
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Accommodation Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Hostels">Hostels</option>
                <option value="PG Accommodation">PG Accommodation</option>
                <option value="Shared Rooms">Shared Rooms</option>
                <option value="Private Rooms">Private Rooms</option>
                <option value="Flats">Flats</option>
                <option value="Apartments">Apartments</option>
                <option value="Houses">Houses</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details on surrounding transport, colleges, room ventilation, study desks, and food menu..."
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 2: Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">City / Town *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kozhikode, Ramanattukara, Kochi..."
                  required
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Locality / Area *</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. NIT Campus, Kakkanad, Beach Road..."
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Prominent Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. 500m behind Metro Hypermarket"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building number..."
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 3: Rental Pricing & Deposit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="e.g. 6500"
                  required
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary font-bold text-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder="e.g. 10000"
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Maintenance Charges (₹/mo)</label>
              <input
                type="number"
                value={maintenanceCharges}
                onChange={(e) => setMaintenanceCharges(e.target.value)}
                placeholder="0 if included"
                className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Specs & Hostel specific */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 4: Specifications & Rules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Occupancy</label>
                <select
                  value={occupancyType}
                  onChange={(e) => setOccupancyType(e.target.value as OccupancyType)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <option value="Single">Single Sharing</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Four+">Four-Person Sharing</option>
                  <option value="Entire Place">Entire Place</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Furnishing</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as FurnishingStatus)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Gender</label>
                <select
                  value={genderPreference}
                  onChange={(e) => setGenderPreference(e.target.value as GenderPreference)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <option value="Any">Any / Co-Living</option>
                  <option value="Male">Boys Only</option>
                  <option value="Female">Girls Only</option>
                  <option value="Family">Family Only</option>
                </select>
              </div>
            </div>

            {/* Hostel / PG Section */}
            {(category === 'Hostels' || category === 'PG Accommodation') && (
              <div className="p-4 bg-gold/10 rounded-md border border-gold/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Utensils size={15} className="text-gold-dark" />
                  <span>Hostel / PG Mandatory Parameters</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={foodIncluded}
                      onChange={(e) => setFoodIncluded(e.target.checked)}
                      className="rounded-md text-primary focus:ring-primary"
                    />
                    <span>Food / Meals Included in Rent</span>
                  </label>

                  {foodIncluded && (
                    <select
                      value={foodType}
                      onChange={(e) => setFoodType(e.target.value as any)}
                      className="p-2 bg-white border border-gray-200 rounded-md text-xs"
                    >
                      <option value="Both">Both Veg & Non-Veg</option>
                      <option value="Veg">Pure Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Gate Curfew</label>
                    <input
                      type="text"
                      value={curfewTime}
                      onChange={(e) => setCurfewTime(e.target.value)}
                      placeholder="e.g. 10:00 PM"
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Check-in Rules</label>
                    <input
                      type="text"
                      value={checkInRules}
                      onChange={(e) => setCheckInRules(e.target.value)}
                      placeholder="e.g. College ID required"
                      className="w-full text-xs p-2 bg-white border border-gray-200 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Amenities */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 5: Select Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-md border text-left text-xs font-medium flex items-center justify-between transition-all ${
                      checked
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{amenity}</span>
                    {checked && <Check size={14} className="text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Photos & IndexedDB */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <h3 className="text-base font-bold text-gray-900">Step 6: Photos & Cover Image</h3>
              <p className="text-xs text-gray-500">
                Uploaded images are persisted inside browser IndexedDB for the demo.
              </p>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-md p-6 text-center bg-gray-50/50 transition-colors">
              <Upload size={28} className="mx-auto text-gold mb-2" />
              <label className="cursor-pointer">
                <span className="text-xs font-bold text-primary hover:underline">Click to upload photos from device</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WebP supported</p>
            </div>

            {/* Photo List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Current Photo Gallery ({imageUrls.length})</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {imageUrls.map((url, idx) => (
                  <div
                    key={url + idx}
                    className={`relative aspect-[4/3] rounded-md overflow-hidden border-2 group ${
                      coverIndex === idx ? 'border-gold ring-2 ring-gold/40' : 'border-gray-200'
                    }`}
                  >
                    <img src={url} alt="upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverIndex(idx)}
                      className={`absolute bottom-1 left-1 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm ${
                        coverIndex === idx ? 'bg-gold text-primary' : 'bg-black/60 text-white hover:bg-black/80'
                      }`}
                    >
                      {coverIndex === idx ? 'Cover Photo' : 'Set as Cover'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-md transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Publish */}
        {currentStep === 7 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-base font-bold text-gray-900">Step 7: Final Review & Publish</h3>
            
            <div className="bg-gray-50 rounded-md p-4 border border-gray-200 space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-md">
                    {category}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1">{title || 'Untitled Accommodation'}</h4>
                  <p className="text-gray-500">{locality}, {city}, {state}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-primary tabular-nums">
                    ₹{monthlyRent || 0}/mo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
                <div>
                  <span className="text-gray-400 block text-[10px]">Occupancy:</span>
                  <span className="font-semibold text-gray-800">{occupancyType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Furnishing:</span>
                  <span className="font-semibold text-gray-800">{furnishing}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Broker Phone:</span>
                  <span className="font-semibold text-gray-800">{brokerPhone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Photos Uploaded:</span>
                  <span className="font-semibold text-gray-800">{imageUrls.length} images</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Ready for ₹49 Verified Contact Unlock on Haven Marketplace</span>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="text-xs font-semibold px-4 py-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Previous Step</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="text-xs font-bold px-5 py-2.5 rounded-md bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="text-xs font-bold px-6 py-3 rounded-md bg-primary hover:bg-primary-hover text-white flex items-center gap-2 shadow-md transition-colors"
            >
              <Sparkles size={16} className="text-gold" />
              <span>Publish Listing Live</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
