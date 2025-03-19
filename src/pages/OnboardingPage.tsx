
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
  };
  
  const handlePasswordSubmit = (values: { password: string; confirmPassword: string }) => {
    setUserData(prev => ({ ...prev, password: values.password }));
  };
  
  const handlePreferencesSubmit = (preferences: string[]) => {
    setUserData(prev => ({ ...prev, preferences }));
  };
  
  const handleComplete = async () => {
    try {
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
      
      // Rediriger vers la page de la caméra
      setTimeout(() => {
        navigate('/camera');
      }, 1500);
      
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
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full pb-10">
        <OnboardingFlow 
          steps={steps} 
          onComplete={handleComplete}
          initialStep={currentStepIndex}
          onStepChange={setCurrentStepIndex}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
