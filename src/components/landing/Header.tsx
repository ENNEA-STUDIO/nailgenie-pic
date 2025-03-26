
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="relative z-10 w-full py-6 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <NailPolishIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            NailGenie
          </h1>
        </div>
        <Button 
          className="bg-white/70 backdrop-blur-sm border border-pink-100 text-pink-500 hover:bg-pink-50 hover:text-pink-600 font-medium"
          onClick={() => navigate('/onboarding')}
        >
          Se connecter
        </Button>
      </div>
    </header>
  );
};

export default Header;
