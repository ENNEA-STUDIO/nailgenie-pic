
// Translations for the application in French and English
export type Language = 'fr' | 'en';

// Type for the translations structure
export type TranslationKeys = {
  common: {
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
  };
  camera: {
    takePhoto: string;
    positionHand: string;
    unavailable: string;
    unavailableDescription: string;
    unavailablePermission: string;
  };
  prompt: {
    customizeNails: string;
    nailShape: string;
    length: string;
    short: string;
    medium: string;
    long: string;
    continue: string;
    describeDesign: string;
    generateDesign: string;
    typePromptHere: string;
    or: string;
    chooseExample: string;
  };
  result: {
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
  };
  shapes: {
    round: string;
    square: string;
    oval: string;
    almond: string;
    stiletto: string;
    coffin: string;
  };
  shapeDescriptions: {
    round: string;
    square: string;
    oval: string;
    almond: string;
    stiletto: string;
    coffin: string;
  };
  onboarding: {
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
  };
};

// The actual translations
export const translations: Record<Language, TranslationKeys> = {
  fr: {
    common: {
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
    camera: {
      takePhoto: 'Prenez une photo de votre main',
      positionHand: 'Positionnez clairement votre main dans le cadre pour obtenir les meilleurs résultats',
      unavailable: 'Caméra non disponible',
      unavailableDescription: "Veuillez vous assurer que votre appareil dispose d'une caméra et que vous avez autorisé son utilisation.",
      unavailablePermission: 'Détails:',
    },
    prompt: {
      customizeNails: 'Personnalisez vos ongles',
      nailShape: "Forme d'ongles",
      length: 'Longueur',
      short: 'Court',
      medium: 'Moyen',
      long: 'Long',
      continue: 'Continuer',
      describeDesign: 'Décrivez votre design',
      generateDesign: 'Générer le design',
      typePromptHere: 'Décrivez votre design ici...',
      or: 'ou',
      chooseExample: 'choisissez un exemple',
    },
    result: {
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
    shapes: {
      round: 'round',
      square: 'square',
      oval: 'oval',
      almond: 'almond',
      stiletto: 'stiletto',
      coffin: 'coffin',
    },
    shapeDescriptions: {
      round: 'Forme classique et naturelle',
      square: 'Bout droit avec coins arrondis',
      oval: 'Forme allongée et élégante',
      almond: 'En pointe arrondie comme une amande',
      stiletto: 'Très pointu et dramatique',
      coffin: 'Rectangulaire avec bout plat',
    },
    onboarding: {
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
  },
  en: {
    common: {
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
    },
    camera: {
      takePhoto: 'Take a photo of your hand',
      positionHand: 'Position your hand clearly in the frame for best results',
      unavailable: 'Camera not available',
      unavailableDescription: 'Please make sure your device has a camera and you have granted permission to use it.',
      unavailablePermission: 'Details:',
    },
    prompt: {
      customizeNails: 'Customize your nails',
      nailShape: 'Nail shape',
      length: 'Length',
      short: 'Short',
      medium: 'Medium',
      long: 'Long',
      continue: 'Continue',
      describeDesign: 'Describe your design',
      generateDesign: 'Generate design',
      typePromptHere: 'Describe your design here...',
      or: 'or',
      chooseExample: 'choose an example',
    },
    result: {
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
    },
    shapes: {
      round: 'round',
      square: 'square',
      oval: 'oval',
      almond: 'almond',
      stiletto: 'stiletto',
      coffin: 'coffin',
    },
    shapeDescriptions: {
      round: 'Classic and natural shape',
      square: 'Straight edge with rounded corners',
      oval: 'Elongated and elegant shape',
      almond: 'Rounded point like an almond',
      stiletto: 'Very pointy and dramatic',
      coffin: 'Rectangular with flat tip',
    },
    onboarding: {
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
    },
  },
};
