
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LoadingState from '@/components/shared-design/LoadingState';
import ErrorState from '@/components/shared-design/ErrorState';
import DesignHeader from '@/components/shared-design/DesignHeader';
import DesignImage from '@/components/shared-design/DesignImage';
import ActionButtons from '@/components/shared-design/ActionButtons';
import AppPromotion from '@/components/shared-design/AppPromotion';
import MetaTagsManager from '@/components/shared-design/MetaTagsManager';
import { useSharedDesign } from '@/hooks/useSharedDesign';
import { useDesignSharing } from '@/hooks/useDesignSharing';

const SharedDesignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { design, loading, error, metaData } = useSharedDesign(id, language);
  const { handleShare } = useDesignSharing(design);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !design) {
    return <ErrorState error={error} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <MetaTagsManager design={design} language={language} />
      
      <div className="max-w-md mx-auto pt-8 px-4">
        <DesignHeader 
          sharerName={design.sharer_name || (language === 'fr' ? 'Quelqu\'un' : 'Someone')}
          prompt={design.prompt}
          nailShape={design.nail_shape}
          nailColor={design.nail_color}
          nailLength={design.nail_length}
        />
        
        <DesignImage imageUrl={design.image_url} prompt={design.prompt} />
        
        <ActionButtons inviteCode={design.invite_code} onShare={handleShare} />
        
        <AppPromotion inviteCode={design.invite_code} />
      </div>
    </div>
  );
};

export default SharedDesignPage;
