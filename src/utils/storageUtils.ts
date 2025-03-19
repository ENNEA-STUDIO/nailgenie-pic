
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload an image to Supabase storage from either a URL or base64 string
 * @param imageSource URL or base64 encoded image string
 * @param userId User ID to use in the path
 * @returns Public URL of the uploaded image
 */
export const uploadImageToStorage = async (imageSource: string, userId: string): Promise<string> => {
  try {
    // Determine if the source is a URL or base64 data
    const isUrl = imageSource.startsWith('http');
    let blob: Blob;
    
    if (isUrl) {
      // If it's a URL, fetch the image data
      console.log("Fetching image from URL:", imageSource);
      const response = await fetch(imageSource);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      blob = await response.blob();
    } else {
      // Extract the base64 data (remove the data:image/jpeg;base64, prefix)
      const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
      
      // Convert base64 to Blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      blob = new Blob(byteArrays, { type: 'image/jpeg' });
    }
    
    // Create a unique filename with timestamp
    const filename = `${userId}_${Date.now()}.jpg`;
    const filePath = `${userId}/${filename}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('nail_designs')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('nail_designs')
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase Storage:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Extract the filename from a Supabase Storage URL
 * @param url Supabase Storage URL
 * @returns Extracted filename
 */
export const getFilenameFromUrl = (url: string): string => {
  try {
    // Extract file name from URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return 'nail-design.jpg';
  }
};

/**
 * Delete an image from Supabase Storage by its URL
 * @param url Supabase Storage URL
 * @param userId User ID for path validation
 * @returns Promise that resolves when deletion is complete
 */
export const deleteImageFromStorage = async (url: string, userId: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    
    // Get the bucket name and the path
    const bucketStorage = pathSegments[2];
    const storagePath = pathSegments.slice(3).join('/');
    
    // Optional: Verify that this file belongs to the user (additional security)
    if (!storagePath.startsWith(userId)) {
      throw new Error('Unauthorized to delete this image');
    }
    
    // Delete the file
    const { error } = await supabase.storage
      .from('nail_designs')
      .remove([storagePath]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image from Supabase Storage:', error);
    throw new Error('Failed to delete image');
  }
};
