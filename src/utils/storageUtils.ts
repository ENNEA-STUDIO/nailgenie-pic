
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload an image to Supabase storage from either a URL or base64 string
 * @param imageSource URL or base64 encoded image string
 * @param userId User ID to use in the path
 * @returns Public URL of the uploaded image
 */
export const uploadImageToStorage = async (imageSource: string, userId: string): Promise<string> => {
  try {
    console.log("Starting image upload to Supabase Storage...");
    
    // Create a unique filename with timestamp
    const filename = `${userId}_${Date.now()}.jpg`;
    const filePath = `${userId}/${filename}`;
    
    // For base64 data
    if (imageSource.startsWith('data:')) {
      console.log("Processing base64 image data");
      
      // Extract the base64 data (remove the data:image/jpeg;base64, prefix)
      const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
      
      try {
        // Upload base64 data directly to Supabase
        console.log("Uploading base64 data to Supabase Storage:", filePath);
        const { data, error } = await supabase.storage
          .from('nail_designs')
          .upload(filePath, decode(base64Data), {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error("Supabase upload error:", error);
          throw error;
        }
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('nail_designs')
          .getPublicUrl(data.path);
        
        console.log("Upload successful, public URL:", publicUrl);
        return publicUrl;
      } catch (error) {
        console.error("Error uploading base64 data:", error);
        throw new Error("Failed to upload image data");
      }
    } else {
      // For URLs, we'll convert to base64 first using fetch
      // This is more reliable for cross-origin URLs
      try {
        console.log("URL provided, will fetch and convert to binary data");
        
        // Fetch the image as blob
        const response = await fetch(imageSource, {
          mode: 'cors',  // Try with CORS
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        // Get image as blob
        const blob = await response.blob();
        console.log("Image fetched successfully as blob:", blob.size, "bytes");
        
        // Upload blob to Supabase Storage
        const { data, error } = await supabase.storage
          .from('nail_designs')
          .upload(filePath, blob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error("Supabase upload error:", error);
          throw error;
        }
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('nail_designs')
          .getPublicUrl(data.path);
        
        console.log("Upload successful, public URL:", publicUrl);
        return publicUrl;
      } catch (error) {
        console.error("Error fetching or uploading the image:", error);
        throw new Error("Failed to process URL image");
      }
    }
  } catch (error) {
    console.error('Error uploading image to Supabase Storage:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to decode base64 to binary data
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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
