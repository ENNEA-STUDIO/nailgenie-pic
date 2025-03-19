
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Download, Save, ArrowLeft, Share } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

interface ResultPreviewProps {
  onTryAgain: () => void;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ onTryAgain }) => {
  const { generatedDesign, prompt } = useApp();
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();
  
  if (!generatedDesign) return null;
  
  const handleDownload = () => {
    // Create an anchor element and set properties
    const link = document.createElement("a");
    link.href = generatedDesign;
    link.download = "nail-design.png";
    
    // Append to the document body
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Remove from the document
    document.body.removeChild(link);
    
    toast.success(t.result.downloadSuccess);
  };
  
  const handleSaveToGallery = async () => {
    try {
      setSaving(true);
      
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error(t.common.connectionRequired);
        setSaving(false);
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Insert into saved_designs table
      const { data, error } = await supabase
        .from('saved_designs')
        .insert([
          {
            user_id: userId,
            image_url: generatedDesign,
            prompt: prompt || 'Design personnalisé'
          }
        ]);
        
      if (error) throw error;
      
      toast.success(t.result.savedSuccess);
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error(t.result.savedError);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md flex flex-col items-center p-4"
    >
      <h2 className="text-xl font-medium mb-6 text-center">{t.result.yourDesign}</h2>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass-card rounded-3xl overflow-hidden shadow-lg mb-6 w-full"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
      >
        <img 
          src={generatedDesign} 
          alt="Generated nail design" 
          className="w-full object-cover"
        />
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-3 w-full">
        <Button 
          onClick={onTryAgain}
          variant="outline" 
          className="flex items-center gap-2 flex-1"
        >
          <ArrowLeft size={18} />
          {t.common.tryAgain}
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className="flex items-center gap-2 flex-1"
        >
          <Download size={18} />
          {t.common.download}
        </Button>
        
        <Button
          onClick={handleSaveToGallery}
          disabled={saving}
          className="w-full mt-2 bg-primary"
          style={{
            background: saving ? undefined : "linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%)",
          }}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
              {t.result.saving}
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {t.result.saveToGallery}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultPreview;
