
import React from 'react';
import { motion } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { NailLength, useApp } from '../context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

const NailLengthSelector: React.FC = () => {
  const { nailLength, setNailLength } = useApp();
  const { t } = useLanguage();
  
  const handleLengthChange = (value: string) => {
    if (value) setNailLength(value as NailLength);
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">{t.prompt.length}</h3>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ToggleGroup 
          type="single" 
          value={nailLength}
          onValueChange={handleLengthChange}
          className="justify-start w-full"
        >
          <ToggleGroupItem value="short" className="flex-1 border">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{t.prompt.short}</span>
              <span className="h-1 w-4 bg-current mt-1 rounded-full" />
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem value="medium" className="flex-1 border">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{t.prompt.medium}</span>
              <span className="h-1 w-8 bg-current mt-1 rounded-full" />
            </div>
          </ToggleGroupItem>
          <ToggleGroupItem value="long" className="flex-1 border">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">{t.prompt.long}</span>
              <span className="h-1 w-12 bg-current mt-1 rounded-full" />
            </div>
          </ToggleGroupItem>
        </ToggleGroup>
      </motion.div>
    </div>
  );
};

export default NailLengthSelector;
