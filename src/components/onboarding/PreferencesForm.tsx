
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Preference {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PreferencesFormProps {
  onSubmitValues: (selectedPreferences: string[]) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onSubmitValues }) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  // Exemple de préférences pour le style d'ongles
  const preferences: Preference[] = [
    { 
      id: 'natural', 
      label: 'Naturel', 
      icon: <span className="text-2xl">💅</span>
    },
    { 
      id: 'glamour', 
      label: 'Glamour', 
      icon: <span className="text-2xl">✨</span>
    },
    { 
      id: 'bold', 
      label: 'Audacieux', 
      icon: <span className="text-2xl">🔥</span>
    },
    { 
      id: 'minimalist', 
      label: 'Minimaliste', 
      icon: <span className="text-2xl">🤍</span>
    },
    { 
      id: 'artistic', 
      label: 'Artistique', 
      icon: <span className="text-2xl">🎨</span>
    },
    { 
      id: 'trendy', 
      label: 'Tendance', 
      icon: <span className="text-2xl">⚡</span>
    },
  ];

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      const isSelected = prev.includes(preferenceId);
      const newSelection = isSelected
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId];
      
      // Mettre à jour le parent chaque fois que la sélection change
      onSubmitValues(newSelection);
      
      return newSelection;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {preferences.map((preference) => {
          const isSelected = selectedPreferences.includes(preference.id);
          
          return (
            <motion.div
              key={preference.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePreference(preference.id)}
              className={`
                relative rounded-xl p-4 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-2
                border-2 h-24
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background'}
              `}
            >
              <div className="text-2xl">{preference.icon}</div>
              <span className="text-sm font-medium">{preference.label}</span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Sélectionnez les styles qui vous intéressent pour personnaliser votre expérience
      </p>
    </div>
  );
};

export default PreferencesForm;
