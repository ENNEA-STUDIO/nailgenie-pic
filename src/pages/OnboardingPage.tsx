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

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
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
  
  const handleComplete = async () => {
    try {
      console.log("Creating account with data:", { email: userData.email, fullName: userData.fullName });
      
      // Créer un compte utilisateur avec Supabase
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
      
      toast.success("Votre compte a été créé avec succès!");
      
      // Force navigation to camera page immediately and prevent going back to onboarding
      console.log("Account created successfully, redirecting to camera page");
      navigate('/camera', { replace: true });
      
    } catch (error: any) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error(error.message || "Une erreur s'est produite lors de la création de votre compte");
    }
  };

  const handleNext = () => {
    setCurrentStepIndex(prev => prev + 1);
  };
  
  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenue',
      description: 'Découvrez NailGenie',
      component: <WelcomeStep onNext={handleNext} />
    },
    {
      id: 'profile',
      title: 'Profil',
      description: 'Informations de base',
      component: <ProfileForm onSubmitValues={handleProfileSubmit} />
    },
    {
      id: 'password',
      title: 'Sécurité',
      description: 'Créez un mot de passe',
      component: <PasswordForm onSubmitValues={handlePasswordSubmit} />
    },
    {
      id: 'preferences',
      title: 'Préférences',
      description: 'Personnalisez votre expérience',
      component: <PreferencesForm onSubmitValues={handlePreferencesSubmit} />
    },
    {
      id: 'success',
      title: 'Terminé',
      description: 'Votre compte est prêt',
      component: <SuccessStep />
    }
  ];
  
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
          steps={steps} 
          onComplete={handleComplete}
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
