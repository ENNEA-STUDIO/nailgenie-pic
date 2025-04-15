
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
 * Application color categories with French names
 */
export const colorCategories: ColorCategory[] = [
  {
    name: "Pastels Sophistiqués",
    emoji: "🌸",
    colors: [
      { name: "Lilas fumé", hex: "#C8A4D4" },
      { name: "Menthe givrée", hex: "#98D8C8" },
      { name: "Rose poudre", hex: "#FFD1DC" },
      { name: "Bleu grisé", hex: "#A5C0DD" },
      { name: "Jaune pâle", hex: "#FFFACD" },
      { name: "Lavande douce", hex: "#E6E6FA" },
      { name: "Corail pastel", hex: "#FFB6B9" },
      { name: "Pistache claire", hex: "#DAF7A6" },
      { name: "Gris perle", hex: "#E0E0E0" },
      { name: "Vanille douce", hex: "#F8EDD1" },
    ]
  },
  {
    name: "Neutres Minimalistes",
    emoji: "🖤",
    colors: [
      { name: "Beige latte", hex: "#E6CCAF" },
      { name: "Taupe froid", hex: "#B8A99A" },
      { name: "Gris pierre", hex: "#D3D3D3" },
      { name: "Brun cappuccino", hex: "#A17249" },
      { name: "Crème nude", hex: "#FFF3D9" },
      { name: "Sable chaud", hex: "#D2B48C" },
      { name: "Ivoire mat", hex: "#FFFFF0" },
      { name: "Brun moka", hex: "#7B3F00" },
      { name: "Nude rosé", hex: "#E6BEA5" },
      { name: "Café au lait", hex: "#C19A6B" },
    ]
  },
  {
    name: "Chromes & Métallisées",
    emoji: "✨",
    colors: [
      { name: "Argent liquide", hex: "#C0C0C0", gradient: "linear-gradient(135deg, #C0C0C0 0%, #DCDCDC 50%, #C0C0C0 100%)" },
      { name: "Or rose", hex: "#B76E79", gradient: "linear-gradient(135deg, #B76E79 0%, #EACDD2 50%, #B76E79 100%)" },
      { name: "Chrome holographique", hex: "#EAEAEA", gradient: "linear-gradient(135deg, #C0C0C0 0%, #EAEAEA 50%, #C0C0C0 100%)" },
      { name: "Vert scarabée", hex: "#046307", gradient: "linear-gradient(135deg, #046307 0%, #0f9b0f 50%, #046307 100%)" },
      { name: "Cuivre métallique", hex: "#B87333", gradient: "linear-gradient(135deg, #B87333 0%, #DBA875 50%, #B87333 100%)" },
      { name: "Bleu acier", hex: "#4682B4", gradient: "linear-gradient(135deg, #4682B4 0%, #7EB6E6 50%, #4682B4 100%)" },
      { name: "Bronze chaud", hex: "#CD7F32", gradient: "linear-gradient(135deg, #CD7F32 0%, #E6BE8A 50%, #CD7F32 100%)" },
      { name: "Platine", hex: "#E5E4E2", gradient: "linear-gradient(135deg, #E5E4E2 0%, #F7F7F7 50%, #E5E4E2 100%)" },
      { name: "Noir miroir", hex: "#000000", gradient: "linear-gradient(135deg, #000000 0%, #434343 50%, #000000 100%)" },
      { name: "Lavande chromée", hex: "#8A2BE2", gradient: "linear-gradient(135deg, #8A2BE2 0%, #A569BD 50%, #8A2BE2 100%)" },
    ]
  },
  {
    name: "Effet \"Jelly\" Translucide",
    emoji: "💎",
    colors: [
      { name: "Rose bonbon transparent", hex: "#FF69B4", gradient: "linear-gradient(135deg, #FF69B4AA 0%, #FF69B466 100%)" },
      { name: "Orange pêche", hex: "#FFCC99", gradient: "linear-gradient(135deg, #FFCC99AA 0%, #FFCC9966 100%)" },
      { name: "Bleu givré", hex: "#A0D2EB", gradient: "linear-gradient(135deg, #A0D2EBAA 0%, #A0D2EB66 100%)" },
      { name: "Lavande aquarelle", hex: "#D8BFD8", gradient: "linear-gradient(135deg, #D8BFD8AA 0%, #D8BFD866 100%)" },
      { name: "Vert lime jelly", hex: "#BFFF00", gradient: "linear-gradient(135deg, #BFFF00AA 0%, #BFFF0066 100%)" },
      { name: "Rouge cerise gloss", hex: "#D2042D", gradient: "linear-gradient(135deg, #D2042DAA 0%, #D2042D66 100%)" },
      { name: "Mauve bubblegum", hex: "#C8A2C8", gradient: "linear-gradient(135deg, #C8A2C8AA 0%, #C8A2C866 100%)" },
      { name: "Jaune melon", hex: "#FDFD96", gradient: "linear-gradient(135deg, #FDFD96AA 0%, #FDFD9666 100%)" },
      { name: "Litchi translucide", hex: "#FFE5B4", gradient: "linear-gradient(135deg, #FFE5B4AA 0%, #FFE5B466 100%)" },
      { name: "Abricot glossy", hex: "#FBCEB1", gradient: "linear-gradient(135deg, #FBCEB1AA 0%, #FBCEB166 100%)" },
    ]
  },
  {
    name: "Vibrantes & Vitaminées",
    emoji: "🌈",
    colors: [
      { name: "Jaune citron", hex: "#FFFF00" },
      { name: "Corail fluo", hex: "#FF6F61" },
      { name: "Bleu électrique", hex: "#1E90FF" },
      { name: "Vert kiwi", hex: "#39FF14" },
      { name: "Rose néon", hex: "#FF3399" },
      { name: "Orange punch", hex: "#FF8C00" },
      { name: "Fuchsia intense", hex: "#FF00FF" },
      { name: "Violet ultra", hex: "#8A2BE2" },
      { name: "Rouge paprika", hex: "#FF0000" },
      { name: "Aqua turquoise", hex: "#00FFFF" },
    ]
  },
  {
    name: "Earthy & Terracotta",
    emoji: "🔥",
    colors: [
      { name: "Brique brûlée", hex: "#A52A2A" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Ocre doré", hex: "#CC7722" },
      { name: "Olive matte", hex: "#556B2F" },
      { name: "Sable chaud", hex: "#D2B48C" },
      { name: "Brun argile", hex: "#8B4513" },
      { name: "Moutarde douce", hex: "#E1AD01" },
      { name: "Cannelle", hex: "#D2691E" },
      { name: "Nude terreux", hex: "#E6CCB2" },
      { name: "Cuivre rougi", hex: "#CB6D51" },
    ]
  },
  {
    name: "Blancs & Bleus Glaciaires",
    emoji: "🧊",
    colors: [
      { name: "Bleu glacier", hex: "#A5F2F3" },
      { name: "Blanc nacré", hex: "#FFFFFF", gradient: "linear-gradient(135deg, #FFFFFF 0%, #F0F8FF 50%, #FFFFFF 100%)" },
      { name: "Bleu polaire", hex: "#8CBED6" },
      { name: "Argent givré", hex: "#E8E8E8", gradient: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)" },
      { name: "Gris givré", hex: "#DCE2E6" },
      { name: "Ivoire bleuté", hex: "#F0FFFF" },
      { name: "Bleu opale", hex: "#B0E0E6" },
      { name: "Argent bleuté", hex: "#C0D5DE" },
      { name: "Blanc neige", hex: "#F5F5F5" },
      { name: "Bleu perlé", hex: "#7EC8E3" },
    ]
  },
  {
    name: "Teintes Mystiques & Magiques",
    emoji: "🧞‍♀️",
    colors: [
      { name: "Prune astral", hex: "#673147" },
      { name: "Indigo profond", hex: "#0A2463" },
      { name: "Noir pailleté", hex: "#000000", gradient: "linear-gradient(135deg, #000000 0%, #1B1B1B 50%, #000000 100%)" },
      { name: "Bordeaux irisé", hex: "#800020", gradient: "linear-gradient(135deg, #800020 0%, #A52A2A 50%, #800020 100%)" },
      { name: "Violet mystique", hex: "#551A8B" },
      { name: "Bleu nuit étoilée", hex: "#191970" },
      { name: "Vert émeraude foncé", hex: "#014421" },
      { name: "Mauve lunaire", hex: "#9B7CB9" },
      { name: "Charbon scintillant", hex: "#2C3539", gradient: "linear-gradient(135deg, #2C3539 0%, #424B54 50%, #2C3539 100%)" },
      { name: "Pourpre cosmique", hex: "#50203C" },
    ]
  },
  {
    name: "Sunset Vibes",
    emoji: "🏝️",
    colors: [
      { name: "Orange mandarine", hex: "#FF8C00" },
      { name: "Rose sunset", hex: "#FF7F50" },
      { name: "Fuchsia vibrant", hex: "#FF00FF" },
      { name: "Rouge coquelicot", hex: "#FF4500" },
      { name: "Jaune mango", hex: "#FFCC00" },
      { name: "Corail foncé", hex: "#FF6B6B" },
      { name: "Saumon doré", hex: "#FA8072" },
      { name: "Pêche chaude", hex: "#FFAC92" },
      { name: "Rose néon", hex: "#FF3399" },
      { name: "Rouge orangé", hex: "#FF4433" },
    ]
  },
  {
    name: "Sorbet Pop",
    emoji: "🍧",
    colors: [
      { name: "Framboise givrée", hex: "#FF6B88" },
      { name: "Citron vert", hex: "#CCFF00" },
      { name: "Pêche pastel", hex: "#FFCCBB" },
      { name: "Bleu curaçao", hex: "#1CA9C9" },
      { name: "Lavande sorbet", hex: "#DCBFFF" },
      { name: "Fraise sucrée", hex: "#FF5E85" },
      { name: "Menthe frappée", hex: "#98FB98" },
      { name: "Orange glace", hex: "#FF9966" },
      { name: "Litchi rose", hex: "#FFB3C6" },
      { name: "Ananas doux", hex: "#FADA5E" },
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
