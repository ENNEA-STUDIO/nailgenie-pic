
export type Language = 'en' | 'fr';

export interface CommonTranslations {
  create: string;
  gallery: string;
  feed: string;
  loading: string;
  continue: string;
  back: string;
  error: string;
  save: string;
  share: string;
  delete: string;
  cancel: string;
  confirm: string;
  success: string;
  skip: string;
  tryAgain: string;
  download: string;
  logout: string;
  logoutSuccess: string;
  errorMessage: string;
  connectionRequired: string;
}

export interface OnboardingTranslations {
  welcome: string;
  welcomeMessage: string;
  getStarted: string;
  createAccount: string;
  signIn: string;
  emailVerification: string;
  checkEmail: string;
  checkEmailMessage: string;
  resendEmail: string;
  emailResent: string;
  setupProfile: string;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  preferences: string;
  chooseShape: string;
  chooseColor: string;
  chooseLength: string;
  completeSignup: string;
  congratulations: string;
  accountCreated: string;
  startGenerating: string;
  alreadyHaveAccount: string;
}

export interface PromptTranslations {
  title: string;
  description: string;
  placeholder: string;
  examplesTitle: string;
  submit: string;
  error: string;
  tips: string;
  tipsText: string;
  lengthWarning: string;
  generating: string;
  categories: {
    seasonal: string;
    french: string;
    abstract: string;
    floral: string;
    geometric: string;
    minimalist: string;
    nailArt: string;
    ombre: string;
    glitter: string;
    gems: string;
    animal: string;
    marble: string;
  };
}

export interface CameraTranslations {
  title: string;
  description: string;
  takePicture: string;
  retake: string;
  continue: string;
  permissionDenied: string;
  permissionError: string;
  handNotDetected: string;
  switchCamera: string;
  holdStill: string;
  processing: string;
  help: string;
  helpText: string;
  noHandDetected: string;
  noCameraDetected: string;
  errorLoadingCamera: string;
  cameraInstructions: string;
  instructionSteps: {
    first: string;
    second: string;
    third: string;
  };
  tip: string;
}

export interface ResultTranslations {
  yourDesign: string;
  saveToGallery: string;
  downloadSuccess: string;
  downloadError: string;
  savedSuccess: string;
  savedError: string;
  shareSuccess: string;
  shareError: string;
  imageOpened: string;
}

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
  costOneCredit: string;
  inviteFriends: string;
  inviteExplainer: string;
  generateInvite: string;
  copyCode: string;
  shareInvite: string;
  inviteCodeCopied: string;
  invitationSuccess: string;
  rewardAmount: string;
  shareAndEarn: string;
  earnCredits: string;
  forYouAndFriend: string;
  inviteLinkReady: string;
  tapToShare: string;
  invalidInviteCode: string;
  enterInviteCode: string;
  successInviteCode: string;
  creditPack: string;
  creditPackPrice: string;
  unlimitedPlan: string;
  unlimitedPlanPrice: string;
  unlimitedExplainer: string;
  oneTimePurchase: string;
  subscribe: string;
  subscriptionExplainer: string;
  unlimitedDesigns: string;
  cancelAnytime: string;
  tenCreditsForDesigns: string;
  comingSoon: string;
  shareText: string;
  errorGeneratingCode: string;
}
