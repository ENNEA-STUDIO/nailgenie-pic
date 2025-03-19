
import { ActionFeedback } from '@/types/gallery';

// Download a design image
export const downloadDesignImage = async (imageUrl: string, index: number) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `design-${index + 1}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
