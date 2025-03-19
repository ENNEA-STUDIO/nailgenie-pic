
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionFeedback } from '@/types/gallery';

interface FeedbackMessageProps {
  feedback: ActionFeedback | null;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ feedback }) => {
  if (!feedback || !feedback.visible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "fixed bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2",
          feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}
      >
        {feedback.type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{feedback.message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackMessage;
