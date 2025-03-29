
import { ActionFeedback } from '@/types/gallery';

// Download a design image
export const downloadDesignImage = async (imageUrl: string, index: number) => {
  try {
    // Log the image URL for debugging
    console.log("Downloading image from URL:", imageUrl);
    
    // For Hugging Face and other CORS-restricted services, we'll use a different approach
    // Instead of fetching the image directly, we'll open it in a new tab
    // and let the user save it manually
    
    // Create a new anchor element
    const link = document.createElement('a');
    
    // Set the href to the image URL
    link.href = imageUrl;
    
    // Set target to _blank to open in a new tab
    link.target = '_blank';
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Image opened in a new tab for download");
    return true;
  } catch (error) {
    console.error("Error opening image:", error);
    throw error;
  }
};

// Share image using Web Share API
export const shareImageExternally = async (imageUrl: string, prompt?: string) => {
  try {
    // Check if the Web Share API is supported by the browser
    if (!navigator.share) {
      throw new Error("Web Share API not supported in this browser");
    }

    console.log("Sharing image:", imageUrl);

    // Create share data with the direct image URL
    // This allows the image to be visible directly in the share
    const shareData = {
      title: 'My Nail Design',
      text: prompt 
        ? `Check out my nail design: "${prompt}"\n\nCreated with NailGenie!` 
        : 'Check out my nail design created with NailGenie!',
      // Pass the image URL directly to make it appear in the share preview
      url: imageUrl
    };

    // Trigger the native share dialog
    await navigator.share(shareData);

    console.log("Image shared successfully");
    return true;
  } catch (error) {
    console.error("Error sharing image:", error);
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
