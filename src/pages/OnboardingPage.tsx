
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import ProfileForm from "@/components/onboarding/ProfileForm";
import PasswordForm from "@/components/onboarding/PasswordForm";
import PreferencesForm from "@/components/onboarding/PreferencesForm";
import SuccessStep from "@/components/onboarding/SuccessStep";
import { useLanguage } from "@/context/LanguageContext";
import LoginStep from "@/components/onboarding/LoginStep";
import EmailVerificationStep from "@/components/onboarding/EmailVerificationStep";
import InviteCodeStep from "@/components/onboarding/InviteCodeStep";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { t, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    preferences: [] as string[],
    inviteCode: "",
  });

  // Extract invite code from URL parameters if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const inviteCode = queryParams.get('invite');
    if (inviteCode) {
      setUserData(prev => ({ ...prev, inviteCode }));
      // Show a toast to let the user know they're using an invitation
      toast.success(
        language === 'fr' 
          ? 'Vous vous inscrivez avec une invitation! Vous recevrez 5 crédits supplémentaires.'
          : 'You\'re signing up with an invitation! You\'ll receive 5 additional credits.',
        { duration: 4000 }
      );
    }
  }, [location, language]);

  const handleProfileSubmit = (values: { fullName: string; email: string }) => {
    setUserData((prev) => ({ ...prev, ...values }));
    handleNext();
  };

  const handlePasswordSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setUserData((prev) => ({ ...prev, password: values.password }));
    handleNext();
  };

  const handlePreferencesSubmit = (preferences: string[]) => {
    setUserData((prev) => ({ ...prev, preferences }));
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
        password: values.password,
      });

      if (error) throw error;

      toast.success(
        language === "fr" ? "Connexion réussie !" : "Successfully logged in!"
      );

      // Redirect to camera page and prevent going back to onboarding
      navigate("/camera", { replace: true });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      toast.error(
        error.message ||
          (language === "fr" ? "Échec de la connexion" : "Login failed")
      );
    }
  };

  const handleInviteCode = (code?: string) => {
    if (code) {
      setUserData(prev => ({ ...prev, inviteCode: code }));
    }
    handleNext();
  };

  const handleComplete = async () => {
    try {
      console.log("Creating account with data:", {
        email: userData.email,
        fullName: userData.fullName,
        inviteCode: userData.inviteCode,
      });

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            preferences: userData.preferences,
          },
        },
      });

      if (error) throw error;

      // First create basic credits for the user (5 credits)
      if (data.user) {
        try {
          const { error: creditsError } = await supabase
            .from("user_credits")
            .insert([{ user_id: data.user.id, credits: 5 }]);
          
          if (creditsError) {
            console.error("Error adding base credits:", creditsError);
          } else {
            console.log("Successfully added 5 base credits to new user");
          }
        } catch (creditsErr) {
          console.error("Error with base credits process:", creditsErr);
        }
      }

      // If an invite code was provided, use it after signup to add bonus credits
      if (userData.inviteCode && data.user) {
        try {
          // Apply the invitation code - this should reward both users
          const { data: inviteResult, error: inviteError } = await supabase.functions.invoke(
            'use-invitation', 
            {
              body: {
                invitationCode: userData.inviteCode,
                newUserId: data.user.id
              }
            }
          );
          
          if (inviteError) {
            console.error("Error applying invitation code:", inviteError);
          } else if (inviteResult) {
            console.log("Invitation applied successfully:", inviteResult);
            toast.success(
              language === "fr" 
                ? 'Invitation acceptée! Vous recevrez 5 crédits supplémentaires après avoir confirmé votre compte.'
                : 'Invitation accepted! You\'ll receive 5 additional credits after confirming your account.'
            );
          }
        } catch (inviteErr) {
          console.error("Error with invitation process:", inviteErr);
        }
      }

      toast.success(
        language === "fr"
          ? "Votre compte a été créé avec succès! Veuillez vérifier votre boîte mail."
          : "Account created! Please check your email."
      );

      // Show confirmation message instead of redirecting
      setCurrentStepIndex((prev) => prev + 1);
    } catch (error: any) {
      console.error("Erreur lors de la création du compte:", error);
      toast.error(
        error.message ||
          (language === "fr"
            ? "Une erreur s'est produite lors de la création de votre compte"
            : "An error occurred while creating your account")
      );
    }
  };

  const handleNext = () => {
    setCurrentStepIndex((prev) => prev + 1);
  };

  // Generate steps based on login mode
  const getSteps = () => {
    if (isLogin) {
      // Login flow
      return [
        {
          id: "welcome",
          title: language === "fr" ? "Bienvenue" : "Welcome",
          description:
            language === "fr" ? "Découvrez NailGenie" : "Discover NailGenie",
          component: (
            <WelcomeStep
              onNext={handleNext}
              showLoginOption
              toggleLoginMode={toggleLoginMode}
              isLogin={isLogin}
            />
          ),
        },
        {
          id: "login",
          title: language === "fr" ? "Connexion" : "Login",
          description:
            language === "fr"
              ? "Connectez-vous à votre compte"
              : "Sign in to your account",
          component: (
            <LoginStep
              onSubmitValues={handleLogin}
              toggleLoginMode={toggleLoginMode}
            />
          ),
        },
      ];
    } else {
      // Signup flow
      return [
        {
          id: "welcome",
          title: language === "fr" ? "Bienvenue" : "Welcome",
          description:
            language === "fr" ? "Découvrez NailGenie" : "Discover NailGenie",
          component: (
            <WelcomeStep
              onNext={handleNext}
              showLoginOption
              toggleLoginMode={toggleLoginMode}
              isLogin={isLogin}
            />
          ),
        },
        {
          id: "profile",
          title: language === "fr" ? "Profil" : "Profile",
          description:
            language === "fr" ? "Informations de base" : "Basic information",
          component: <ProfileForm onSubmitValues={handleProfileSubmit} />,
        },
        {
          id: "password",
          title: language === "fr" ? "Sécurité" : "Security",
          description:
            language === "fr" ? "Créez un mot de passe" : "Create a password",
          component: <PasswordForm onSubmitValues={handlePasswordSubmit} />,
        },
        {
          id: "invite",
          title: language === "fr" ? "Invitation" : "Invitation",
          description:
            language === "fr"
              ? "Avez-vous un code d'invitation?"
              : "Do you have an invitation code?",
          component: <InviteCodeStep onContinue={handleInviteCode} />,
        },
        {
          id: "preferences",
          title: language === "fr" ? "Préférences" : "Preferences",
          description:
            language === "fr"
              ? "Personnalisez votre expérience"
              : "Customize your experience",
          component: <PreferencesForm onSubmitValues={handleComplete} />,
        },
        {
          id: "emailVerification",
          title:
            language === "fr"
              ? "Vérification de l'email"
              : "Email Verification",
          description:
            language === "fr"
              ? "Veuillez vérifier votre email"
              : "Please check your email",
          component: <EmailVerificationStep />,
        },
        {
          id: "success",
          title: language === "fr" ? "Terminé" : "Done",
          description:
            language === "fr"
              ? "Votre compte est prêt"
              : "Your account is ready",
          component: <SuccessStep />,
        },
      ];
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #f8e9ff 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
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
