
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { SharedDesign } from '@/types/shared-design';
import LoadingState from '@/components/shared-design/LoadingState';
import ErrorState from '@/components/shared-design/ErrorState';
import DesignHeader from '@/components/shared-design/DesignHeader';
import DesignImage from '@/components/shared-design/DesignImage';
import ActionButtons from '@/components/shared-design/ActionButtons';
import AppPromotion from '@/components/shared-design/AppPromotion';

const SharedDesignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<SharedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchSharedDesign = async () => {
      try {
        console.log("Fetching shared design with ID:", id);
        if (!id) {
          setError('Design ID is missing');
          setLoading(false);
          return;
        }

        // Fetch the shared design
        const { data, error } = await supabase
          .from('shared_views')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        console.log("Fetched design data:", data);
        
        if (!data) {
          setError('Design not found');
        } else {
          // Add a default sharer name if not available
          const designWithSharerName = {
            ...data as SharedDesign,
            sharer_name: data.sharer_name || (language === 'fr' ? 'Quelqu\'un' : 'Someone')
          };
          setDesign(designWithSharerName);
        }
      } catch (err) {
        console.error('Error fetching shared design:', err);
        setError('Failed to load the shared design');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDesign();
  }, [id, language]);

  const handleShare = async () => {
    if (!design) return;
    
    try {
      const shareUrl = window.location.href;
      const shareText = language === 'fr'
        ? `Regarde ce design d'ongle créé avec GeNails: "${design.prompt}". Tu peux essayer toi-même: ${shareUrl}`
        : `Check out this nail design created with GeNails: "${design.prompt}". You can try it yourself: ${shareUrl}`;
      
      if (navigator.share) {
        await navigator.share({
          title: language === 'fr' ? 'Design d\'ongle GeNails' : 'GeNails Nail Design',
          text: shareText,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(language === 'fr' ? 'Lien copié!' : 'Link copied!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !design) {
    return <ErrorState error={error} language={language} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto pt-8 px-4">
        <DesignHeader 
          sharerName={design.sharer_name || (language === 'fr' ? 'Quelqu\'un' : 'Someone')}
          prompt={design.prompt}
        />
        
        <DesignImage imageUrl={design.image_url} prompt={design.prompt} />
        
        <ActionButtons inviteCode={design.invite_code} onShare={handleShare} />
        
        <AppPromotion inviteCode={design.invite_code} />
      </div>
    </div>
  );
};

export default SharedDesignPage;
