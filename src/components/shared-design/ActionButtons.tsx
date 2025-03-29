
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ActionButtonsProps {
  inviteCode: string;
  onShare: () => Promise<void>;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ inviteCode, onShare }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="flex justify-center gap-4 mb-10">
      <Button
        onClick={onShare}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
      >
        <Share2 size={16} />
        {language === 'fr' ? 'Partager' : 'Share'}
      </Button>
      
      <Link to={`/onboarding?invite=${inviteCode}`}>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          {t.result.tryItFree}
          <ChevronRight size={16} />
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
