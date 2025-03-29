
import { Language } from './types';

export interface ShapesTranslations {
  round: string;
  square: string;
  oval: string;
  almond: string;
  stiletto: string;
  coffin: string;
  squoval: string;
  ballerina: string;
  duck: string;
  lips: string;
  edge: string;
  arrowhead: string;
  flare: string;
  lipstick: string;
}

export interface ShapeDescriptionsTranslations {
  round: string;
  square: string;
  oval: string;
  almond: string;
  stiletto: string;
  coffin: string;
  squoval: string;
  ballerina: string;
  duck: string;
  lips: string;
  edge: string;
  arrowhead: string;
  flare: string;
  lipstick: string;
}

export const shapesTranslations: Record<Language, ShapesTranslations> = {
  fr: {
    round: 'rond',
    square: 'carré',
    oval: 'ovale',
    almond: 'amande',
    stiletto: 'stiletto',
    coffin: 'cercueil',
    squoval: 'squoval',
    ballerina: 'ballerine',
    duck: 'canard',
    lips: 'lèvres',
    edge: 'edge',
    arrowhead: 'flèche',
    flare: 'évasé',
    lipstick: 'rouge à lèvres',
  },
  en: {
    round: 'round',
    square: 'square',
    oval: 'oval',
    almond: 'almond',
    stiletto: 'stiletto',
    coffin: 'coffin',
    squoval: 'squoval',
    ballerina: 'ballerina',
    duck: 'duck',
    lips: 'lips',
    edge: 'edge',
    arrowhead: 'arrowhead',
    flare: 'flare',
    lipstick: 'lipstick',
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
    squoval: 'Mélange entre carré et ovale',
    ballerina: 'Similaire au cercueil mais plus arrondi',
    duck: 'Bout évasé ressemblant à un bec de canard',
    lips: 'Forme ondulée évoquant des lèvres',
    edge: 'Bout plat avec côtés tranchants',
    arrowhead: 'En pointe comme une flèche',
    flare: 'Bout large et évasé',
    lipstick: 'Incliné en diagonale comme du rouge à lèvres',
  },
  en: {
    round: 'Classic and natural shape',
    square: 'Straight edge with rounded corners',
    oval: 'Elongated and elegant shape',
    almond: 'Rounded point like an almond',
    stiletto: 'Very pointy and dramatic',
    coffin: 'Rectangular with flat tip',
    squoval: 'Mix between square and oval',
    ballerina: 'Similar to coffin but more rounded',
    duck: 'Flared tip resembling a duck bill',
    lips: 'Wavy shape evoking lips',
    edge: 'Flat tip with sharp sides',
    arrowhead: 'Pointed like an arrow',
    flare: 'Wide and flared tip',
    lipstick: 'Slanted diagonally like lipstick',
  }
};
