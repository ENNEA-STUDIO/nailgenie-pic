
import { Language } from './types';
import { commonTranslations, CommonTranslations } from './common';
import { cameraTranslations, CameraTranslations } from './camera';
import { promptTranslations, PromptTranslations } from './prompt';
import { resultTranslations, ResultTranslations } from './result';
import { 
  shapesTranslations, 
  shapeDescriptionsTranslations,
  ShapesTranslations, 
  ShapeDescriptionsTranslations 
} from './shapes';
import { onboardingTranslations, OnboardingTranslations } from './onboarding';

// Type for the combined translations structure
export type TranslationKeys = {
  common: CommonTranslations;
  camera: CameraTranslations;
  prompt: PromptTranslations;
  result: ResultTranslations;
  shapes: ShapesTranslations;
  shapeDescriptions: ShapeDescriptionsTranslations;
  onboarding: OnboardingTranslations;
};

// The actual combined translations
export const translations: Record<Language, TranslationKeys> = {
  fr: {
    common: commonTranslations.fr,
    camera: cameraTranslations.fr,
    prompt: promptTranslations.fr,
    result: resultTranslations.fr,
    shapes: shapesTranslations.fr,
    shapeDescriptions: shapeDescriptionsTranslations.fr,
    onboarding: onboardingTranslations.fr,
  },
  en: {
    common: commonTranslations.en,
    camera: cameraTranslations.en,
    prompt: promptTranslations.en,
    result: resultTranslations.en,
    shapes: shapesTranslations.en,
    shapeDescriptions: shapeDescriptionsTranslations.en,
    onboarding: onboardingTranslations.en,
  },
};

// Re-export the Language type with proper syntax for isolatedModules
export type { Language };
