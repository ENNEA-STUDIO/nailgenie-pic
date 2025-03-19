
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import FeedEmptyState from '@/components/feed/FeedEmptyState';
import FeedDesignGrid from '@/components/feed/FeedDesignGrid';
import SelectedFeedDesign from '@/components/feed/SelectedFeedDesign';
import { SharedDesign } from '@/types/feed';
import { downloadDesignImage } from '@/hooks/gallery/utils';

const FeedPage: React.FC = () => {
  const [designs, setDesigns] = useState<SharedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<SharedDesign | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { t } = useLanguage();

  // Fetch shared designs on component mount
  useEffect(() => {
    const fetchSharedDesigns = async () => {
      try {
        const { data, error } = await supabase
          .from('shared_designs')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setDesigns(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shared designs:', error);
        setLoading(false);
      }
    };
    
    fetchSharedDesigns();
  }, []);
  
  // Download design image
  const downloadDesign = async (imageUrl: string, index: number) => {
    try {
      setActionInProgress('download');
      console.log("FeedPage - Starting download for:", imageUrl);
      await downloadDesignImage(imageUrl, index);
      console.log("FeedPage - Download completed successfully");
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 p-4 pb-24 relative"
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : designs.length === 0 ? (
        <FeedEmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Selected design view */}
          {selectedDesign && (
            <SelectedFeedDesign
              design={selectedDesign}
              onClose={() => setSelectedDesign(null)}
              onDownload={downloadDesign}
              designIndex={designs.indexOf(selectedDesign)}
              actionInProgress={actionInProgress}
            />
          )}
          
          {/* Grid gallery */}
          <FeedDesignGrid
            designs={designs}
            selectedDesign={selectedDesign}
            onSelectDesign={setSelectedDesign}
            gridCols={selectedDesign ? "grid-cols-3" : "grid-cols-2"}
          />
        </div>
      )}
      
      <BottomNav />
    </motion.div>
  );
};

export default FeedPage;
