
// Color categories and palettes for nail designs

export type ColorCategory = {
  name: string;
  emoji: string;
  colors: Color[];
};

export type Color = {
  name: string;
  hex: string;
  gradient?: string;
};

/**
 * Application color categories with English and French names
 */
export const colorCategories: ColorCategory[] = [
  {
    name: "Sophisticated Pastels",
    emoji: "🌸",
    colors: [
      { name: "Smoky Lilac", hex: "#C8A4D4" },
      { name: "Frosted Mint", hex: "#98D8C8" },
      { name: "Powder Pink", hex: "#FFD1DC" },
      { name: "Greyed Blue", hex: "#A5C0DD" },
      { name: "Pale Yellow", hex: "#FFFACD" },
      { name: "Soft Lavender", hex: "#E6E6FA" },
      { name: "Pastel Coral", hex: "#FFB6B9" },
      { name: "Light Pistachio", hex: "#DAF7A6" },
      { name: "Pearl Grey", hex: "#E0E0E0" },
      { name: "Soft Vanilla", hex: "#F8EDD1" },
    ]
  },
  {
    name: "Minimalist Neutrals",
    emoji: "🖤",
    colors: [
      { name: "Latte Beige", hex: "#E6CCAF" },
      { name: "Cool Taupe", hex: "#B8A99A" },
      { name: "Stone Grey", hex: "#D3D3D3" },
      { name: "Cappuccino Brown", hex: "#A17249" },
      { name: "Nude Cream", hex: "#FFF3D9" },
      { name: "Warm Sand", hex: "#D2B48C" },
      { name: "Matte Ivory", hex: "#FFFFF0" },
      { name: "Mocha Brown", hex: "#7B3F00" },
      { name: "Rosy Nude", hex: "#E6BEA5" },
      { name: "Café au Lait", hex: "#C19A6B" },
    ]
  },
  {
    name: "Chromes & Metallics",
    emoji: "✨",
    colors: [
      { name: "Liquid Silver", hex: "#C0C0C0", gradient: "linear-gradient(135deg, #C0C0C0 0%, #DCDCDC 50%, #C0C0C0 100%)" },
      { name: "Rose Gold", hex: "#B76E79", gradient: "linear-gradient(135deg, #B76E79 0%, #EACDD2 50%, #B76E79 100%)" },
      { name: "Holographic Chrome", hex: "#EAEAEA", gradient: "linear-gradient(135deg, #C0C0C0 0%, #EAEAEA 50%, #C0C0C0 100%)" },
      { name: "Beetle Green", hex: "#046307", gradient: "linear-gradient(135deg, #046307 0%, #0f9b0f 50%, #046307 100%)" },
      { name: "Metallic Copper", hex: "#B87333", gradient: "linear-gradient(135deg, #B87333 0%, #DBA875 50%, #B87333 100%)" },
      { name: "Steel Blue", hex: "#4682B4", gradient: "linear-gradient(135deg, #4682B4 0%, #7EB6E6 50%, #4682B4 100%)" },
      { name: "Warm Bronze", hex: "#CD7F32", gradient: "linear-gradient(135deg, #CD7F32 0%, #E6BE8A 50%, #CD7F32 100%)" },
      { name: "Platinum", hex: "#E5E4E2", gradient: "linear-gradient(135deg, #E5E4E2 0%, #F7F7F7 50%, #E5E4E2 100%)" },
      { name: "Mirror Black", hex: "#000000", gradient: "linear-gradient(135deg, #000000 0%, #434343 50%, #000000 100%)" },
      { name: "Chrome Lavender", hex: "#8A2BE2", gradient: "linear-gradient(135deg, #8A2BE2 0%, #A569BD 50%, #8A2BE2 100%)" },
    ]
  },
  {
    name: "Translucent \"Jelly\" Effect",
    emoji: "💎",
    colors: [
      { name: "Transparent Candy Pink", hex: "#FF69B4", gradient: "linear-gradient(135deg, #FF69B4AA 0%, #FF69B466 100%)" },
      { name: "Peach Orange", hex: "#FFCC99", gradient: "linear-gradient(135deg, #FFCC99AA 0%, #FFCC9966 100%)" },
      { name: "Frosted Blue", hex: "#A0D2EB", gradient: "linear-gradient(135deg, #A0D2EBAA 0%, #A0D2EB66 100%)" },
      { name: "Watercolor Lavender", hex: "#D8BFD8", gradient: "linear-gradient(135deg, #D8BFD8AA 0%, #D8BFD866 100%)" },
      { name: "Lime Jelly", hex: "#BFFF00", gradient: "linear-gradient(135deg, #BFFF00AA 0%, #BFFF0066 100%)" },
      { name: "Cherry Gloss Red", hex: "#D2042D", gradient: "linear-gradient(135deg, #D2042DAA 0%, #D2042D66 100%)" },
      { name: "Bubblegum Mauve", hex: "#C8A2C8", gradient: "linear-gradient(135deg, #C8A2C8AA 0%, #C8A2C866 100%)" },
      { name: "Melon Yellow", hex: "#FDFD96", gradient: "linear-gradient(135deg, #FDFD96AA 0%, #FDFD9666 100%)" },
      { name: "Translucent Lychee", hex: "#FFE5B4", gradient: "linear-gradient(135deg, #FFE5B4AA 0%, #FFE5B466 100%)" },
      { name: "Glossy Apricot", hex: "#FBCEB1", gradient: "linear-gradient(135deg, #FBCEB1AA 0%, #FBCEB166 100%)" },
    ]
  },
  {
    name: "Vibrant & Vitamin-Rich",
    emoji: "🌈",
    colors: [
      { name: "Lemon Yellow", hex: "#FFFF00" },
      { name: "Neon Coral", hex: "#FF6F61" },
      { name: "Electric Blue", hex: "#1E90FF" },
      { name: "Kiwi Green", hex: "#39FF14" },
      { name: "Neon Pink", hex: "#FF3399" },
      { name: "Orange Punch", hex: "#FF8C00" },
      { name: "Intense Fuchsia", hex: "#FF00FF" },
      { name: "Ultra Violet", hex: "#8A2BE2" },
      { name: "Paprika Red", hex: "#FF0000" },
      { name: "Turquoise Aqua", hex: "#00FFFF" },
    ]
  },
  {
    name: "Earthy & Terracotta",
    emoji: "🔥",
    colors: [
      { name: "Burnt Brick", hex: "#A52A2A" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Golden Ochre", hex: "#CC7722" },
      { name: "Matte Olive", hex: "#556B2F" },
      { name: "Warm Sand", hex: "#D2B48C" },
      { name: "Clay Brown", hex: "#8B4513" },
      { name: "Soft Mustard", hex: "#E1AD01" },
      { name: "Cinnamon", hex: "#D2691E" },
      { name: "Earthy Nude", hex: "#E6CCB2" },
      { name: "Reddish Copper", hex: "#CB6D51" },
    ]
  },
  {
    name: "Icy Whites & Blues",
    emoji: "🧊",
    colors: [
      { name: "Glacier Blue", hex: "#A5F2F3" },
      { name: "Pearly White", hex: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 50%, #FFFFFF 100%)" },
      { name: "Polar Blue", hex: "#8CBED6" },
      { name: "Frosted Silver", hex: "#E8E8E8", gradient: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)" },
      { name: "Frosted Grey", hex: "#DCE2E6" },
      { name: "Bluish Ivory", hex: "#F0FFFF" },
      { name: "Opal Blue", hex: "#B0E0E6" },
      { name: "Bluish Silver", hex: "#C0D5DE" },
      { name: "Snow White", hex: "#F5F5F5" },
      { name: "Pearly Blue", hex: "#7EC8E3" },
    ]
  },
  {
    name: "Mystical & Magical Hues",
    emoji: "🧞‍♀️",
    colors: [
      { name: "Astral Plum", hex: "#673147" },
      { name: "Deep Indigo", hex: "#0A2463" },
      { name: "Glittery Black", hex: "#000000", gradient: "linear-gradient(135deg, #000000 0%, #1B1B1B 50%, #000000 100%)" },
      { name: "Iridescent Burgundy", hex: "#800020", gradient: "linear-gradient(135deg, #800020 0%, #A52A2A 50%, #800020 100%)" },
      { name: "Mystic Violet", hex: "#551A8B" },
      { name: "Starry Night Blue", hex: "#191970" },
      { name: "Dark Emerald Green", hex: "#014421" },
      { name: "Lunar Mauve", hex: "#9B7CB9" },
      { name: "Sparkling Charcoal", hex: "#2C3539", gradient: "linear-gradient(135deg, #2C3539 0%, #424B54 50%, #2C3539 100%)" },
      { name: "Cosmic Purple", hex: "#50203C" },
    ]
  },
  {
    name: "Sunset Vibes",
    emoji: "🏝️",
    colors: [
      { name: "Mandarin Orange", hex: "#FF8C00" },
      { name: "Sunset Pink", hex: "#FF7F50" },
      { name: "Vibrant Fuchsia", hex: "#FF00FF" },
      { name: "Poppy Red", hex: "#FF4500" },
      { name: "Mango Yellow", hex: "#FFCC00" },
      { name: "Dark Coral", hex: "#FF6B6B" },
      { name: "Golden Salmon", hex: "#FA8072" },
      { name: "Warm Peach", hex: "#FFAC92" },
      { name: "Neon Pink", hex: "#FF3399" },
      { name: "Orangey Red", hex: "#FF4433" },
    ]
  },
  {
    name: "Sorbet Pop",
    emoji: "🍧",
    colors: [
      { name: "Frosted Raspberry", hex: "#FF6B88" },
      { name: "Lime Green", hex: "#CCFF00" },
      { name: "Pastel Peach", hex: "#FFCCBB" },
      { name: "Curaçao Blue", hex: "#1CA9C9" },
      { name: "Sorbet Lavender", hex: "#DCBFFF" },
      { name: "Sweet Strawberry", hex: "#FF5E85" },
      { name: "Whipped Mint", hex: "#98FB98" },
      { name: "Orange Ice", hex: "#FF9966" },
      { name: "Pink Lychee", hex: "#FFB3C6" },
      { name: "Sweet Pineapple", hex: "#FADA5E" },
    ]
  },
];

/**
 * Get a color name from a hex value
 * @param hexColor The hex color code
 * @returns The name of the color or the hex code if not found
 */
export const getColorNameFromHex = (hexColor: string): string => {
  for (const category of colorCategories) {
    for (const color of category.colors) {
      if (color.hex === hexColor) {
        return color.name;
      }
    }
  }
  
  return hexColor;
};

/**
 * Get all colors as a flat array
 * @returns Array of all colors from all categories
 */
export const getAllColors = (): Color[] => {
  return colorCategories.flatMap(category => category.colors);
};
