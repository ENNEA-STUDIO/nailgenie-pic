
import { supabase } from '@/integrations/supabase/client';
import { SavedDesign } from '@/types/gallery';

// Fetch saved designs and mark shared ones
export const fetchSavedDesigns = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return [];
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
  
  return designsWithSharedStatus;
};

// Delete a design by ID
export const deleteDesignById = async (id: string) => {
  const { error } = await supabase
    .from('saved_designs')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Share a design to the feed
export const shareDesignToFeed = async (design: SavedDesign) => {
  // Get current user
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('User not authenticated');
  }
  
  const userId = sessionData.session.user.id;
  
  // Check if design is already shared
  const { data: existingShares, error: checkError } = await supabase
    .from('shared_designs')
    .select('*')
    .eq('image_url', design.image_url)
    .eq('user_id', userId);
    
  if (checkError) throw checkError;
  
  // If already shared, return early
  if (existingShares && existingShares.length > 0) {
    return { alreadyShared: true };
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
  
  return { alreadyShared: false };
};
