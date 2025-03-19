
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/navigation/BottomNav';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
        
        // This is a placeholder query - you'll need to create this table in Supabase
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
      <div className="flex-none text-xl font-medium text-center py-4">
        Mes designs
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : designs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="mb-4 text-4xl">✨</div>
          <h3 className="text-lg font-medium mb-2">Aucun design sauvegardé</h3>
          <p className="text-muted-foreground">
            Commencez par créer un design de nails et sauvegardez-le pour le retrouver ici
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4">
          {designs.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card rounded-xl overflow-hidden relative group"
            >
              <img 
                src={design.image_url} 
                alt={`Design ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
                <button 
                  onClick={() => downloadDesign(design.image_url, index)}
                  className="p-2 text-white hover:text-primary rounded-full"
                >
                  <Download size={18} />
                </button>
                
                <button 
                  onClick={() => deleteDesign(design.id)}
                  className="p-2 text-white hover:text-destructive rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <BottomNav />
    </motion.div>
  );
};

export default GalleryPage;
