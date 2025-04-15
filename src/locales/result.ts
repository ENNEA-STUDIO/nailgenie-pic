
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
  externalShareSuccess: string;
  externalShareError: string;
  shareNotSupported: string;
  shareLinkCopied: string; 
  sharedDesignTitle: string; 
  tryItFree: string; 
  sharedBy: string; // Translation key for shared by text
  noDescription: string; // Added for empty description fallback
  colorTitle: string; // Added for color section title
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
    downloadSuccess: 'Image ouverte dans un nouvel onglet',
    downloadError: "Impossible d'ouvrir l'image",
    externalShareSuccess: 'Image partagée avec succès',
    externalShareError: 'Impossible de partager l\'image',
    shareNotSupported: 'Le partage n\'est pas supporté sur ce navigateur',
    shareLinkCopied: 'Lien de partage copié!',
    sharedDesignTitle: 'Design Partagé',
    tryItFree: 'Essayer gratuitement',
    sharedBy: 'partagé par',
    noDescription: 'Sans description',
    colorTitle: 'Couleur'
  },
  en: {
    working: 'Designing your nails',
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
    downloadSuccess: 'Image opened in a new tab',
    downloadError: 'Unable to open the image',
    externalShareSuccess: 'Image shared successfully',
    externalShareError: 'Unable to share the image',
    shareNotSupported: 'Sharing is not supported in this browser',
    shareLinkCopied: 'Share link copied!',
    sharedDesignTitle: 'Shared Design',
    tryItFree: 'Try it Free',
    sharedBy: 'shared by',
    noDescription: 'No description',
    colorTitle: 'Color'
  }
};
