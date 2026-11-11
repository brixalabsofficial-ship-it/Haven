import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';
import { MobileBottomBar } from '../navigation/MobileBottomBar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomBar />
    </div>
  );
};
