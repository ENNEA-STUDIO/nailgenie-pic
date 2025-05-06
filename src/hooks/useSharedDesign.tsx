
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { MetaData, SharedDesignData } from '@/types/shared-design';

export const useSharedDesign = () => {
  const { designId } = useParams<{ designId: string }>();
  
  const [design, setDesign] = useState<SharedDesignData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData>({
    title: 'GeNails - Nail Design',
    description: 'Découvrez ce design d\'ongles créé avec GeNails',
    imageUrl: '',
    creator: '',
    url: window.location.href,
  });

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        setLoading(true);
        
        if (!designId) {
          throw new Error('Design ID is required');
        }
        
        // Try to find the design first in shared_views
        const { data: sharedView, error: sharedViewError } = await supabase
          .from('shared_views')
          .select('*')
          .eq('id', designId)
          .maybeSingle();
        
        if (sharedViewError) {
          console.error('Error fetching shared view:', sharedViewError);
          throw sharedViewError;
        }
        
        if (sharedView) {
          setDesign({
            id: sharedView.id,
            invite_code: sharedView.invite_code,
            nail_color: sharedView.nail_color || '',
            nail_shape: sharedView.nail_shape || '',
            nail_length: sharedView.nail_length || '',
            prompt: sharedView.prompt || '',
            image_url: sharedView.image_url,
            created_at: sharedView.created_at,
          });
          
          setMetaData({
            title: 'GeNails - Beautiful Nail Design',
            description: sharedView.prompt 
              ? `Nail design: ${sharedView.prompt}` 
              : 'Découvrez ce design d\'ongles créé avec GeNails',
            imageUrl: sharedView.image_url,
            creator: '',
            url: window.location.href,
          });
          
          setLoading(false);
          return;
        }
        
        // If not found in shared_views, look in shared_designs
        const { data: sharedDesign, error: sharedDesignError } = await supabase
          .from('shared_designs')
          .select('*')
          .eq('id', designId)
          .maybeSingle();
          
        if (sharedDesignError) {
          console.error('Error fetching shared design:', sharedDesignError);
          throw sharedDesignError;
        }
        
        if (!sharedDesign) {
          throw new Error('Design not found');
        }
        
        setDesign({
          id: sharedDesign.id,
          invite_code: '', // Shared designs don't have invite codes
          nail_color: sharedDesign.nail_color || '',
          nail_shape: sharedDesign.nail_shape || '',
          nail_length: sharedDesign.nail_length || '',
          prompt: sharedDesign.prompt || '',
          image_url: sharedDesign.image_url,
          created_at: sharedDesign.created_at,
        });
        
        setMetaData({
          title: 'GeNails - Beautiful Nail Design',
          description: sharedDesign.prompt 
            ? `Nail design: ${sharedDesign.prompt}` 
            : 'Découvrez ce design d\'ongles créé avec GeNails',
          imageUrl: sharedDesign.image_url,
          creator: '',
          url: window.location.href,
        });
        
      } catch (err: any) {
        console.error('Error in useSharedDesign:', err);
        setError(err.message || 'Failed to load design');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDesign();
  }, [designId]);
  
  return { design, loading, error, metaData };
};
