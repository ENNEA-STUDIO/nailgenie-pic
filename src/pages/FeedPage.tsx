
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/navigation/BottomNav';
import { Download, Image } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { 
  RoundNailIcon, 
  SquareNailIcon, 
  OvalNailIcon, 
  AlmondNailIcon, 
  StilettoNailIcon, 
  CoffinNailIcon 
} from '@/components/NailShapeIcons';

interface SharedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string | null;
  user_id: string;
  nail_shape?: string;
  nail_color?: string;
  nail_length?: string;
}

const FeedPage: React.FC = () => {
  const [designs, setDesigns] = useState<SharedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SharedDesign | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { t } = useLanguage();

  // Map shapes to their respective icon components
  const shapeIconMap: Record<string, React.FC<{ className?: string }>> = {
    round: RoundNailIcon,
    square: SquareNailIcon,
    oval: OvalNailIcon,
    almond: AlmondNailIcon,
    stiletto: StilettoNailIcon,
    coffin: CoffinNailIcon,
  };

  // Length indicators
  const lengthSizeMap: Record<string, string> = {
    short: 'w-3',
    medium: 'w-5',
    long: 'w-7',
  };

  // Fetch shared designs on component mount
  useEffect(() => {
    const fetchSharedDesigns = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_designs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDesigns(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shared designs:', error);
        setLoading(false);
      }
    };
    
    fetchSharedDesigns();
  }, []);
  
  // Download design image
  const downloadDesign = async (imageUrl: string, index: number) => {
    try {
      setActionInProgress('download');
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  // Get formatted design details
  const getDesignDetails = (design: SharedDesign) => {
    let details = design.prompt || "Sans description";
    
    // Add nail details if available
    if (design.nail_shape || design.nail_color || design.nail_length) {
      details += " • ";
      
      const detailParts = [];
      if (design.nail_shape) detailParts.push(`Forme: ${design.nail_shape}`);
      if (design.nail_length) detailParts.push(`Longueur: ${design.nail_length}`);
      if (design.nail_color) detailParts.push(`Couleur: ${design.nail_color}`);
      
      details += detailParts.join(' • ');
    }
    
    return details;
  };

  // Display nail details more prominently
  const renderDetailBadges = (design: SharedDesign) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-3">
        {design.nail_shape && (
          <span className="px-2 py-1 text-xs bg-primary/10 rounded-full text-primary">
            {design.nail_shape}
          </span>
        )}
        {design.nail_length && (
          <span className="px-2 py-1 text-xs bg-secondary/20 rounded-full text-secondary-foreground">
            {design.nail_length}
          </span>
        )}
        {design.nail_color && (
          <span className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
            {design.nail_color}
          </span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24 relative"
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="mb-6 p-6 rounded-full bg-muted/50">
            <Image size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-3">Aucun design partagé</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Vous verrez ici les designs partagés par la communauté
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Selected design view */}
          {selectedDesign && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <div className="relative glass-card rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={selectedDesign.image_url} 
                  alt="Design sélectionné"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md flex justify-between">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadDesign(selectedDesign.image_url, designs.indexOf(selectedDesign))}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    disabled={actionInProgress === 'download'}
                  >
                    {actionInProgress === 'download' ? (
                      <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    ) : (
                      <Download size={20} />
                    )}
                  </motion.button>
                </div>
                <button 
                  onClick={() => setSelectedDesign(null)}
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full"
                >
                  &times;
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {selectedDesign.prompt || "Sans description"}
              </p>
              {renderDetailBadges(selectedDesign)}
            </motion.div>
          )}
          
          {/* Grid gallery */}
          <div className={cn(
            "grid gap-3 auto-rows-max", 
            selectedDesign ? "grid-cols-3" : "grid-cols-2"
          )}>
            {designs.map((design, index) => {
              // Get the icon component based on nail shape
              const ShapeIcon = design.nail_shape ? shapeIconMap[design.nail_shape] : null;
              // Get length class
              const lengthClass = design.nail_length ? lengthSizeMap[design.nail_length] : '';
              
              return (
                <motion.div
                  key={design.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "glass-card rounded-xl overflow-hidden relative group cursor-pointer",
                    selectedDesign?.id === design.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedDesign(design)}
                >
                  <img 
                    src={design.image_url} 
                    alt={`Design ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  {/* Nail properties indicators */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                    {/* Color indicator */}
                    {design.nail_color && (
                      <div 
                        className="h-4 w-4 rounded-full shadow-md border border-gray-200/30" 
                        style={{ 
                          backgroundColor: design.nail_color,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)'
                        }}
                      />
                    )}
                    
                    {/* Shape indicator */}
                    {ShapeIcon && (
                      <div className="h-5 w-5 flex items-center justify-center filter drop-shadow-md">
                        <ShapeIcon className="h-full w-full text-white" />
                      </div>
                    )}
                    
                    {/* Length indicator */}
                    {design.nail_length && (
                      <div className="flex items-center filter drop-shadow">
                        <div className={cn("h-1 rounded-full bg-white/90 shadow-sm", lengthClass)} style={{
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
      
      <BottomNav />
    </motion.div>
  );
};

export default FeedPage;

