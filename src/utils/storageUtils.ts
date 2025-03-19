
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
    
    // Determine if the source is a URL or base64 data
    const isUrl = imageSource.startsWith('http');
    let blob: Blob;
    
    if (isUrl) {
      try {
        // For Hugging Face temporary URLs, we'll use a direct canvas approach
        // since CORS issues and temporary URLs can cause problems
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        console.log("Fetching image from URL using canvas approach:", imageSource);
        
        // Create a promise that resolves when the image is loaded or fails
        const imageLoaded = new Promise<Blob>((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
              }
              
              // Draw the image on the canvas
              ctx.drawImage(img, 0, 0);
              
              // Convert the canvas to a blob
              canvas.toBlob((canvasBlob) => {
                if (!canvasBlob) {
                  reject(new Error("Could not convert canvas to blob"));
                  return;
                }
                resolve(canvasBlob);
              }, 'image/jpeg', 0.95);
            } catch (err) {
              console.error("Canvas processing error:", err);
              reject(err);
            }
          };
          
          img.onerror = (e) => {
            console.error("Image load error:", e);
            reject(new Error("Failed to load image from URL"));
          };
        });
        
        // Set the image source to trigger loading
        img.src = imageSource;
        
        // Wait for the image to load and be processed
        blob = await imageLoaded;
        console.log("Successfully created blob from image:", blob.size, "bytes");
      } catch (fetchError) {
        console.error("Error processing image from URL:", fetchError);
        throw new Error("Could not process image from URL");
      }
    } else {
      console.log("Processing base64 image data");
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
      console.log("Successfully created blob from base64:", blob.size, "bytes");
    }
    
    // Create a unique filename with timestamp
    const filename = `${userId}_${Date.now()}.jpg`;
    const filePath = `${userId}/${filename}`;
    
    // Upload file to Supabase Storage
    console.log("Uploading blob to Supabase Storage:", filePath, "Size:", blob.size, "bytes");
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
