
import React from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/navigation/BottomNav';
import { useLanguage } from '@/context/LanguageContext';
import { useGallery } from '@/hooks/gallery'; 
import FeedbackMessage from '@/components/gallery/FeedbackMessage';
import DesignGrid from '@/components/gallery/DesignGrid';
import SelectedDesignDetail from '@/components/gallery/SelectedDesignDetail';
import EmptyGalleryState from '@/components/gallery/EmptyGalleryState';

const GalleryPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    designs,
    loading,
    selectedDesign,
    setSelectedDesign,
    feedback,
    actionInProgress,
    downloadDesign,
    deleteDesign,
    shareDesign,
    shareExternally
  } = useGallery();

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
        <EmptyGalleryState />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Selected design view */}
          {selectedDesign && (
            <SelectedDesignDetail
              design={selectedDesign}
              onClose={() => setSelectedDesign(null)}
              onDelete={deleteDesign}
              onDownload={downloadDesign}
              onShare={shareDesign}
              onShareExternally={shareExternally}
              designIndex={designs.indexOf(selectedDesign)}
              actionInProgress={actionInProgress}
            />
          )}
          
          {/* Grid gallery */}
          <DesignGrid
            designs={designs}
            selectedDesign={selectedDesign}
            onSelectDesign={setSelectedDesign}
            gridCols={selectedDesign ? "grid-cols-3" : "grid-cols-2"}
          />
        </div>
      )}
      
      {/* Visual feedback */}
      <FeedbackMessage feedback={feedback} />
      
      <BottomNav />
    </motion.div>
  );
};

export default GalleryPage;
