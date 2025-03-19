
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SavedDesign, ActionFeedback } from '@/types/gallery';

export const useGallery = () => {
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

  return {
    designs,
    loading,
    selectedDesign,
    setSelectedDesign,
    feedback,
    actionInProgress,
    downloadDesign,
    deleteDesign,
    shareDesign
  };
};
