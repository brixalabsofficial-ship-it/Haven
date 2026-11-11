import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-4 hover:underline">
          <ArrowLeft size={14} />
          <span>Back to Haven Home</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
      </div>

      <div className="bg-white rounded-md p-8 border border-gray-100 shadow-subtle space-y-6 text-sm text-gray-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Marketplace Platform Overview</h2>
          <p>
            Haven operates as a neutral discovery platform connecting accommodation seekers (tenants) with independent property brokers and hostel administrators. Haven is not a party to any rental agreements executed between tenants and brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. Contact Unlock Fee (₹49)</h2>
          <p>
            The ₹49 fee enables access to a broker's verified contact details for a specific listing. This connection fee grants direct communication rights but does not constitute a booking advance, deposit, or tenancy guarantee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. Verification & Safety Guidelines</h2>
          <p>
            While Haven displays verified broker labels based on onboarding documentation, tenants are strongly advised to inspect properties in person prior to transferring any rental deposits.
          </p>
        </section>
      </div>
    </div>
  );
};
