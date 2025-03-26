
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Image, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NailPolishIcon from '@/components/credits/NailPolishIcon';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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
        repeatType: "reverse",
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
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-8 pb-16 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500">
              Visualisez votre manucure parfaite
            </h2>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            NailGenie utilise l'IA pour vous montrer à quoi ressembleraient différents designs sur vos propres ongles, avant même de vous rendre en salon.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => navigate('/onboarding')}
              className="rounded-full px-8 py-6 text-lg font-medium"
              style={{
                background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
                boxShadow: "0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)"
              }}
            >
              Commencer l'expérience <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* App Preview Section */}
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
                    <div className="absolute top-0 w-full h-10 bg-white flex justify-center items-end pb-1">
                      <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="pt-10 px-2 h-full">
                      <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-full rounded-2xl overflow-hidden flex items-center justify-center">
                        <div className="text-center p-4">
                          <NailPolishIcon className="w-16 h-16 mx-auto mb-4 text-fuchsia-500" animate={true} />
                          <p className="text-pink-800 font-medium">Visualisez vos ongles de rêve</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-fuchsia-800">Comment fonctionne NailGenie ?</h3>
              <div className="space-y-6">
                {featuresData.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-fuchsia-700 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
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

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden p-8 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(250,240,255,0.8) 100%)",
            boxShadow: "0 25px 50px -12px rgba(219, 39, 119, 0.2), 0 0 1px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)"
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Prête à découvrir votre prochaine manucure ?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Rejoignez NailGenie aujourd'hui et transformez votre expérience de manucure avec la puissance de l'IA.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="rounded-full px-8 py-6 text-lg font-medium"
            style={{
              background: "linear-gradient(90deg, #D946EF 0%, #9b87f5 100%)",
              boxShadow: "0 10px 15px -3px rgba(214, 31, 255, 0.2), 0 4px 6px -2px rgba(215, 115, 247, 0.1)"
            }}
          >
            Commencer gratuitement <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
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
