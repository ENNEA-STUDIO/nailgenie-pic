
import React from 'react';
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 container mx-auto px-4 py-8 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-pink-100 pt-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <NailPolishIcon className="h-6 w-6" />
          <span className="text-lg font-medium text-fuchsia-800">NailGenie</span>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} NailGenie. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
