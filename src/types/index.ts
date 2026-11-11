export type UserRole = 'tenant' | 'broker';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  agencyName?: string;
  experience?: string; // e.g. "5+ years in Calicut"
  description?: string;
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  rating?: number;
  totalReviews?: number;
  activeListingsCount?: number;
  preferredLocation?: string;
  budget?: number;
  accommodationPreferences?: string[];
  createdAt: string;
}

export type PropertyCategory =
  | 'Hostels'
  | 'PG Accommodation'
  | 'Shared Rooms'
  | 'Private Rooms'
  | 'Flats'
  | 'Apartments'
  | 'Houses';

export type FurnishingStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type OccupancyType = 'Single' | 'Double' | 'Triple' | 'Four+' | 'Entire Place';
export type GenderPreference = 'Any' | 'Male' | 'Female' | 'Family';
export type ListingStatus = 'draft' | 'published' | 'rented' | 'paused' | 'pending_approval';

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  monthlyRent: number;
  securityDeposit: number;
  maintenanceCharges?: number;
  
  // Location
  state: string;
  district: string;
  city: string;
  locality: string;
  address: string;
  landmark?: string;
  mapCoordinates?: { lat: number; lng: number };
  
  // Specs
  bedrooms?: number;
  bathrooms?: number;
  furnishing: FurnishingStatus;
  occupancyType: OccupancyType;
  genderPreference: GenderPreference;
  sharingCapacity?: number;
  suitableFor?: string[]; // e.g. ["Students", "Working Professionals"]
  availableFrom: string;
  
  // Hostel / PG Specific
  isHostelOrPG?: boolean;
  foodIncluded?: boolean;
  foodType?: 'Veg' | 'Non-Veg' | 'Both' | 'None';
  curfewTime?: string;
  checkInRules?: string;

  // Amenities
  amenities: string[]; // ["Wi-Fi", "AC", "Power Backup", ...]
  rules: string[]; // ["No smoking", "Visitors allowed till 8 PM", ...]
  
  // Media
  images: string[];
  coverImage: string;
  blurHash?: string;
  
  // Broker relation
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerWhatsapp: string;
  brokerAvatar?: string;
  brokerExperience?: string;
  brokerRating?: number;
  isBrokerVerified: boolean;
  
  // Stats & Status
  status: ListingStatus;
  viewCount: number;
  unlockCount: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UnlockedContact {
  id: string;
  propertyId: string;
  userId: string;
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerWhatsapp: string;
  propertyTitle: string;
  propertyCategory: string;
  propertyLocation: string;
  propertyCoverImage: string;
  propertyRent: number;
  amountPaid: number;
  unlockedAt: string;
  transactionId: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled';

export interface Transaction {
  id: string; // e.g. HVN-TXN-94821
  propertyId: string;
  propertyTitle: string;
  propertyCategory: string;
  propertyLocation: string;
  brokerId: string;
  brokerName: string;
  userId: string;
  userName: string;
  amount: number; // 49
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentMethodDetails?: {
    upiId?: string;
    cardLast4?: string;
    cardType?: string;
    bankName?: string;
  };
  failureReason?: string;
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  locality: string;
  category: PropertyCategory | 'All';
  minRent: number;
  maxRent: number;
  genderPreference: GenderPreference | 'All';
  occupancyType: OccupancyType | 'All';
  furnishing: FurnishingStatus | 'All';
  amenities: string[];
  availableOnly: boolean;
  sortBy: 'newest' | 'price_low' | 'price_high' | 'popularity';
}
