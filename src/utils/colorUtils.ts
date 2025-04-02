
// Utility function to get a color name from a hex code
export const getColorNameFromHex = (hexColor: string): string => {
  // Complete color mapping from the NailColorSelector component
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
    
    // Dark & Deep
    '#000000': 'Noir',
    '#800020': 'Bordeaux',
    '#673147': 'Prune',
    '#7B3F00': 'Chocolat',
    '#046307': 'Émeraude',
    '#191970': 'Bleu nuit',
    '#3D0C02': 'Cerise noire',
    '#014421': 'Vert forêt',
    '#2C3539': 'Gris anthracite',
    '#551A8B': 'Violet cosmique',
    
    // Basic & Other colors
    '#FF0000': 'Rouge',
    '#FFA500': 'Orange',
    '#FFFF00': 'Jaune',
    '#00FF00': 'Vert',
    '#0000FF': 'Bleu',
    '#800080': 'Violet',
    '#FFD700': 'Doré',
    '#1E90FF': 'Bleu électrique',
    '#39FF14': 'Vert néon',
    '#0F52BA': 'Bleu saphir',
    '#FFFACD': 'Jaune beurre',
    '#8A9A5B': 'Vert mousse',
    '#0077BE': 'Bleu océan',
    '#8B0000': 'Rouge sang',
    '#808080': 'Gris cendré',
    '#A5F2F3': 'Bleu glacé',
    '#F0FFFF': 'Blanc givré',
    '#556B2F': 'Olive',
    '#CC7722': 'Ocre',
    '#C08081': 'Rose poussiéreux',
    '#4682B4': 'Bleu réfléchissant',
    '#8A2BE2': 'Ultraviolet',
    '#BFFF00': 'Vert lime'
  };
  
  // Return the color name if it exists in the map, otherwise return the hex code
  return colorMap[hexColor] || hexColor;
};
