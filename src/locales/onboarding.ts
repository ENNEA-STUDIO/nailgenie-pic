
import { Language } from './types';

export interface OnboardingTranslations {
  welcome: string;
  profile: string;
  security: string;
  preferences: string;
  done: string;
  profileDesc: string;
  securityDesc: string;
  preferencesDesc: string;
  doneDesc: string;
  accountCreated: string;
}

export const onboardingTranslations: Record<Language, OnboardingTranslations> = {
  fr: {
    welcome: 'Bienvenue',
    profile: 'Profil',
    security: 'Sécurité',
    preferences: 'Préférences',
    done: 'Terminé',
    profileDesc: 'Informations de base',
    securityDesc: 'Créez un mot de passe',
    preferencesDesc: 'Personnalisez votre expérience',
    doneDesc: 'Votre compte est prêt',
    accountCreated: 'Votre compte a été créé avec succès!',
  },
  en: {
    welcome: 'Welcome',
    profile: 'Profile',
    security: 'Security',
    preferences: 'Preferences',
    done: 'Done',
    profileDesc: 'Basic information',
    securityDesc: 'Create a password',
    preferencesDesc: 'Customize your experience',
    doneDesc: 'Your account is ready',
    accountCreated: 'Your account has been created successfully!',
  }
};
