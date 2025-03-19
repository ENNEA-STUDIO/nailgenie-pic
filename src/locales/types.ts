
// Common types for translations
export type Language = 'fr' | 'en';

// Base type for all translation sections
export interface BaseTranslation {
  [key: string]: string | Record<string, string | Record<string, string>>;
}
