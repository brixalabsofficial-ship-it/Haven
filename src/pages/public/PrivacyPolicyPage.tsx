import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-4 hover:underline">
          <ArrowLeft size={14} />
          <span>Back to Haven Home</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Last updated: November 2026</p>
      </div>

      <div className="bg-white rounded-md p-8 border border-gray-100 shadow-subtle space-y-6 text-sm text-gray-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">1. Information We Collect</h2>
          <p>
            Haven collects information to enable seamless rental discovery between prospective tenants and verified local brokers. This includes account profile information (name, email, phone number) and property listing details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">2. Broker Contact Protection & ₹49 Unlock</h2>
          <p>
            To prevent spam, unsolicited communication, and scrapers, broker contact information (direct phone number and WhatsApp handles) remains protected until an unlock request is confirmed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">3. Demonstration MVP Sandbox</h2>
          <p>
            This application is currently functioning in an interactive frontend demo mode. User uploads, session state, and simulated payment transactions are stored in client-side storage (IndexedDB and LocalStorage) and are not processed by a production financial processor.
          </p>
        </section>
      </div>
    </div>
  );
};
