import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Image, Sparkles, Star, MessageSquare, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

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

  const featuresData = [
    {
      icon: <Camera className="h-8 w-8 text-pink-400" />,
      title: "Prenez une photo",
      description: "Capturez votre main pour voir vos designs de manucure"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-purple-400" />,
      title: "Personnalisez",
      description: "Choisissez votre style, forme et longueur de vos ongles"
    },
    {
      icon: <Image className="h-8 w-8 text-fuchsia-400" />,
      title: "Visualisez",
      description: "Voyez instantanément le résultat sur vos propres mains"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-pink-50 to-purple-50">
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <header className="relative z-10 w-full py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <NailPolishIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              NailGenie
            </h1>
          </div>
          <Button 
            className="bg-white/70 backdrop-blur-sm border border-pink-100 text-pink-500 hover:bg-pink-50 hover:text-pink-600 font-medium"
            onClick={() => navigate('/onboarding')}
          >
            Se connecter
          </Button>
        </div>
      </header>

      <section className="relative z-10 container mx-auto px-4 pt-8 pb-16 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="absolute -z-10 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute top-0 left-1/4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 drop-shadow-sm">
              Visualisez votre manucure parfaite
            </h2>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-10">
            <p className="text-lg md:text-xl text-gray-700 mb-4 max-w-2xl mx-auto">
              NailGenie utilise l'IA pour vous montrer à quoi ressembleraient différents designs sur vos propres ongles, avant même de vous rendre en salon.
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-1.5 mb-6"
            >
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-1 text-sm text-gray-600">Plus de 10 000 designs générés</span>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative mb-4 group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-70 blur-lg group-hover:opacity-80 transition-opacity"></div>
              <Button 
                onClick={() => navigate('/onboarding')}
                className="relative rounded-full px-10 py-7 text-lg font-semibold"
                style={{
                  background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
                  boxShadow: "0 10px 25px -3px rgba(214, 31, 255, 0.25), 0 4px 6px -2px rgba(215, 115, 247, 0.15)"
                }}
              >
                <motion.span
                  animate={{ 
                    x: [0, 3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="flex items-center justify-center gap-2"
                >
                  Commencer l'expérience
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </motion.span>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 max-w-lg"
            >
              {[
                { icon: "✨", text: "Gratuit pour commencer" },
                { icon: "🔒", text: "Sans carte bancaire" },
                { icon: "⚡", text: "Résultats instantanés" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-fuchsia-700 border border-fuchsia-100">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

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

      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Pourquoi choisir NailGenie ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les avantages qui font de NailGenie l'application préférée des passionnés de manucure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Star className="h-10 w-10 text-yellow-400" />,
              title: "Designs uniques",
              description: "Des designs personnalisés et uniques générés spécifiquement pour vous"
            },
            {
              icon: <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <NailPolishIcon className="h-10 w-10 text-pink-500" />
              </motion.div>,
              title: "Économisez du temps",
              description: "Plus besoin d'essayer différentes manucures, visualisez-les d'abord"
            },
            {
              icon: <Sparkles className="h-10 w-10 text-purple-400" />,
              title: "Inspirez-vous",
              description: "Explorez notre galerie pour découvrir de nouvelles tendances"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="glass-card p-6 rounded-2xl text-center"
            >
              <div className="bg-white/40 backdrop-blur-sm w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-fuchsia-700">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden p-8 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,232,255,0.9) 100%)",
            boxShadow: "0 25px 50px -12px rgba(219, 39, 119, 0.25), 0 0 1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)"
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Prête à découvrir votre prochaine manucure ?
            </h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Rejoignez NailGenie aujourd'hui et transformez votre expérience de manucure avec la puissance de l'IA.
            </p>
            
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-70 blur-lg"></div>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="relative rounded-full px-10 py-6 text-lg font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
                    boxShadow: "0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)"
                  }}
                >
                  <span className="mr-2">Commencer l'aventure</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-pink-500 mt-6 font-medium"
            >
              ��� Gratuit pour commencer - Aucune carte de crédit requise
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      <footer className="relative z-10 container mx-auto px-4 py-8 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-pink-100 pt-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <NailPolishIcon className="h-6 w-6" />
            <span className="text-lg font-medium text-fuchsia-800">NailGenie</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} NailGenie. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

