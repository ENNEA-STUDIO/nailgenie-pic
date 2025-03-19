
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/navigation/BottomNav';
import { Download, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SavedDesign {
  id: string;
  created_at: string;
  image_url: string;
  prompt: string;
  user_id: string;
}

const GalleryPage: React.FC = () => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);

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
        
        const { data, error } = await supabase
          .from('saved_designs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDesigns(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        toast.error('Impossible de charger vos designs');
        setLoading(false);
      }
    };
    
    fetchSavedDesigns();
  }, []);
  
  // Download design image
  const downloadDesign = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image téléchargée');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Impossible de télécharger l\'image');
    }
  };
  
  // Delete design
  const deleteDesign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_designs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setDesigns(designs.filter(design => design.id !== id));
      if (selectedDesign?.id === id) {
        setSelectedDesign(null);
      }
      toast.success('Design supprimé');
    } catch (error) {
      console.error('Error deleting design:', error);
      toast.error('Impossible de supprimer le design');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24"
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
                  <button 
                    onClick={() => downloadDesign(selectedDesign.image_url, designs.indexOf(selectedDesign))}
                    className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                  >
                    <Download size={20} />
                  </button>
                  
                  <button 
                    onClick={() => deleteDesign(selectedDesign.id)}
                    className="p-3 bg-white/10 hover:bg-destructive/80 text-white rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
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
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <BottomNav />
    </motion.div>
  );
};

export default GalleryPage;
