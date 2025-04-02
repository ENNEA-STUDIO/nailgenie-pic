
import { useEffect } from 'react';
import { SharedDesign } from '@/types/shared-design';

interface MetaTagsManagerProps {
  design: SharedDesign | null;
  language: string;
}

const MetaTagsManager: React.FC<MetaTagsManagerProps> = ({ design, language }) => {
  // Update meta tags for better sharing
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

  useEffect(() => {
    if (design) {
      updateMetaTags(design);
    }
    
    // Clean up meta tags when component unmounts
    return () => {
      resetMetaTags();
    };
  }, [design, language]);

  // This component doesn't render anything
  return null;
};

export default MetaTagsManager;
