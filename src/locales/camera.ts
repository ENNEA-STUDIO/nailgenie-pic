
import { Language } from './types';

export interface CameraTranslations {
  takePhoto: string;
  positionHand: string;
  unavailable: string;
  unavailableDescription: string;
  unavailablePermission: string;
  permissionPrompt: string;
}

export const cameraTranslations: Record<Language, CameraTranslations> = {
  fr: {
    takePhoto: 'Prenez une photo de votre main',
    positionHand: 'Positionnez clairement votre main dans le cadre pour obtenir les meilleurs résultats',
    unavailable: 'Caméra non disponible',
    unavailableDescription: "Veuillez vous assurer que votre appareil dispose d'une caméra et que vous avez autorisé son utilisation.",
    unavailablePermission: 'Détails:',
    permissionPrompt: 'Veuillez autoriser l\'accès à la caméra lorsque demandé',
  },
  en: {
    takePhoto: 'Take a photo of your hand',
    positionHand: 'Position your hand clearly in the frame for best results',
    unavailable: 'Camera not available',
    unavailableDescription: 'Please make sure your device has a camera and you have granted permission to use it.',
    unavailablePermission: 'Details:',
    permissionPrompt: 'Please allow camera access when prompted',
  }
};
