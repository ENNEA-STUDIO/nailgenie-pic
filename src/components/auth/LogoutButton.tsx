
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

interface ActionFeedback {
  type: 'success' | 'error';
  message: string;
  visible: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loggingOut, setLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  
  // Show feedback and automatically hide it after a delay
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message, visible: true });
    setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
      
      // If logout was successful, navigate after showing feedback
      if (type === 'success') {
        navigate('/');
      }
    }, 1500);
  };
  
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      showFeedback('success', t.common.logoutSuccess);
    } catch (error: any) {
      console.error('Error logging out:', error);
      showFeedback('error', error.message || t.common.errorMessage);
    } finally {
      setLoggingOut(false);
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button 
        variant={variant} 
        size={size} 
        onClick={handleLogout}
        disabled={loggingOut}
        className={`rounded-xl transition-all duration-300 ${className}`}
      >
        {loggingOut ? (
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-current animate-spin mr-2"></div>
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        )}
        <span>{t.common.logout}</span>
      </Button>
      
      {/* Visual feedback instead of toast */}
      <AnimatePresence>
        {feedback && feedback.visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 whitespace-nowrap z-50 ${
              feedback.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LogoutButton;
