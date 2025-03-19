
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/navigation/BottomNav';
import { Download, Trash2, Image, CheckCircle, XCircle, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SavedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string;
  user_id: string;
  is_shared?: boolean;
}

interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

const GalleryPage: React.FC = () => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Show feedback and automatically hide it after a delay
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message, visible: true });
    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, 2000);
  };

  // Fetch saved designs on component mount
  useEffect(() => {
    const fetchSavedDesigns = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setLoading(false);
          return;
        }
        
        const userId = session.session.user.id;
        
        // Fetch saved designs
        const { data: savedDesigns, error } = await supabase
          .from('saved_designs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Fetch shared designs from the same user to mark them
        const { data: sharedDesigns, error: sharedError } = await supabase
          .from('shared_designs')
          .select('image_url')
          .eq('user_id', userId);
          
        if (sharedError) throw sharedError;
        
        // Create a set of shared image URLs for faster lookup
        const sharedImageUrls = new Set(sharedDesigns?.map(design => design.image_url) || []);
        
        // Mark designs that have been shared
        const designsWithSharedStatus = savedDesigns?.map(design => ({
          ...design,
          is_shared: sharedImageUrls.has(design.image_url)
        })) || [];
        
        setDesigns(designsWithSharedStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        showFeedback('error', 'Impossible de charger vos designs');
        setLoading(false);
      }
    };
    
    fetchSavedDesigns();
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
      
      showFeedback('success', 'Image téléchargée');
    } catch (error) {
      console.error('Error downloading image:', error);
      showFeedback('error', 'Impossible de télécharger l\'image');
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Delete design
  const deleteDesign = async (id: string) => {
    try {
      setActionInProgress('delete-' + id);
      const { error } = await supabase
        .from('saved_designs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDesigns(designs.filter(design => design.id !== id));
      if (selectedDesign?.id === id) {
        setSelectedDesign(null);
      }
      showFeedback('success', 'Design supprimé');
    } catch (error) {
      console.error('Error deleting design:', error);
      showFeedback('error', 'Impossible de supprimer le design');
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Share design to feed
  const shareDesign = async (design: SavedDesign) => {
    try {
      setActionInProgress('share-' + design.id);
      
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        showFeedback('error', 'Veuillez vous connecter pour partager');
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if design is already shared
      const { data: existingShares, error: checkError } = await supabase
        .from('shared_designs')
        .select('*')
        .eq('image_url', design.image_url)
        .eq('user_id', userId);
        
      if (checkError) throw checkError;
      
      // If already shared, show message and return
      if (existingShares && existingShares.length > 0) {
        showFeedback('success', 'Design déjà partagé');
        
        // Update local state to mark as shared
        setDesigns(designs.map(d => 
          d.id === design.id ? { ...d, is_shared: true } : d
        ));
        
        if (selectedDesign?.id === design.id) {
          setSelectedDesign({ ...selectedDesign, is_shared: true });
        }
        
        return;
      }
      
      // Insert into shared_designs table
      const { error: insertError } = await supabase
        .from('shared_designs')
        .insert([
          {
            user_id: userId,
            image_url: design.image_url,
            prompt: design.prompt
          }
        ]);
        
      if (insertError) throw insertError;
      
      // Update local state to mark as shared
      setDesigns(designs.map(d => 
        d.id === design.id ? { ...d, is_shared: true } : d
      ));
      
      if (selectedDesign?.id === design.id) {
        setSelectedDesign({ ...selectedDesign, is_shared: true });
      }
      
      showFeedback('success', 'Design partagé');
    } catch (error) {
      console.error('Error sharing design:', error);
      showFeedback('error', 'Impossible de partager le design');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24 relative"
    >
      <div className="flex-none text-2xl font-semibold text-center py-4">
        Mes designs
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="mb-6 p-6 rounded-full bg-muted/50">
            <Image size={48} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-3">Aucun design sauvegardé</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Commencez par créer un design de nails et sauvegardez-le pour le retrouver ici
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => shareDesign(selectedDesign)}
                            className={cn(
                              "p-3 rounded-full transition-colors",
                              selectedDesign.is_shared 
                                ? "bg-green-500/70 hover:bg-green-500/90 text-white" 
                                : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                            disabled={actionInProgress === `share-${selectedDesign.id}`}
                          >
                            {actionInProgress === `share-${selectedDesign.id}` ? (
                              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                            ) : (
                              <Rss size={20} />
                            )}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{selectedDesign.is_shared ? 'Déjà partagé' : 'Partager au feed'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteDesign(selectedDesign.id)}
                            className="p-3 bg-white/10 hover:bg-destructive/80 text-white rounded-full transition-colors"
                            disabled={actionInProgress === `delete-${selectedDesign.id}`}
                          >
                            {actionInProgress === `delete-${selectedDesign.id}` ? (
                              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                            ) : (
                              <Trash2 size={20} />
                            )}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
            </motion.div>
          )}
          
          {/* Grid gallery */}
          <div className={cn(
            "grid gap-3 auto-rows-max", 
            selectedDesign ? "grid-cols-3" : "grid-cols-2"
          )}>
            {designs.map((design, index) => (
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
                
                {/* Shared indicator */}
                {design.is_shared && (
                  <div className="absolute top-2 right-2 p-1 bg-green-500/70 rounded-full">
                    <Rss size={14} className="text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Visual feedback instead of toast */}
      <AnimatePresence>
        {feedback && feedback.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2",
              feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav />
    </motion.div>
  );
};

export default GalleryPage;
