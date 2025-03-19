
/**
 * Utility functions for handling prompt examples and text transformations
 */

// Base example prompts
export const examplePrompts = [
  "Geometric Lines avec un dégradé de bleu",
  "French Manicure avec des accents dorés",
  "Effet Watercolor inspiré par un coucher de soleil",
  "Dégradé pastel avec des motifs fleuris",
  "Marble Effect avec des détails argentés",
  "Negative Space avec des motifs minimalistes",
  "Metallic Drips en rose gold",
  "Jelly Nails avec des paillettes holographiques",
];

/**
 * Gets a random selection of example prompts
 */
export const getRandomExamples = (count = 8) => {
  const shuffled = [...examplePrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Extracts the main concept from a full example prompt
 */
export const extractMainConcept = (example: string): string => {
  return example.split(" avec ")[0].split(" en ")[0].split(" inspiré")[0];
};
