
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string | null;
  language: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, language }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {language === 'fr' ? 'Design introuvable' : 'Design Not Found'}
        </h1>
        <p className="text-gray-600 mb-6">
          {error || (language === 'fr' ? 'Ce design n\'existe pas ou a expiré.' : 'This design doesn\'t exist or has expired.')}
        </p>
        <Link to="/onboarding">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            {language === 'fr' ? 'Créer mon propre design' : 'Create My Own Design'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorState;
