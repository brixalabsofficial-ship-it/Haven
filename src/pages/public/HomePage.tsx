import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Users, 
  CheckCircle,
  Home,
  Check,
  TrendingUp,
  KeyRound,
  Compass,
  Star,
  Wifi,
  Utensils,
  MessageCircle,
  Award,
  Bed,
  Key,
  Building,
  Layers,
  Pause,
  Play
} from 'lucide-react';
import { PropertyCard } from '../../components/property/PropertyCard';
import { usePropertyStore } from '../../stores/propertyStore';
import { PropertyCategory } from '../../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { properties } = usePropertyStore();

  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'All'>('All');
  const [maxBudget, setMaxBudget] = useState('15000');

  const featuredProperties = properties.filter((p) => p.featured || p.viewCount > 150);
  const recentProperties = properties.slice(0, 6);

  // Auto-sliding Featured Properties Row state & handlers
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    const cardWidth = firstChild ? firstChild.offsetWidth : 360;
    const gap = 24;
    const targetScroll = index * (cardWidth + gap);
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    if (container.scrollLeft >= maxScroll - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      setCurrentIndex(0);
    } else {
      const nextIdx = (currentIndex + 1) % featuredProperties.length;
      scrollToIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    if (container.scrollLeft <= 20) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      setCurrentIndex(featuredProperties.length - 1);
    } else {
      const prevIdx = Math.max(currentIndex - 1, 0);
      scrollToIndex(prevIdx);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    const cardWidth = (firstChild ? firstChild.offsetWidth : 360) + 24;
    const index = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(index, 0), featuredProperties.length - 1));
  };

  useEffect(() => {
    if (!isAutoPlay || isHovered || featuredProperties.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3600);
    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, currentIndex, featuredProperties.length]);

  const categories = [
    { 
      label: 'Hostels', 
      count: '12+ Stays', 
      icon: Building2, 
      price: 'From ₹4,500/mo',
      desc: 'Curated boys & girls student hostels with meals & Wi-Fi',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'PG Accommodation', 
      count: '18+ Stays', 
      icon: Bed, 
      price: 'From ₹6,000/mo',
      desc: 'Secure paying guest homes with housekeeping & meals',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'Shared Rooms', 
      count: '8+ Stays', 
      icon: Users, 
      price: 'From ₹3,500/mo',
      desc: 'Budget-friendly shared co-living for students & techies',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'Private Rooms', 
      count: '14+ Stays', 
      icon: Key, 
      price: 'From ₹7,500/mo',
      desc: 'Independent rooms inside villas with attached bathrooms',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'Flats', 
      count: '25+ Stays', 
      icon: Layers, 
      price: 'From ₹12,000/mo',
      desc: '1, 2 & 3 BHK residential flats for families & techies',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'Apartments', 
      count: '10+ Stays', 
      icon: Building, 
      price: 'From ₹16,000/mo',
      desc: 'Gated community high-rises with security, gym & pool',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'Houses', 
      count: '6+ Stays', 
      icon: Home, 
      price: 'From ₹18,000/mo',
      desc: 'Independent villas and heritage compounds with privacy',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    },
    { 
      label: 'All Stays', 
      count: '100+ Stays', 
      icon: Compass, 
      price: 'Direct Unlock',
      desc: 'Explore every verified listing with direct WhatsApp contact',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
    },
  ];

  const popularLocations = [
    { name: 'Kozhikode', subtitle: 'NIT Campus, Medical College & Mavoor Rd', count: '24 Properties', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80' },
    { name: 'Ramanattukara', subtitle: 'Bypass Junction & Feroke', count: '14 Properties', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80' },
    { name: 'Kochi', subtitle: 'Kakkanad Infopark, Edappally & Marine Drive', count: '32 Properties', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Malappuram', subtitle: 'Down Hill, Tirur & Kottakkal', count: '16 Properties', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80' },
    { name: 'Bengaluru', subtitle: 'HSR Layout & Koramangala', count: '45 Properties', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('location', searchLocation.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (maxBudget) params.set('maxRent', maxBudget);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION (CLEAN, MINIMAL & IMPACTFUL) */}
      <section className="relative pt-6 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 bg-[#F8F8F8] overflow-hidden border-b border-gray-100">
        {/* Subtle decorative background accents */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#083D2E_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-8 sm:mb-10">
            {/* Clean, Bold Heading with styled badge on mobile */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15] flex flex-col items-center"
            >
              <div className="inline-flex items-center justify-center bg-primary text-white px-5 py-3 rounded-2xl shadow-md sm:bg-transparent sm:text-gray-900 sm:p-0 sm:shadow-none sm:rounded-none my-2 sm:my-0">
                <span>Find Your{' '}</span>
                <span className="text-gold sm:text-primary relative inline-block ml-2">
                  Next Home
                  <span className="hidden sm:block absolute bottom-1 left-0 w-full h-[3px] sm:h-[3.5px] bg-gold rounded-full" />
                </span>
              </div>
              <span className="block text-xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mt-2 sm:mt-1.5 px-2">
                Without Broker Exploitation.
              </span>
            </motion.h1>
            
            {/* Simple Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-sm sm:text-base md:text-lg text-gray-600 font-normal max-w-2xl mx-auto leading-relaxed"
            >
              Discover verified student hostels, PG stays, shared rooms, and flats. Connect directly on WhatsApp with zero brokerage fees.
            </motion.p>

            {/* Clean 3 Trust Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="pt-1 flex items-center justify-center gap-2 sm:gap-3 text-xs text-gray-600 font-medium flex-wrap"
            >
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-gray-200/80 rounded-md shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>15+ Active Hubs</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-gray-200/80 rounded-md shadow-2xs">
                <span className="w-2 h-2 bg-gold rounded-full shrink-0" />
                <span>₹49 Flat Unlock</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 border border-gray-200/80 rounded-md shadow-2xs">
                <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                <span>100% Direct Contact</span>
              </div>
            </motion.div>
          </div>

          {/* Prominent Search Component */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-white p-3 sm:p-4 shadow-elevated border border-gray-200/90 rounded-lg relative"
          >
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Location */}
              <div className="p-2.5 bg-gray-50/70 border border-gray-200 hover:border-primary/40 focus-within:border-primary transition-all rounded-md">
                <label className="block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Location / City
                </label>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-gold shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="e.g. Kozhikode, Kakkanad..."
                    className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Property Category */}
              <div className="p-2.5 bg-gray-50/70 border border-gray-200 hover:border-primary/40 focus-within:border-primary transition-all rounded-md">
                <label className="block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Property Category
                </label>
                <div className="flex items-center gap-2">
                  <Building2 size={15} className="text-gold shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Hostels">Hostels</option>
                    <option value="PG Accommodation">PG Accommodation</option>
                    <option value="Shared Rooms">Shared Rooms</option>
                    <option value="Private Rooms">Private Rooms</option>
                    <option value="Flats">Flats</option>
                    <option value="Apartments">Apartments</option>
                    <option value="Houses">Houses</option>
                  </select>
                </div>
              </div>

              {/* Monthly Budget */}
              <div className="p-2.5 bg-gray-50/70 border border-gray-200 hover:border-primary/40 focus-within:border-primary transition-all rounded-md">
                <label className="block text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Monthly Budget
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gold">₹</span>
                  <select
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="5000">Under ₹5,000</option>
                    <option value="8000">Under ₹8,000</option>
                    <option value="12000">Under ₹12,000</option>
                    <option value="20000">Under ₹20,000</option>
                    <option value="35000">Under ₹35,000</option>
                    <option value="100000">Any Budget</option>
                  </select>
                </div>
              </div>

              {/* Search CTA */}
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  className="w-full h-full min-h-[46px] sm:min-h-[50px] bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:shadow-lg rounded-md"
                >
                  <Search size={16} className="text-gold" />
                  <span>Explore Properties</span>
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Popular Searches */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs text-gray-500"
          >
            <span className="font-semibold text-gray-700">Popular Searches:</span>
            {['NIT Calicut Hostels', 'Girls PG Ramanattukara', 'Kochi Infopark Shared Room', 'Calicut Beach Flats'].map((term) => (
              <motion.button
                key={term}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSearchLocation(term.split(' ')[0]);
                  navigate(`/explore?search=${encodeURIComponent(term)}`);
                }}
                className="px-2.5 py-1 bg-white border border-gray-200 hover:border-primary/40 hover:bg-gray-50/80 text-gray-700 hover:text-primary transition-all rounded-md shadow-2xs"
              >
                {term}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. ACCOMMODATION CATEGORIES (REDESIGNED: VISUAL CARDS + BALANCED 4x2 GRID) */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold/15 border border-gold/30 text-gold-dark text-[11px] font-bold uppercase tracking-wider rounded-md mb-2">
              <Sparkles size={12} className="text-gold" />
              <span>Explore by Stay Type</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Accommodation Categories</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1 max-w-xl">
              Curated living spaces for college students, IT professionals, and families with verified direct broker contact.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs sm:text-sm font-semibold text-primary hover:text-gold-dark rounded-md shadow-2xs transition-all self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* 8-Card Balanced Grid (4 cols on desktop, 2 cols on mobile/tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const targetUrl = cat.label === 'All Stays' ? '/explore' : `/explore?category=${encodeURIComponent(cat.label)}`;
            return (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.08, ease: "easeOut" }}
              >
                <Link
                  to={targetUrl}
                  className="group relative bg-white border border-gray-200/90 rounded-lg overflow-hidden shadow-subtle hover:shadow-elevated hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between h-full"
                >
                  {/* Photo Header */}
                  <div className="relative h-36 sm:h-40 overflow-hidden bg-gray-100">
                    <img 
                      src={cat.image} 
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                    
                    {/* Category icon pill */}
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1.5 rounded-md shadow-xs text-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <Icon size={16} className="text-primary" />
                    </div>

                    {/* Price Starting Tag */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-sm shadow-xs transition-transform duration-300 group-hover:scale-105">
                      {cat.price}
                    </div>

                    {/* Stays Count Badge */}
                    <div className="absolute bottom-2.5 left-2.5 text-white/95 text-[11px] font-medium drop-shadow-sm flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{cat.count}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base flex items-center justify-between">
                        <span>{cat.label}</span>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-gold-dark transition-colors">
                      <span>Browse stays</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* 3. FEATURED PROPERTIES (AUTO-SLIDING CAROUSEL ROW) */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-sm bg-gold" />
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Handpicked Stays
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-sm border border-emerald-200/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Auto-Slide
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Featured Properties</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">
              Top-rated verified stays with direct WhatsApp broker contacts for just ₹49.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-play pause / resume toggle button */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              title={isAutoPlay ? "Pause auto-slide" : "Resume auto-slide"}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:text-primary rounded-md shadow-2xs hover:bg-gray-50 transition-colors"
            >
              {isAutoPlay ? (
                <>
                  <Pause size={13} className="text-primary" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-gold-dark" />
                  <span>Slide</span>
                </>
              )}
            </button>

            {/* Manual Slide Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-9 h-9 bg-white border border-gray-200 hover:border-primary/40 text-gray-700 hover:text-primary rounded-md shadow-2xs flex items-center justify-center transition-all hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="w-9 h-9 bg-white border border-gray-200 hover:border-primary/40 text-gray-700 hover:text-primary rounded-md shadow-2xs flex items-center justify-center transition-all hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <Link
              to="/explore"
              className="text-xs md:text-sm font-semibold text-primary hover:text-gold-dark flex items-center gap-1 transition-colors ml-2"
            >
              <span>Explore All {properties.length}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Auto-sliding Carousel Row Container */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-5 pt-1 px-1 -mx-1"
          >
            {featuredProperties.map((prop) => (
              <div 
                key={prop.id} 
                className="w-[300px] sm:w-[350px] lg:w-[380px] shrink-0 snap-start transition-transform duration-300"
              >
                <PropertyCard property={prop} />
              </div>
            ))}
          </div>

          {/* Indicator Dots Bar */}
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {featuredProperties.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to property slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-6 bg-primary' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. THE ₹49 VERIFIED CONTACT UNLOCK MODEL */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-primary text-white rounded-md p-8 md:p-12 shadow-premium relative overflow-hidden border border-gold/20">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-md bg-gold/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gold/20 text-gold text-xs font-semibold">
                <ShieldCheck size={14} />
                <span>Zero Brokerage Exploitation</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Direct Broker Access for Just <span className="text-gold underline decoration-white/30">₹49</span>.
              </h2>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                Traditional platforms hide broker details behind massive subscription walls or heavy commission fees. Haven connects you directly to the verified listing broker for a simple one-time ₹49 unlock fee.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  'Instant phone number & direct WhatsApp connection',
                  'Permanent access saved in your account dashboard',
                  'Direct communication with verified local property managers',
                  'Simulated demo checkout supporting UPI & Cards',
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5 text-xs md:text-sm text-gray-200">
                    <Check size={16} className="text-gold shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-primary font-bold px-6 py-3.5 rounded-md text-sm transition-all shadow-md"
                >
                  <span>Explore & Unlock Contact</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-md p-6 border border-white/15 space-y-4">
              <h4 className="text-sm font-bold text-gold uppercase tracking-wider">How Haven Works</h4>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-md bg-gold text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm">Discover</h5>
                    <p className="text-xs text-gray-300">Browse verified hostels, PG rooms, flats, or villas with high-res photos and transparent rent.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-md bg-gold text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm">Unlock for ₹49</h5>
                    <p className="text-xs text-gray-300">Click unlock contact to access verified phone numbers and direct WhatsApp action.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-md bg-gold text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-white text-sm">Connect & Move In</h5>
                    <p className="text-xs text-gray-300">Call the broker directly, schedule a physical visit, and finalize your stay with zero middlemen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. POPULAR LOCATIONS */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-1">
              Top Rental Hubs
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explore by Location</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularLocations.map((loc, idx) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            >
              <Link
                to={`/explore?city=${encodeURIComponent(loc.name)}`}
                className="group relative h-48 rounded-md overflow-hidden shadow-subtle hover:shadow-elevated hover:-translate-y-1.5 transition-all duration-300 ease-out border border-gray-100 block"
              >
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold group-hover:text-gold transition-colors flex items-center gap-1.5">
                      <span>{loc.name}</span>
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold" />
                    </h3>
                    <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-md font-medium border border-white/20 group-hover:bg-gold group-hover:text-primary transition-all duration-300">
                      {loc.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 mt-0.5 truncate">{loc.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 6. CTA FOR BROKERS */}
      <motion.section 
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-white rounded-md p-8 md:p-12 border border-gray-200 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              For Property Owners & Brokers
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Have a Hostel, PG, or Flat to List?
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Join Haven’s verified broker network. Upload multiple images, manage student room capacities, track contact unlocks, and get connected to verified tenants today.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/broker/listings/new"
              className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3.5 rounded-md text-sm transition-all shadow-sm text-center flex items-center justify-center gap-2"
            >
              <Building2 size={16} className="text-gold" />
              <span>List Property Now</span>
            </Link>
            <Link
              to="/login"
              className="border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-5 py-3.5 rounded-md text-sm transition-colors text-center"
            >
              Broker Sign In
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
