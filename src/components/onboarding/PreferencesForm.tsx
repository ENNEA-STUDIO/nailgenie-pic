
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Preference {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
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
      icon: <span className="text-2xl">💅</span>,
      color: 'from-amber-100 to-amber-200'
    },
    { 
      id: 'glamour', 
      label: 'Glamour', 
      icon: <span className="text-2xl">✨</span>,
      color: 'from-purple-100 to-purple-200'
    },
    { 
      id: 'bold', 
      label: 'Audacieux', 
      icon: <span className="text-2xl">🔥</span>,
      color: 'from-red-100 to-red-200'
    },
    { 
      id: 'minimalist', 
      label: 'Minimaliste', 
      icon: <span className="text-2xl">🤍</span>,
      color: 'from-slate-100 to-slate-200'
    },
    { 
      id: 'artistic', 
      label: 'Artistique', 
      icon: <span className="text-2xl">🎨</span>,
      color: 'from-blue-100 to-blue-200'
    },
    { 
      id: 'trendy', 
      label: 'Tendance', 
      icon: <span className="text-2xl">⚡</span>,
      color: 'from-yellow-100 to-yellow-200'
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {preferences.map((preference) => {
          const isSelected = selectedPreferences.includes(preference.id);
          
          return (
            <motion.div
              key={preference.id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePreference(preference.id)}
              className={`
                relative rounded-xl p-4 cursor-pointer transition-all duration-300
                flex flex-col items-center justify-center gap-2
                border-2 h-28
                bg-gradient-to-br ${preference.color}
                ${isSelected 
                  ? 'border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/20' 
                  : 'border-border/50 hover:border-primary/30'}
              `}
            >
              <motion.div 
                className="text-3xl"
                animate={isSelected ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0, -10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {preference.icon}
              </motion.div>
              <span className="text-sm font-medium">{preference.label}</span>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-center mt-6 bg-secondary/50 p-3 rounded-lg border border-border/50"
      >
        Sélectionnez les styles qui vous intéressent pour personnaliser votre expérience
      </motion.p>
    </div>
  );
};

export default PreferencesForm;
