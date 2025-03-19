
import { ActionFeedback } from '@/types/gallery';

// Download a design image
export const downloadDesignImage = async (imageUrl: string, index: number) => {
  try {
    // Create a new anchor element
    const link = document.createElement('a');
    
    // Set the href to the image URL directly (no need to fetch and create blob)
    link.href = imageUrl;
    
    // Add download attribute with filename
    link.download = `design-${index + 1}.jpg`;
    
    // Required for Firefox
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Append to document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
