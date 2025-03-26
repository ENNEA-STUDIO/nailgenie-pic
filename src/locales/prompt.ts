
import { Language } from './types';

export interface PromptTranslations {
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
  describeHelp: string; // Add the missing property
}

export const promptTranslations: Record<Language, PromptTranslations> = {
  fr: {
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
    describeHelp: 'Soyez précis pour obtenir exactement ce que vous voulez',
  },
  en: {
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
    describeHelp: 'Be specific to get exactly what you want',
  }
};
