
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ActionButtonsProps {
  inviteCode: string;
  onShare: () => Promise<void>;
}

// Component is now empty as we're removing the buttons
const ActionButtons: React.FC<ActionButtonsProps> = () => {
  return null;
};

export default ActionButtons;
