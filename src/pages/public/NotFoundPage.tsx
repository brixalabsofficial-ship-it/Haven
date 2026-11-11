import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Logo } from '../../components/common/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <div className="w-20 h-20 rounded-md bg-gold/15 text-gold-dark flex items-center justify-center mx-auto text-2xl font-black">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          The property listing, dashboard link, or page you were looking for doesn't exist or has moved.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-md border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-md bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm flex items-center gap-1.5"
          >
            <Compass size={14} className="text-gold" />
            <span>Explore Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
