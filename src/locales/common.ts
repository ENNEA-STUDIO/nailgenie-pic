
import { Language, CommonTranslations } from './types';

export const commonTranslations: Record<Language, CommonTranslations> = {
  fr: {
    create: 'Créer',
    gallery: 'Galerie',
    feed: 'Explorer',
    loading: 'Chargement...',
    continue: 'Continuer',
    back: 'Retour',
    error: 'Erreur',
    save: 'Sauvegarder',
    share: 'Partager',
    delete: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    success: 'Succès',
    skip: 'Passer',
    // Add the missing properties
    tryAgain: 'Réessayer',
    download: 'Télécharger',
    logout: 'Déconnexion',
    logoutSuccess: 'Déconnexion réussie',
    errorMessage: 'Une erreur est survenue',
    connectionRequired: 'Connexion requise',
  },
  en: {
    create: 'Create',
    gallery: 'Gallery',
    feed: 'Discover',
    loading: 'Loading...',
    continue: 'Continue',
    back: 'Back',
    error: 'Error',
    save: 'Save',
    share: 'Share',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    success: 'Success',
    skip: 'Skip',
    // Add the missing properties
    tryAgain: 'Try Again',
    download: 'Download',
    logout: 'Logout',
    logoutSuccess: 'Logged out successfully',
    errorMessage: 'An error occurred',
    connectionRequired: 'Connection required',
  }
};
