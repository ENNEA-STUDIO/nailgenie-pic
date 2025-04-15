
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
    // Minimalist Neutrals
    '#E6CCAF': 'Latte Beige',
    '#B8A99A': 'Cool Taupe',
    '#F8F0DD': 'Ivory',
    '#FFF3D9': 'Nude Cream',
    '#A17249': 'Cappuccino Brown',
    '#D2B48C': 'Warm Sand',
    '#FFFFFF': 'White',
    '#FFC0CB': 'Light Pink',
    '#E8E8E8': 'Icy Grey',
    '#F2F3F4': 'Transparent',
    
    // Icy Blues
    '#0A2463': 'Deep Navy',
    '#7EC8E3': 'Sky Blue',
    '#C8A2C8': 'Lavender',
    '#C8A4D4': 'Smoky Lilac',
    '#9CAF88': 'Sage Green',
    '#98D8C8': 'Frosted Mint',
    '#B0E0E6': 'Baby Blue',
    '#E6E6FA': 'Soft Lavender',
    
    // Warm Tones
    '#D2042D': 'Cherry Red',
    '#A52A2A': 'Brick Red',
    '#FF7F50': 'Coral',
    '#FFE5B4': 'Peach',
    '#CC5500': 'Burnt Orange',
    '#E2725B': 'Terracotta',
    '#FF69B4': 'Bright Pink',
    
    // Metallics & Effects
    '#D4AF37': 'Gold',
    '#C0C0C0': 'Silver',
    '#B87333': 'Copper',
    '#EAEAEA': 'Pearly',
    '#B76E79': 'Rose Gold',
    '#E5E4E2': 'Platinum',
    '#F7E7CE': 'Champagne',
  };
  
  return colorMap[hexColor] || hexColor;
};
