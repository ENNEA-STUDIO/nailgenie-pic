
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
      color: 'from-amber-50 to-amber-100'
    },
    { 
      id: 'glamour', 
      label: 'Glamour', 
      icon: <span className="text-2xl">✨</span>,
      color: 'from-purple-50 to-purple-100'
    },
    { 
      id: 'bold', 
      label: 'Audacieux', 
      icon: <span className="text-2xl">🔥</span>,
      color: 'from-pink-50 to-pink-100'
    },
    { 
      id: 'minimalist', 
      label: 'Minimaliste', 
      icon: <span className="text-2xl">🤍</span>,
      color: 'from-slate-50 to-slate-100'
    },
    { 
      id: 'artistic', 
      label: 'Artistique', 
      icon: <span className="text-2xl">🎨</span>,
      color: 'from-blue-50 to-blue-100'
    },
    { 
      id: 'trendy', 
      label: 'Tendance', 
      icon: <span className="text-2xl">⚡</span>,
      color: 'from-yellow-50 to-yellow-100'
    },
  ];

  const togglePreference = (preferenceId: string) => {
    setSelectedPreferences(prev => {
      const isSelected = prev.includes(preferenceId);
      return isSelected
        ? prev.filter(id => id !== preferenceId)
        : [...prev, preferenceId];
    });
  };

  const handleSubmit = () => {
    onSubmitValues(selectedPreferences);
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
                border-2 h-28 backdrop-blur-sm
                bg-gradient-to-br ${preference.color}
                ${isSelected 
                  ? 'border-pink-300 shadow-lg shadow-pink-200/30 ring-2 ring-pink-200/20' 
                  : 'border-white/50 hover:border-pink-200/50'}
              `}
              style={{
                boxShadow: isSelected 
                  ? '0 10px 15px -3px rgba(219, 39, 119, 0.1), 0 4px 6px -2px rgba(219, 39, 119, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
                  : 'inset 0 1px 1px rgba(255, 255, 255, 0.5)'
              }}
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
                  className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center"
                  style={{
                    boxShadow: '0 2px 4px rgba(219, 39, 119, 0.2)'
                  }}
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
        className="text-sm text-center mt-6 p-3 rounded-lg border backdrop-blur-sm"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(249,240,255,0.7) 100%)',
          borderColor: 'rgba(219, 39, 119, 0.1)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)'
        }}
      >
        Sélectionnez les styles qui vous intéressent pour personnaliser votre expérience
      </motion.p>

      <motion.div
        whileHover={{ scale: 1.03 }} 
        whileTap={{ scale: 0.97 }}
        className="mx-auto w-full"
      >
        <button 
          onClick={handleSubmit}
          className="w-full rounded-full px-8 py-3 gap-2 h-12 text-white"
          style={{
            background: 'linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)',
            boxShadow: '0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          <span className="font-medium">Continuer</span>
        </button>
      </motion.div>
    </div>
  );
};

export default PreferencesForm;
