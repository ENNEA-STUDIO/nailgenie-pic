
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outline', 
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/');
      toast.success(t.common.logoutSuccess, {
        icon: "👋"
      });
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || t.common.errorMessage);
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant={variant} 
        size={size} 
        onClick={handleLogout}
        className={`rounded-xl transition-all duration-300 ${className}`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t.common.logout}</span>
      </Button>
    </motion.div>
  );
};

export default LogoutButton;
