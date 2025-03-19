
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import ProfileForm from '@/components/onboarding/ProfileForm';
import PasswordForm from '@/components/onboarding/PasswordForm';
import PreferencesForm from '@/components/onboarding/PreferencesForm';
import SuccessStep from '@/components/onboarding/SuccessStep';
import { useLanguage } from '@/context/LanguageContext';
import LoginStep from '@/components/onboarding/LoginStep';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    preferences: [] as string[]
  });
  
  const handleProfileSubmit = (values: { fullName: string; email: string }) => {
    setUserData(prev => ({ ...prev, ...values }));
    handleNext();
  };
  
  const handlePasswordSubmit = (values: { password: string; confirmPassword: string }) => {
    setUserData(prev => ({ ...prev, password: values.password }));
    handleNext();
  };
  
  const handlePreferencesSubmit = (preferences: string[]) => {
    setUserData(prev => ({ ...prev, preferences }));
    handleNext();
  };
  
  const toggleLoginMode = () => {
    setIsLogin(!isLogin);
    // Reset to first form step when switching modes
    setCurrentStepIndex(1);
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) throw error;
      
      toast.success(language === 'fr' ? "Connexion réussie !" : "Successfully logged in!");
      
      // Redirect to camera page and prevent going back to onboarding
      navigate('/camera', { replace: true });
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      toast.error(error.message || (language === 'fr' ? "Échec de la connexion" : "Login failed"));
    }
  };
  
  const handleComplete = async () => {
    try {
      console.log("Creating account with data:", { email: userData.email, fullName: userData.fullName });
      
      // Create a user account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            preferences: userData.preferences
          }
        }
      });
      
      if (error) throw error;
      
      toast.success(language === 'fr' ? "Votre compte a été créé avec succès!" : "Your account was created successfully!");
      
      // Force navigation to camera page immediately and prevent going back to onboarding
      console.log("Account created successfully, redirecting to camera page");
      navigate('/camera', { replace: true });
      
    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error(error.message || (language === 'fr' ? "Une erreur s'est produite lors de la création de votre compte" : "An error occurred while creating your account"));
    }
  };

  const handleNext = () => {
    setCurrentStepIndex(prev => prev + 1);
  };

  // Generate steps based on login mode
  const getSteps = () => {
    if (isLogin) {
      // Login flow
      return [
        {
          id: 'welcome',
          title: language === 'fr' ? 'Bienvenue' : 'Welcome',
          description: language === 'fr' ? 'Découvrez NailGenie' : 'Discover NailGenie',
          component: <WelcomeStep onNext={handleNext} showLoginOption toggleLoginMode={toggleLoginMode} isLogin={isLogin} />
        },
        {
          id: 'login',
          title: language === 'fr' ? 'Connexion' : 'Login',
          description: language === 'fr' ? 'Connectez-vous à votre compte' : 'Sign in to your account',
          component: <LoginStep onSubmitValues={handleLogin} toggleLoginMode={toggleLoginMode} />
        }
      ];
    } else {
      // Signup flow
      return [
        {
          id: 'welcome',
          title: language === 'fr' ? 'Bienvenue' : 'Welcome',
          description: language === 'fr' ? 'Découvrez NailGenie' : 'Discover NailGenie',
          component: <WelcomeStep onNext={handleNext} showLoginOption toggleLoginMode={toggleLoginMode} isLogin={isLogin} />
        },
        {
          id: 'profile',
          title: language === 'fr' ? 'Profil' : 'Profile',
          description: language === 'fr' ? 'Informations de base' : 'Basic information',
          component: <ProfileForm onSubmitValues={handleProfileSubmit} />
        },
        {
          id: 'password',
          title: language === 'fr' ? 'Sécurité' : 'Security',
          description: language === 'fr' ? 'Créez un mot de passe' : 'Create a password',
          component: <PasswordForm onSubmitValues={handlePasswordSubmit} />
        },
        {
          id: 'preferences',
          title: language === 'fr' ? 'Préférences' : 'Preferences',
          description: language === 'fr' ? 'Personnalisez votre expérience' : 'Customize your experience',
          component: <PreferencesForm onSubmitValues={handlePreferencesSubmit} />
        },
        {
          id: 'success',
          title: language === 'fr' ? 'Terminé' : 'Done',
          description: language === 'fr' ? 'Votre compte est prêt' : 'Your account is ready',
          component: <SuccessStep />
        }
      ];
    }
  };
  
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #f8e9ff 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      }}
    >
      <div className="w-full py-6">
        <OnboardingFlow 
          steps={getSteps()} 
          onComplete={isLogin ? () => {} : handleComplete}
          initialStep={currentStepIndex}
          onStepChange={setCurrentStepIndex}
        />
      </div>
      
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-pink-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-purple-200/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>
    </div>
  );
};

export default OnboardingPage;
