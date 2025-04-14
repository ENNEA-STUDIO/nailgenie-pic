
import { useLanguage } from '@/context/LanguageContext';
import { SharedDesign } from '@/types/shared-design';

export const useDesignSharing = (design: SharedDesign | null) => {
  const { language } = useLanguage();

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
          url: undefined // Remove the URL parameter since we already include it in the text
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(language === 'fr' ? 'Lien copié!' : 'Link copied!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return { handleShare };
};
