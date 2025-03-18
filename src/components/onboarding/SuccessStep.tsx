
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';

const SuccessStep: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-8 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-primary" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold">Compte créé avec succès!</h2>
        <p className="text-muted-foreground">
          Votre compte a été créé et vous êtes prêt à explorer NailGenie
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-wrap gap-2 justify-center"
      >
        {['Designs personnalisés', 'Inspiration', 'Partage', 'Conseils'].map((tag, i) => (
          <span 
            key={i}
            className="px-3 py-1 bg-muted rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs mt-4"
      >
        <Button 
          onClick={() => navigate('/camera')}
          className="w-full"
          size="lg"
        >
          <Camera className="mr-2 h-4 w-4" />
          Prendre une photo
        </Button>
        
        <div className="flex justify-center mt-2">
          <LogoutButton variant="ghost" />
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessStep;
