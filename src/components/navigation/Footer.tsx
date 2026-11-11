import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white border-t border-primary-light/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-primary-light/40">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed">
              Haven is a modern rental property discovery platform connecting tenants directly with verified local brokers across Kerala & Bengaluru.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold bg-primary-light/40 px-3 py-1.5 rounded-md border border-gold/20 w-fit">
              <ShieldCheck size={16} />
              <span>₹49 Direct Broker Contact Guarantee</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4">Properties</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/explore?category=Hostels" className="hover:text-gold transition-colors">
                  Hostels (Boys & Girls)
                </Link>
              </li>
              <li>
                <Link to="/explore?category=PG+Accommodation" className="hover:text-gold transition-colors">
                  PG Accommodations
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Flats" className="hover:text-gold transition-colors">
                  Flats & Studios
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Apartments" className="hover:text-gold transition-colors">
                  Luxury Apartments
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Houses" className="hover:text-gold transition-colors">
                  Independent Houses
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Hubs */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4">Locations</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/explore?city=Kozhikode" className="hover:text-gold transition-colors">
                  Kozhikode (Calicut)
                </Link>
              </li>
              <li>
                <Link to="/explore?locality=Ramanattukara" className="hover:text-gold transition-colors">
                  Ramanattukara & Feroke
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Kochi" className="hover:text-gold transition-colors">
                  Kochi (Kakkanad & Edappally)
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Malappuram" className="hover:text-gold transition-colors">
                  Malappuram & Tirur
                </Link>
              </li>
              <li>
                <Link to="/explore?city=Bengaluru" className="hover:text-gold transition-colors">
                  Bengaluru (HSR & Koramangala)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/broker/listings/new" className="hover:text-gold transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold transition-colors">
                  Demo Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Haven Technologies. All rights reserved. Commercial Frontend MVP.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              Made with <Heart size={13} className="text-gold fill-gold" /> for seamless rental discovery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
