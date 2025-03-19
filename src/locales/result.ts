
import { Language } from './types';

export interface ResultTranslations {
  working: string;
  loadingError: string;
  safariError: string;
  yourDesign: string;
  saveToGallery: string;
  saving: string;
  savedSuccess: string;
  imageOpened: string;
  savedError: string;
  shareSuccess: string;
  shareError: string;
  downloadSuccess: string;
  downloadError: string;
}

export const resultTranslations: Record<Language, ResultTranslations> = {
  fr: {
    working: 'Création de votre design',
    loadingError: "Impossible de charger l'image générée. Veuillez réessayer.",
    safariError: "Si vous utilisez Safari, essayez d'ouvrir cette application dans Chrome pour de meilleurs résultats.",
    yourDesign: 'Votre design',
    saveToGallery: 'Sauvegarder dans ma gallerie',
    saving: 'Sauvegarde...',
    savedSuccess: 'Design sauvegardé dans votre gallerie !',
    imageOpened: "Image ouverte dans un nouvel onglet. Appuyez longuement pour l'enregistrer.",
    savedError: 'Impossible de sauvegarder le design',
    shareSuccess: 'Design partagé avec succès!',
    shareError: 'Impossible de partager le design',
    downloadSuccess: 'Image sauvegardée',
    downloadError: "Impossible de télécharger l'image",
  },
  en: {
    working: 'Creating your design',
    loadingError: 'Unable to load the generated image. Please try again.',
    safariError: 'If you are using Safari, try opening this application in Chrome for better results.',
    yourDesign: 'Your design',
    saveToGallery: 'Save to my gallery',
    saving: 'Saving...',
    savedSuccess: 'Design saved to your gallery!',
    imageOpened: 'Image opened in a new tab. Press and hold to save it.',
    savedError: 'Unable to save the design',
    shareSuccess: 'Design shared successfully!',
    shareError: 'Unable to share the design',
    downloadSuccess: 'Image saved',
    downloadError: 'Unable to download the image',
  }
};
