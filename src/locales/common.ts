
import { Language } from './types';

export interface CommonTranslations {
  tryAgain: string;
  error: string;
  loading: string;
  download: string;
  share: string;
  save: string;
  create: string;
  gallery: string;
  logout: string;
  logoutSuccess: string;
  errorMessage: string;
  connectionRequired: string;
}

export const commonTranslations: Record<Language, CommonTranslations> = {
  fr: {
    tryAgain: 'Réessayer',
    error: 'Erreur',
    loading: 'Chargement',
    download: 'Télécharger',
    share: 'Partager',
    save: 'Sauvegarder',
    create: 'Créer',
    gallery: 'Gallerie',
    logout: 'Déconnexion',
    logoutSuccess: 'Vous avez été déconnecté avec succès',
    errorMessage: "Une erreur s'est produite",
    connectionRequired: 'Veuillez vous connecter pour accéder à cette page',
  },
  en: {
    tryAgain: 'Try Again',
    error: 'Error',
    loading: 'Loading',
    download: 'Download',
    share: 'Share',
    save: 'Save',
    create: 'Create',
    gallery: 'Gallery',
    logout: 'Logout',
    logoutSuccess: 'You have been successfully logged out',
    errorMessage: 'An error occurred',
    connectionRequired: 'Please log in to access this page',
  }
};
