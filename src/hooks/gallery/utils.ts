
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
    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, 2000);
  };
};
