
import { Language } from './types';

export interface CreditsTranslations {
  buyCredits: string;
  currentCredits: string;
  creditsExplainer: string;
  lowCredits: string;
  notEnoughCredits: string;
  processing: string;
  success: string;
  mostPopular: string;
  fewMoreDrops: string;
}

export const creditsTranslations: Record<Language, CreditsTranslations> = {
  fr: {
    buyCredits: 'Acheter des crédits',
    currentCredits: 'Vos crédits',
    creditsExplainer: 'Les crédits vous permettent de générer des designs d\'ongles. Chaque design coûte 1 crédit.',
    lowCredits: 'Crédits faibles!',
    notEnoughCredits: 'Pas assez de crédits',
    processing: 'Traitement...',
    success: 'Succès!',
    mostPopular: 'Plus populaire',
    fewMoreDrops: 'Encore quelques gouttes de vernis...',
  },
  en: {
    buyCredits: 'Buy Credits',
    currentCredits: 'Your Credits',
    creditsExplainer: 'Credits allow you to generate nail designs. Each design costs 1 credit.',
    lowCredits: 'Low credits!',
    notEnoughCredits: 'Not enough credits',
    processing: 'Processing...',
    success: 'Success!',
    mostPopular: 'Most Popular',
    fewMoreDrops: 'Just a few more drops of polish...',
  }
};
