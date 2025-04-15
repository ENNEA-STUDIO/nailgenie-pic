
import { Language } from './types';
import { commonTranslations } from './common';
import { promptTranslations } from './prompt';
import { onboardingTranslations } from './onboarding';
import { cameraTranslations } from './camera';
import { resultTranslations } from './result';
import { shapesTranslations, shapeDescriptionsTranslations } from './shapes';
import { creditsTranslations } from './credits';

export type { Language } from './types';

export const translations = {
  fr: {
    common: commonTranslations.fr,
    prompt: promptTranslations.fr,
    onboarding: onboardingTranslations.fr,
    camera: cameraTranslations.fr,
    result: resultTranslations.fr,
    shapes: shapesTranslations.fr,
    shapeDescriptions: shapeDescriptionsTranslations.fr,
    credits: creditsTranslations.fr,
    nav: {
      camera: 'Caméra',
      gallery: 'Galerie',
      feed: 'Découvrir',
      credits: 'Crédits'
    },
    colors: {
      title: 'Couleur',
      categories: {
        pastelsSophistiques: 'Pastels Sophistiqués',
        neutralsMinimalistes: 'Neutres Minimalistes',
        chromesMetalliques: 'Chromes & Métallisées',
        jellyTranslucide: 'Effet "Jelly" Translucide',
        vibrantesVitaminees: 'Vibrantes & Vitaminées',
        earthyTerracotta: 'Earthy & Terracotta',
        blancsBleu: 'Blancs & Bleus Glaciaires',
        mystiquesEtMagiques: 'Teintes Mystiques & Magiques',
        sunsetVibes: 'Sunset Vibes',
        sorbetPop: 'Sorbet Pop'
      }
    }
  },
  en: {
    common: commonTranslations.en,
    prompt: promptTranslations.en,
    onboarding: onboardingTranslations.en,
    camera: cameraTranslations.en,
    result: resultTranslations.en,
    shapes: shapesTranslations.en,
    shapeDescriptions: shapeDescriptionsTranslations.en,
    credits: creditsTranslations.en,
    nav: {
      camera: 'Camera',
      gallery: 'Gallery',
      feed: 'Discover',
      credits: 'Credits'
    },
    colors: {
      title: 'Color',
      categories: {
        pastelsSophistiques: 'Sophisticated Pastels',
        neutralsMinimalistes: 'Minimalist Neutrals',
        chromesMetalliques: 'Chromes & Metallics',
        jellyTranslucide: 'Translucent "Jelly" Effect',
        vibrantesVitaminees: 'Vibrant & Vitamin-Rich',
        earthyTerracotta: 'Earthy & Terracotta',
        blancsBleu: 'Icy Whites & Blues',
        mystiquesEtMagiques: 'Mystical & Magical Hues',
        sunsetVibes: 'Sunset Vibes',
        sorbetPop: 'Sorbet Pop'
      }
    }
  }
};

// No need to export TranslationType as it's now defined in LanguageContext.tsx
export type TranslationType = typeof translations.en;
