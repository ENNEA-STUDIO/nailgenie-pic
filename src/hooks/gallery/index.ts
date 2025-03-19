
import { useState, useEffect } from 'react';
import { SavedDesign, ActionFeedback } from '@/types/gallery';
import { fetchSavedDesigns, deleteDesignById, shareDesignToFeed } from './api';
import { downloadDesignImage, createFeedbackHandler } from './utils';
import { useLanguage } from '@/context/LanguageContext';

export const useGallery = () => {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { t } = useLanguage();

  // Initialize feedback handler
  const showFeedback = createFeedbackHandler(setFeedback);

  // Fetch saved designs on component mount
  useEffect(() => {
    const loadDesigns = async () => {
      try {
        const designs = await fetchSavedDesigns();
        setDesigns(designs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching designs:', error);
        showFeedback('error', 'Impossible de charger vos designs');
        setLoading(false);
      }
    };
    
    loadDesigns();
  }, []);
  
  // Download design image
  const downloadDesign = async (imageUrl: string, index: number) => {
    try {
      setActionInProgress('download');
      await downloadDesignImage(imageUrl, index);
      showFeedback('success', t.result.imageOpened || 'Image ouverte dans un nouvel onglet');
    } catch (error) {
      console.error('Error downloading image:', error);
      showFeedback('error', t.result.downloadError || 'Impossible d\'ouvrir l\'image');
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Delete design
  const deleteDesign = async (id: string) => {
    try {
      setActionInProgress('delete-' + id);
      await deleteDesignById(id);
      
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
      
      const { alreadyShared } = await shareDesignToFeed(design);
      
      // Update local state to mark as shared
      setDesigns(designs.map(d => 
        d.id === design.id ? { ...d, is_shared: true } : d
      ));
      
      if (selectedDesign?.id === design.id) {
        setSelectedDesign({ ...selectedDesign, is_shared: true });
      }
      
      showFeedback('success', alreadyShared ? 'Design déjà partagé' : 'Design partagé');
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
