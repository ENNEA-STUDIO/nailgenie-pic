
import React from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import PhoneDemo from '@/components/landing/PhoneDemo';
import Features from '@/components/landing/Features';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Background gradient blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <Header />
      <Hero />
      <PhoneDemo />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
