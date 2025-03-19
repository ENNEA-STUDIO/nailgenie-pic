
import { Language } from './types';

export interface ShapesTranslations {
  round: string;
  square: string;
  oval: string;
  almond: string;
  stiletto: string;
  coffin: string;
}

export interface ShapeDescriptionsTranslations {
  round: string;
  square: string;
  oval: string;
  almond: string;
  stiletto: string;
  coffin: string;
}

export const shapesTranslations: Record<Language, ShapesTranslations> = {
  fr: {
    round: 'round',
    square: 'square',
    oval: 'oval',
    almond: 'almond',
    stiletto: 'stiletto',
    coffin: 'coffin',
  },
  en: {
    round: 'round',
    square: 'square',
    oval: 'oval',
    almond: 'almond',
    stiletto: 'stiletto',
    coffin: 'coffin',
  }
};

export const shapeDescriptionsTranslations: Record<Language, ShapeDescriptionsTranslations> = {
  fr: {
    round: 'Forme classique et naturelle',
    square: 'Bout droit avec coins arrondis',
    oval: 'Forme allongée et élégante',
    almond: 'En pointe arrondie comme une amande',
    stiletto: 'Très pointu et dramatique',
    coffin: 'Rectangulaire avec bout plat',
  },
  en: {
    round: 'Classic and natural shape',
    square: 'Straight edge with rounded corners',
    oval: 'Elongated and elegant shape',
    almond: 'Rounded point like an almond',
    stiletto: 'Very pointy and dramatic',
    coffin: 'Rectangular with flat tip',
  }
};
