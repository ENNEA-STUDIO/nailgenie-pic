
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { CameraIcon, ChevronRight, Share2 } from 'lucide-react';

interface SharedDesign {
  id: string;
  image_url: string;
  prompt: string;
  nail_shape: string;
  nail_color: string;
  nail_length: string;
  invite_code: string;
}

const SharedDesignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [design, setDesign] = useState<SharedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchSharedDesign = async () => {
      try {
        console.log("Fetching shared design with ID:", id);
        if (!id) {
          setError('Design ID is missing');
          setLoading(false);
          return;
        }

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
          setDesign(data as SharedDesign);
        }
      } catch (err) {
        console.error('Error fetching shared design:', err);
        setError('Failed to load the shared design');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDesign();
  }, [id]);

  const handleShare = async () => {
    if (!design) return;
    
    try {
      const shareUrl = window.location.href;
      const shareText = language === 'fr'
        ? `Regarde ce design d'ongle créé avec NailGenie: "${design.prompt}". Tu peux essayer toi-même: ${shareUrl}`
        : `Check out this nail design created with NailGenie: "${design.prompt}". You can try it yourself: ${shareUrl}`;
      
      if (navigator.share) {
        await navigator.share({
          title: language === 'fr' ? 'Design d\'ongle NailGenie' : 'NailGenie Nail Design',
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !design) {
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <div className="max-w-md mx-auto pt-8 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t.result.sharedDesignTitle}
          </h1>
          <p className="text-gray-600 text-sm">
            {design.prompt}
          </p>
        </div>
        
        {/* Design Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-xl bg-white mb-8"
        >
          <img 
            src={design.image_url} 
            alt={design.prompt} 
            className="w-full h-auto"
          />
        </motion.div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <Share2 size={16} />
            {language === 'fr' ? 'Partager' : 'Share'}
          </Button>
          
          <Link to={`/onboarding?invite=${design.invite_code}`}>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              {t.result.tryItFree}
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        
        {/* App Promotion */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {language === 'fr' ? 'Créez votre propre design d\'ongles' : 'Create Your Own Nail Design'}
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <CameraIcon className="text-purple-500" size={24} />
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'fr' 
                ? 'Prenez une photo de vos ongles et voyez instantanément à quoi ressembleraient différents designs grâce à l\'IA.' 
                : 'Take a photo of your nails and instantly see what different designs would look like using AI.'}
            </p>
          </div>
          
          <Link to={`/onboarding?invite=${design.invite_code}`}>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              {language === 'fr' ? 'Commencer avec 5 crédits gratuits' : 'Get Started with 5 Free Credits'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedDesignPage;
