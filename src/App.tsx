import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { UserLayout } from './components/layout/UserLayout';
import { BrokerLayout } from './components/layout/BrokerLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ExplorePage } from './pages/public/ExplorePage';
import { PropertyDetailsPage } from './pages/public/PropertyDetailsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Tenant Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { UserSavedPage } from './pages/user/UserSavedPage';
import { UserUnlockedPage } from './pages/user/UserUnlockedPage';
import { UserPaymentsPage } from './pages/user/UserPaymentsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { UserSettingsPage } from './pages/user/UserSettingsPage';

// Broker Pages
import { BrokerDashboardPage } from './pages/broker/BrokerDashboardPage';
import { BrokerListingsPage } from './pages/broker/BrokerListingsPage';
import { AddPropertyWizardPage } from './pages/broker/AddPropertyWizardPage';
import { EditListingPage } from './pages/broker/EditListingPage';
import { BrokerUnlocksPage } from './pages/broker/BrokerUnlocksPage';
import { BrokerEarningsPage } from './pages/broker/BrokerEarningsPage';
import { BrokerProfilePage } from './pages/broker/BrokerProfilePage';
import { BrokerSettingsPage } from './pages/broker/BrokerSettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Tenant / User Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <Navigate to="/user/dashboard" replace />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserDashboardPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/saved"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserSavedPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/unlocked"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserUnlockedPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/payments"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserPaymentsPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserProfilePage />
            </UserLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/settings"
        element={
          <ProtectedRoute allowedRole="tenant">
            <UserLayout>
              <UserSettingsPage />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Broker Desk Routes */}
      <Route
        path="/broker"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <Navigate to="/broker/dashboard" replace />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/dashboard"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerDashboardPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/listings"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerListingsPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/listings/new"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <AddPropertyWizardPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/listings/:id/edit"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <EditListingPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/unlocks"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerUnlocksPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/earnings"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerEarningsPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/profile"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerProfilePage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/broker/settings"
        element={
          <ProtectedRoute allowedRole="broker">
            <BrokerLayout>
              <BrokerSettingsPage />
            </BrokerLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
