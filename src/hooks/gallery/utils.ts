
import { ActionFeedback } from '@/types/gallery';

// Download a design image
export const downloadDesignImage = async (imageUrl: string, index: number) => {
  try {
    // Log the image URL for debugging
    console.log("Downloading image from URL:", imageUrl);
    
    // Create a temporary invisible image to verify the image loads
    const img = new Image();
    img.crossOrigin = "anonymous"; // Try to avoid CORS issues
    
    // Return a promise that resolves when the image is loaded
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
    
    // Now fetch the image with proper headers
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    // Convert to blob
    const blob = await response.blob();
    
    if (blob.size === 0) {
      throw new Error("Downloaded image is empty");
    }
    
    // Create object URL from blob
    const url = URL.createObjectURL(blob);
    
    // Create a new anchor element
    const link = document.createElement('a');
    
    // Set the href to the blob URL
    link.href = url;
    
    // Set download attribute with filename
    link.download = `design-${index + 1}.jpg`;
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL to avoid memory leaks
    URL.revokeObjectURL(url);
    
    console.log("Download completed successfully");
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
};

// Create a feedback message handler
export const createFeedbackHandler = (
  setFeedback: (feedback: ActionFeedback | null) => void
) => {
  return (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message, visible: true });
    
    // Use setTimeout to hide the feedback after a delay
    setTimeout(() => {
      // Create a new feedback object with visible set to false
      // instead of using a function that updates the previous state
      setFeedback({ type, message, visible: false });
      
      // After another delay, set feedback to null completely
      setTimeout(() => {
        setFeedback(null);
      }, 300); // small delay for exit animation
    }, 2000);
  };
};
