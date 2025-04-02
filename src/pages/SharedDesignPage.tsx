
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
          // Fetch the user's display name if user_id is available
          let sharerName = language === 'fr' ? 'Quelqu\'un' : 'Someone';
          
          if (data.user_id) {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', data.user_id)
              .single();
              
            if (!userError && userData && userData.full_name) {
              sharerName = userData.full_name;
            } else {
              // If profile not found, try to get name from auth.users metadata
              const { data: authData, error: authError } = await supabase.auth.admin.getUserById(data.user_id);
              
              if (!authError && authData?.user?.user_metadata?.full_name) {
                sharerName = authData.user.user_metadata.full_name;
              }
            }
          }
          
          // Add the sharer name to the design data
          const designWithSharerName = {
            ...data as SharedDesign,
            sharer_name: data.sharer_name || sharerName
          };
          setDesign(designWithSharerName);
          
          // Update meta tags for this specific shared design
          updateMetaTags(designWithSharerName);
        }
      } catch (err) {
        console.error('Error fetching shared design:', err);
        setError('Failed to load the shared design');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDesign();
    
    // Clean up meta tags when component unmounts
    return () => {
      resetMetaTags();
    };
  }, [id, language]);
  
  // Function to update meta tags for better sharing
  const updateMetaTags = (design: SharedDesign) => {
    // Create title based on prompt and language
    const title = language === 'fr'
      ? `Design d'ongles "${design.prompt}" - GeNails`
      : `Nail design "${design.prompt}" - GeNails`;
      
    // Create description based on language
    const description = language === 'fr'
      ? `${design.sharer_name} a créé ce design d'ongles avec GeNails. Découvrez comment vos ongles peuvent se transformer avec l'IA.`
      : `${design.sharer_name} created this nail design with GeNails. See how your nails can be transformed with AI.`;
    
    // Update document title
    document.title = title;
    
    // Update Open Graph meta tags
    const metaTags = {
      'og:title': title,
      'og:description': description,
      'og:image': design.image_url,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': design.image_url
    };
    
    // Apply all meta tag updates
    Object.entries(metaTags).forEach(([property, content]) => {
      // Try to find existing meta tag
      let meta = document.querySelector(`meta[property="${property}"]`);
      
      // If it doesn't exist, create it
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      // Set the content
      meta.setAttribute('content', content);
    });
  };
  
  // Function to reset meta tags to default
  const resetMetaTags = () => {
    // Reset document title
    document.title = language === 'fr' 
      ? "GeNails - Visualisez votre manucure parfaite avec l'IA"
      : "GeNails - Visualize your perfect manicure with AI";
      
    // Default image URL
    const defaultImage = 'https://genails.app/og-image.png';
    
    // Reset Open Graph meta tags to default
    const metaTagsToReset = {
      'og:title': language === 'fr' ? "GeNails - Visualisez votre manucure parfaite avec l'IA" : "GeNails - Visualize your perfect manicure with AI",
      'og:description': language === 'fr' ? "GeNails utilise l'IA pour vous montrer à quoi ressembleraient différents designs sur vos propres ongles." : "GeNails uses AI to show you what different designs would look like on your own nails.",
      'og:image': defaultImage,
      'twitter:title': language === 'fr' ? "GeNails - Visualisez votre manucure parfaite avec l'IA" : "GeNails - Visualize your perfect manicure with AI",
      'twitter:description': language === 'fr' ? "GeNails utilise l'IA pour vous montrer à quoi ressembleraient différents designs sur vos propres ongles." : "GeNails uses AI to show you what different designs would look like on your own nails.",
      'twitter:image': defaultImage
    };
    
    // Apply all meta tag resets
    Object.entries(metaTagsToReset).forEach(([property, content]) => {
      const meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      }
    });
  };

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
