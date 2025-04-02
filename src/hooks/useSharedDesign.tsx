
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SharedDesign } from '@/types/shared-design';

export const useSharedDesign = (id: string | undefined, language: string) => {
  const [design, setDesign] = useState<SharedDesign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedDesign = async () => {
      try {
        console.log("Fetching shared design with ID:", id);
        if (!id) {
          setError('Design ID is missing');
          setLoading(false);
          return;
        }

        // Fetch the shared design
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
          // Fetch the user's display name if user_id is available
          let sharerName = language === 'fr' ? 'Quelqu\'un' : 'Someone';
          
          if (data.user_id) {
            try {
              console.log("Trying to fetch profile for user_id:", data.user_id);
              // Try to get name from profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', data.user_id)
                .maybeSingle();
              
              console.log("Profile fetch result:", { profileData, profileError });
                
              if (profileData && profileData.full_name) {
                sharerName = profileData.full_name;
                console.log("Using profile name:", sharerName);
              } else {
                console.log("Could not find profile or no full_name, falling back to default name");
              }
            } catch (profileError) {
              console.error("Error fetching profile:", profileError);
            }
          }
          
          // Add the sharer name to the design data
          const designWithSharerName = {
            ...data as SharedDesign,
            sharer_name: data.sharer_name || sharerName
          };
          
          console.log("Final design data with sharer name:", designWithSharerName);
          setDesign(designWithSharerName);
        }
      } catch (err) {
        console.error('Error fetching shared design:', err);
        setError('Failed to load the shared design');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDesign();
  }, [id, language]);

  return { design, loading, error };
};
