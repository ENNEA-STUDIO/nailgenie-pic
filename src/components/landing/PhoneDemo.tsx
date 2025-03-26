
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MessageSquare, Sparkles, Wand2 } from 'lucide-react';
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const PhoneDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  
  const steps = [
    { name: "camera", icon: <Camera className="h-10 w-10 text-fuchsia-500" />, title: "Prenez une photo" },
    { name: "customize", icon: <Sparkles className="h-10 w-10 text-fuchsia-500" />, title: "Personnalisez" },
    { name: "prompt", icon: <MessageSquare className="h-10 w-10 text-fuchsia-500" />, title: "Décrivez" },
    { name: "generate", icon: <Wand2 className="h-10 w-10 text-fuchsia-500" />, title: "Visualisez" }
  ];

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2000);

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(loaderTimer);
    };
  }, []);

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <section className="relative z-10 container mx-auto px-4 py-16">
      <motion.div 
        className="glass-card rounded-3xl overflow-hidden p-6 md:p-10 mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.div 
              className="relative"
              variants={floatingVariants}
              animate="float"
            >
              <div className="relative mx-auto max-w-xs">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-pink-200 to-purple-200 blur-lg opacity-70 transform scale-105"></div>
                <div className="relative h-[500px] w-[240px] mx-auto rounded-3xl overflow-hidden border-8 border-white shadow-xl bg-gray-100">
                  <div className="absolute top-0 w-full h-10 bg-white flex justify-center items-end pb-1 z-20">
                    <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                  
                  <div className="pt-10 px-2 h-full relative">
                    <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-full rounded-2xl overflow-hidden flex items-center justify-center relative">
                      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 z-10">
                        {steps.map((_, index) => (
                          <div 
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              index === currentStep ? "w-6 bg-fuchsia-500" : "w-2 bg-fuchsia-300/50"
                            }`}
                          />
                        ))}
                      </div>
                      
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStep}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4 }}
                          className="absolute inset-0 flex flex-col items-center justify-center p-3"
                        >
                          {currentStep === 0 && (
                            <div className="text-center flex flex-col items-center">
                              <div className="w-28 h-28 rounded-lg bg-fuchsia-200/50 flex items-center justify-center mb-4">
                                <Camera className="h-14 w-14 text-fuchsia-500" />
                              </div>
                              <span className="text-xs font-medium text-fuchsia-700 py-1 px-3 bg-white/80 rounded-full mb-2">
                                Étape 1
                              </span>
                              <p className="text-sm text-fuchsia-800 font-medium">
                                Prenez une photo de vos mains
                              </p>
                              
                              <div className="mt-6 flex justify-center">
                                <motion.div 
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ 
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                  }}
                                  className="w-14 h-14 rounded-full bg-fuchsia-400 flex items-center justify-center"
                                >
                                  <div className="w-10 h-10 rounded-full bg-white"></div>
                                </motion.div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 1 && (
                            <div className="text-center flex flex-col items-center">
                              <div className="w-28 h-28 rounded-lg bg-indigo-200/50 flex items-center justify-center mb-4">
                                <Sparkles className="h-14 w-14 text-indigo-500" />
                              </div>
                              <span className="text-xs font-medium text-indigo-700 py-1 px-3 bg-white/80 rounded-full mb-2">
                                Étape 2
                              </span>
                              <p className="text-sm text-indigo-800 font-medium">
                                Personnalisez la forme et la longueur
                              </p>
                              
                              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                                {["oval", "round", "square", "almond"].map((shape, i) => (
                                  <motion.div
                                    key={shape}
                                    animate={{ 
                                      y: i === 1 ? [0, -3, 0] : 0,
                                      scale: i === 1 ? [1, 1.1, 1] : 1,
                                      opacity: i === 1 ? 1 : 0.6
                                    }}
                                    transition={{ 
                                      repeat: Infinity, 
                                      duration: 2,
                                      delay: i * 0.2
                                    }}
                                    className={`w-10 h-10 ${i === 1 ? "bg-purple-400" : "bg-purple-200"} rounded-md flex items-center justify-center`}
                                  >
                                    <div className={`w-6 h-6 ${
                                      shape === "oval" ? "rounded-full scale-x-75" :
                                      shape === "round" ? "rounded-full" :
                                      shape === "square" ? "rounded-sm" :
                                      "rounded-full scale-y-110"
                                    } bg-white`}></div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {currentStep === 2 && (
                            <div className="text-center flex flex-col items-center">
                              <div className="w-28 h-28 rounded-lg bg-pink-200/50 flex items-center justify-center mb-4">
                                <MessageSquare className="h-14 w-14 text-pink-500" />
                              </div>
                              <span className="text-xs font-medium text-pink-700 py-1 px-3 bg-white/80 rounded-full mb-2">
                                Étape 3
                              </span>
                              <p className="text-sm text-pink-800 font-medium">
                                Décrivez votre manucure idéale
                              </p>
                              
                              <motion.div 
                                animate={{ 
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 2 
                                }}
                                className="mt-4 w-full bg-white/80 rounded-lg p-2 text-left relative"
                              >
                                <span className="text-xs text-pink-800">
                                  "Ongles roses avec paillettes argentées..."
                                </span>
                                <motion.div
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 1.5 
                                  }}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-0.5 bg-pink-500"
                                ></motion.div>
                              </motion.div>
                            </div>
                          )}
                          
                          {currentStep === 3 && (
                            <div className="text-center flex flex-col items-center">
                              <div className="w-28 h-28 rounded-lg bg-fuchsia-200/50 flex items-center justify-center mb-4 relative overflow-hidden">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    duration: 3,
                                    ease: "linear"
                                  }}
                                  className="absolute inset-0 opacity-30"
                                >
                                  <div className="absolute top-0 right-0 w-10 h-10 bg-pink-300 rounded-full filter blur-md"></div>
                                  <div className="absolute bottom-0 left-0 w-10 h-10 bg-purple-300 rounded-full filter blur-md"></div>
                                  <div className="absolute top-1/2 left-1/2 w-10 h-10 bg-indigo-300 rounded-full filter blur-md"></div>
                                </motion.div>
                                
                                <Wand2 className="h-14 w-14 text-fuchsia-500 relative z-10" />
                              </div>
                              <span className="text-xs font-medium text-fuchsia-700 py-1 px-3 bg-white/80 rounded-full mb-2">
                                Étape 4
                              </span>
                              <p className="text-sm text-fuchsia-800 font-medium">
                                Votre design est généré par IA
                              </p>
                              
                              <div className="mt-4 w-full bg-gradient-to-r from-pink-300 to-purple-300 h-24 rounded-lg flex items-center justify-center relative overflow-hidden">
                                <motion.div
                                  animate={{ 
                                    opacity: [0, 1],
                                    scale: [0.8, 1]
                                  }}
                                  transition={{ 
                                    duration: 1.5,
                                    ease: "easeOut"
                                  }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <NailPolishIcon className="w-12 h-12" />
                                </motion.div>
                                
                                <motion.div
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 2 }}
                                  className="absolute bottom-0 left-0 h-1 bg-white/70"
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                      
                      <AnimatePresence>
                        {showInitialLoader && (
                          <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                          >
                            <NailPolishIcon className="w-16 h-16 text-fuchsia-500" animate={true} />
                            
                            <div className="mt-4 text-center">
                              <p className="text-xs font-medium text-fuchsia-700">Bienvenue sur</p>
                              <p className="text-sm font-bold text-fuchsia-800">NailGenie</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-fuchsia-800">Comment fonctionne NailGenie ?</h3>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-300 ${
                    currentStep === index ? "scale-105 -translate-x-2" : ""
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className={`flex-shrink-0 p-3 rounded-2xl ${
                    currentStep === index 
                      ? "bg-gradient-to-br from-fuchsia-100 to-fuchsia-200 shadow-md" 
                      : "bg-white/80 backdrop-blur-sm shadow-sm"
                  } transition-all duration-300`}>
                    {step.icon}
                  </div>
                  <div>
                    <h4 className={`text-lg font-medium ${
                      currentStep === index ? "text-fuchsia-600" : "text-fuchsia-700"
                    } mb-1 transition-all duration-300`}>{step.title}</h4>
                    <p className="text-gray-600">
                      {index === 0 && "Capturez une photo de vos mains pour une expérience personnalisée"}
                      {index === 1 && "Choisissez votre forme d'ongles, longueur et couleur préférées"}
                      {index === 2 && "Décrivez le style que vous imaginez avec vos propres mots"}
                      {index === 3 && "Notre IA crée instantanément votre design sur mesure"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PhoneDemo;
