
import { colorCategories, getAllColors } from "./colorCategories";

/**
 * Get a color name from a hex code
 * @param hexColor The hex color code
 * @returns The name of the color or the hex code if not found
 */
export const getColorNameFromHex = (hexColor: string): string => {
  // Handle special case for gradient colors
  if (hexColor.includes("gradient")) {
    const baseHex = hexColor.split("_gradient")[0];
    const colors = getAllColors();
    const matchingColor = colors.find(color => color.hex === baseHex && color.gradient);
    if (matchingColor) {
      return matchingColor.name;
    }
  }

  // Regular color lookup
  for (const category of colorCategories) {
    for (const color of category.colors) {
      if (color.hex === hexColor) {
        return color.name;
      }
    }
  }
  
  // Fallback to the original color map for backwards compatibility
  const colorMap: Record<string, string> = {
    // Nude & Neutrals
    '#E6CCAF': 'Beige',
    '#B8A99A': 'Taupe',
    '#F8F0DD': 'Ivoire',
    '#FFF3D9': 'Crème',
    '#A17249': 'Cappuccino',
    '#D2B48C': 'Sable',
    '#FFFFFF': 'Blanc',
    '#FFC0CB': 'Rose pâle',
    '#E8E8E8': 'Gris glacé',
    '#F2F3F4': 'Transparent',
    
    // Cool Tones
    '#0A2463': 'Bleu marine',
    '#7EC8E3': 'Bleu ciel',
    '#C8A2C8': 'Lavande',
    '#C8A4D4': 'Lilas',
    '#9CAF88': 'Vert sauge',
    '#98D8C8': 'Menthe',
    '#B0E0E6': 'Bleu bébé',
    '#E6E6FA': 'Lavande douce',
    
    // Warm Tones
    '#D2042D': 'Rouge cerise',
    '#A52A2A': 'Rouge brique',
    '#FF7F50': 'Corail',
    '#FFE5B4': 'Pêche',
    '#CC5500': 'Orange brûlé',
    '#E2725B': 'Terre cuite',
    '#FF69B4': 'Rose vif',
    
    // Metallic & Effects
    '#D4AF37': 'Or',
    '#C0C0C0': 'Argent',
    '#B87333': 'Cuivre',
    '#EAEAEA': 'Nacré',
    '#B76E79': 'Or rose',
    '#E5E4E2': 'Platine',
    '#F7E7CE': 'Champagne',
  };
  
  return colorMap[hexColor] || hexColor;
};
