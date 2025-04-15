
/**
 * Utility functions for handling prompt examples and text transformations
 */
import { Language } from '../locales/types';
import { Color } from './colorCategories';

// Original list of example prompts for backwards compatibility
export const examplePromptsBase = {
  fr: [
    "French Tips avec un dégradé de bleu",
    "Ombre Fade avec des accents dorés",
    "Effet Marble inspiré par un coucher de soleil",
    "Détails Glitter avec des motifs fleuris",
    "Finition Chrome avec des détails argentés",
    "Combo Mat et Brillant avec des motifs minimalistes",
    "Lignes Minimalistes en rose gold",
    "Art Negative Space avec des paillettes holographiques",
    "Motifs Floraux avec une touche métallique",
    "Animal Print avec des détails argentés",
    "Étoiles et Lune avec un effet galaxie",
    "Effet Tie-Dye avec des tons pastel",
    "Accents Gold Foil sur fond noir mat",
    "French Tips Marbrés avec une touche d'or",
    "Ongles Holographiques avec des reflets multicolores",
    "Art Abstrait inspiré par Kandinsky",
    "Effet Gouttes avec des couleurs contrastées",
    "Motif Damier en noir et blanc",
    "Glow Néon avec des effets phosphorescents",
    "Design Galaxie avec des paillettes étoilées"
  ],
  en: [
    "French Tips with blue gradient",
    "Ombre Fade with gold accents",
    "Marble Effect inspired by sunset",
    "Glitter Details with floral patterns",
    "Chrome Finish with silver details",
    "Matte and Glossy Combo with minimalist patterns",
    "Minimalist Lines in rose gold",
    "Negative Space Art with holographic glitter",
    "Floral Patterns with metallic touch",
    "Animal Print with silver details",
    "Stars and Moon with galaxy effect",
    "Tie-Dye Effect with pastel tones",
    "Gold Foil Accents on matte black",
    "Marble French Tips with gold touch",
    "Holographic Nails with multicolor reflections",
    "Abstract Art inspired by Kandinsky",
    "Dripping Effect with contrasting colors",
    "Checkerboard Pattern in black and white",
    "Neon Glow with phosphorescent effects",
    "Galaxy Design with star glitter"
  ]
};

// Original examples for backwards compatibility
export const examplePrompts = [
  "French Tips avec un dégradé de bleu",
  "Ombre Fade avec des accents dorés",
  "Marble Effect inspiré par un coucher de soleil",
  "Glitter Accent avec des motifs fleuris",
  "Chrome Finish avec des détails argentés",
  "Matte and Glossy Combo avec des motifs minimalistes",
  "Minimalist Lines en rose gold",
  "Negative Space Art avec des paillettes holographiques",
  "Floral Patterns avec une touche métallique",
  "Animal Print avec des détails argentés",
  "Stars and Moon avec un effet galaxie",
  "Tie-Dye Effect avec des tons pastel",
  "Gold Foil Accents sur fond noir mat",
  "Marble French Tips avec une touche d'or",
  "Holographic Nails avec des reflets multicolores",
  "Abstract Art inspiré par Kandinsky",
  "Dripping Paint Effect avec des couleurs contrastées",
  "Checkerboard Print en noir et blanc",
  "Neon Glow avec des effets phosphorescents",
  "Galaxy Design avec des paillettes étoilées",
  "Butterfly Wings avec des détails délicats",
  "Polka Dots en couleurs vives",
  "3D Embellishments avec des pierres précieuses",
  "Matte Black with Gold Accents pour un look élégant",
  "Mix & Match Designs pour un style unique",
  "Geometric Lines avec un dégradé de couleurs",
  "Color Block avec des frontières nettes",
  "Foil Stripes avec un effet métallique",
  "Crystal Embellishments pour une occasion spéciale",
  "Pearl Accents avec une finition nacre",
  "Watercolor Effect avec des couleurs qui se fondent",
  "Splatter Paint comme une toile d'artiste",
  "Flame Design avec des tons orangés et rouges",
  "Wave Patterns inspiré par l'océan",
  "Cartoon Art avec des personnages amusants",
  "Pastel Gradient du plus clair au plus foncé",
  "Candy Swirls avec des couleurs sucrées",
  "Smiley Faces pour un look joyeux",
  "Cloud Nails avec un effet aérien",
  "Textured Velvet avec un toucher doux",
  "Quartz Effect avec des reflets cristallins",
  "Metallic Drips comme du métal en fusion",
  "Neon French Tips pour un look moderne",
  "Tortoiseshell Print avec des tons ambrés",
  "Jelly Nails avec un effet transparent",
  "Sharp Edge Tips pour un look audacieux",
  "Aurora Borealis inspiré par les aurores boréales",
  "Floral Stamping avec des motifs détaillés",
  "Psychedelic Swirls aux couleurs vibrantes",
  "Minimalist Dots pour un style épuré",
  "Starburst Design avec un effet rayonnant",
  "Gemstone-Inspired aux couleurs de pierres précieuses",
  "Metallic Half-Moon avec un contraste élégant",
  "Holo Glitter Tips scintillants et changeants",
  "Abstract Splashes comme un tableau moderne",
  "Psychedelic Checkerboard multicolore",
  "Foil Marble avec des veines métalliques",
  "Edgy Negative Space pour un style contemporain",
  "Reverse French Manicure inversant les codes classiques",
  "Bold Outlined Nails avec des contours marqués",
  "Confetti Nails pour célébrer en style",
  "Pop Art Designs inspiré par Warhol",
  "Transparent Layers avec des superpositions",
  "Swirling Stripes en spirales colorées",
  "Lace Pattern délicat et élégant",
  "Snowflake Design pour un hiver féerique",
  "Mermaid Scales aux reflets irisés",
  "Pumpkin Spice Theme pour l'automne",
  "Spiderweb Accent pour Halloween",
  "Electric Lightning Bolts énergiques",
  "Holiday Ornament Nails festifs",
  "Cosmic Dust avec des paillettes stellaires",
  "Tropical Palm Leaves pour un style estival",
  "Multi-Texture Nails combinant différentes finitions",
  "Futuristic Cyberpunk Style audacieux",
  "Christmas Ornaments pour les fêtes",
  "Candy Cane Stripes rouge et blanc",
  "Reindeer Silhouettes pour Noël",
  "Santa Hat Tips festifs",
  "Christmas Tree Accents décorés",
  "Gingerbread Man Nails gourmands",
  "Festive Plaid aux motifs écossais",
  "Holly and Berries traditionnels",
  "Frosty Ice Effect glacé",
  "Easter Egg Patterns colorés",
  "Pastel Bunny Accents pour Pâques",
  "Floral Spring Blooms printaniers",
  "Speckled Egg Design moucheté",
  "Cute Chick Art jaune et adorable",
  "Valentine's Heart Tips romantiques",
  "Love Letter Accents avec des messages",
  "Red Roses Design passionné",
  "Cupid Arrow Details pour la Saint-Valentin",
  "Pink Ombre Love dégradé tendre",
  "Neon Summer Sunset éclatant",
  "Palm Tree Silhouettes tropicales",
  "Ocean Wave Accents bleu azur",
  "Tropical Fruit Prints exotiques",
  "Ice Cream Cone Nails gourmands",
  "Beach Sand Texture ensoleillée",
  "Autumn Leaves Gradient automnal",
  "Pumpkin Spice Swirls chaleureux",
  "Halloween Spiderwebs mystérieux",
  "Black Cat Accents porte-bonheur",
  "Spooky Ghost Nails pour Halloween",
  "Bat Silhouette Tips nocturnes",
  "Glow-in-the-Dark Halloween phosphorescent",
  "Thanksgiving Turkey Feathers festifs",
  "Cozy Sweater Knit Design hivernal",
  "Festive Fireworks éclatants",
  "Champagne Bubbles pétillants",
  "Birthday Confetti joyeux",
  "Galaxy New Year Theme cosmique",
  "Shamrock Green Tips porte-bonheur",
  "Rainbow Pride Stripes colorés",
  "Fourth of July Stars patriotiques",
  "Firework Explosions spectaculaires",
  "Mardi Gras Glitter festif",
  "Carnival Confetti multicolore",
  "Sunflower Fields ensoleillé",
  "Back to School Chalkboard nostalgique",
  "Graduation Cap Accents célébratoires",
  "Music Festival Tie-Dye vibrant"
];

/**
 * Color-specific prompt ideas organized by color name
 * Format: [French prompt, English prompt]
 */
export const colorSpecificPrompts: Record<string, [string, string][]> = {
  // Pastels Sophistiqués / Sophisticated Pastels
  "Smoky Lilac": [
    ["Relief brillant en lilas fumé", "Glossy relief in smoky lilac"],
    ["Esthétique nacrée en lilas fumé", "Pearly aesthetic in smoky lilac"],
    ["Effet glacé en lilas fumé", "Frosted effect in smoky lilac"],
    ["Graphisme ondulé en lilas fumé", "Wavy graphics in smoky lilac"],
    ["Style organique en lilas fumé", "Organic style in smoky lilac"]
  ],
  "Frosted Mint": [
    ["Voile abstrait en menthe givrée", "Abstract veil in frosted mint"],
    ["Effet mat en menthe givrée", "Matte effect in frosted mint"],
    ["Forme galactique en menthe givrée", "Galactic shape in frosted mint"],
    ["Texture dynamique en menthe givrée", "Dynamic texture in frosted mint"],
    ["Tracé dynamique en menthe givrée", "Dynamic lines in frosted mint"]
  ],
  "Powder Pink": [
    ["Nappe animalier en rose poudre", "Animal print in powder pink"],
    ["Effet brillant en rose poudre", "Glossy effect in powder pink"],
    ["Nappe abstrait en rose poudre", "Abstract overlay in powder pink"],
    ["Dessin oriental en rose poudre", "Oriental pattern in powder pink"],
    ["Effet fruité en rose poudre", "Fruity effect in powder pink"]
  ],
  "Greyed Blue": [
    ["Forme tribal en bleu grisé", "Tribal shape in greyed blue"],
    ["Texture bohème en bleu grisé", "Bohemian texture in greyed blue"],
    ["Silhouette pastel en bleu grisé", "Pastel silhouette in greyed blue"],
    ["Nappe gourmand en bleu grisé", "Gourmet overlay in greyed blue"],
    ["Texture irisée en bleu grisé", "Iridescent texture in greyed blue"]
  ],
  "Pale Yellow": [
    ["Tracé brillant en jaune pâle", "Glossy lines in pale yellow"],
    ["Nappe éthérée en jaune pâle", "Ethereal overlay in pale yellow"],
    ["Esthétique brillante en jaune pâle", "Glossy aesthetic in pale yellow"],
    ["Dégradé champêtre en jaune pâle", "Rustic gradient in pale yellow"],
    ["Dessin digital en jaune pâle", "Digital design in pale yellow"]
  ],
  "Soft Lavender": [
    ["Effet givré en lavande douce", "Frosted effect in soft lavender"],
    ["Texture gothique en lavande douce", "Gothic texture in soft lavender"],
    ["Voile galactique en lavande douce", "Galactic veil in soft lavender"],
    ["Forme pixelisée en lavande douce", "Pixelated shape in soft lavender"],
    ["Nappe aquatique en lavande douce", "Aquatic overlay in soft lavender"]
  ],
  "Pastel Coral": [
    ["Dessin mystique en corail pastel", "Mystical design in pastel coral"],
    ["Effet tropical en corail pastel", "Tropical effect in pastel coral"],
    ["Style tribal en corail pastel", "Tribal style in pastel coral"],
    ["Texture linéaire en corail pastel", "Linear texture in pastel coral"],
    ["Finition ondulée en corail pastel", "Wavy finish in pastel coral"]
  ],
  "Light Pistachio": [
    ["Voile pixelisé en pistache claire", "Pixelated veil in light pistachio"],
    ["Style scandinave en pistache claire", "Scandinavian style in light pistachio"],
    ["Finition irisée en pistache claire", "Iridescent finish in light pistachio"],
    ["Texture holographique en pistache claire", "Holographic texture in light pistachio"],
    ["Dégradé givré en pistache claire", "Frosted gradient in light pistachio"]
  ],
  "Pearl Grey": [
    ["Motif lunaire en gris perle", "Lunar pattern in pearl grey"],
    ["Finition perlée en gris perle", "Pearly finish in pearl grey"],
    ["Esthétique calligraphiée en gris perle", "Calligraphic aesthetic in pearl grey"],
    ["Voile champêtre en gris perle", "Rustic veil in pearl grey"],
    ["Dégradé poétique en gris perle", "Poetic gradient in pearl grey"]
  ],
  "Soft Vanilla": [
    ["Effet poudré en vanille douce", "Powdered effect in soft vanilla"],
    ["Tracé cosmique en vanille douce", "Cosmic lines in soft vanilla"],
    ["Silhouette fruitée en vanille douce", "Fruity silhouette in soft vanilla"],
    ["Nappe givrée en vanille douce", "Frosted overlay in soft vanilla"],
    ["Style bohème en vanille douce", "Bohemian style in soft vanilla"]
  ],

  // Neutres Minimalistes / Minimalist Neutrals
  "Latte Beige": [
    ["Dessin gothique en beige latte", "Gothic design in latte beige"],
    ["Effet digital en beige latte", "Digital effect in latte beige"],
    ["Texture animalier en beige latte", "Animal texture in latte beige"],
    ["Dégradé pastel en beige latte", "Pastel gradient in latte beige"],
    ["Style néon en beige latte", "Neon style in latte beige"]
  ],
  "Cool Taupe": [
    ["Voile vintage en taupe froid", "Vintage veil in cool taupe"],
    ["Style poétique en taupe froid", "Poetic style in cool taupe"],
    ["Motif tropical en taupe froid", "Tropical pattern in cool taupe"],
    ["Nappe mat en taupe froid", "Matte overlay in cool taupe"],
    ["Esthétique cosmique en taupe froid", "Cosmic aesthetic in cool taupe"]
  ],
  "Stone Grey": [
    ["Relief floral en gris pierre", "Floral relief in stone grey"],
    ["Tracé aquatique en gris pierre", "Aquatic lines in stone grey"],
    ["Finition lunaire en gris pierre", "Lunar finish in stone grey"],
    ["Forme dynamique en gris pierre", "Dynamic shape in stone grey"],
    ["Graphisme givré en gris pierre", "Frosted graphics in stone grey"]
  ],
  "Cappuccino Brown": [
    ["Texture glacée en brun cappuccino", "Frosted texture in cappuccino brown"],
    ["Dégradé pixelisé en brun cappuccino", "Pixelated gradient in cappuccino brown"],
    ["Effet linéaire en brun cappuccino", "Linear effect in cappuccino brown"],
    ["Finition calligraphiée en brun cappuccino", "Calligraphic finish in cappuccino brown"],
    ["Esthétique gothique en brun cappuccino", "Gothic aesthetic in cappuccino brown"]
  ],
  "Nude Cream": [
    ["Dessin digital en crème nude", "Digital design in nude cream"],
    ["Forme pastel en crème nude", "Pastel shape in nude cream"],
    ["Voile galactique en crème nude", "Galactic veil in nude cream"],
    ["Nappe néon en crème nude", "Neon overlay in nude cream"],
    ["Graphisme tribal en crème nude", "Tribal graphics in nude cream"]
  ],

  // Chromes & Metallics
  "Liquid Silver": [
    ["Style givré en argent liquide", "Frosted style in liquid silver"],
    ["Tracé brillant en argent liquide", "Glossy lines in liquid silver"],
    ["Nappe lunaire en argent liquide", "Lunar overlay in liquid silver"],
    ["Texture tropicale en argent liquide", "Tropical texture in liquid silver"],
    ["Finition digitale en argent liquide", "Digital finish in liquid silver"]
  ],
  "Rose Gold": [
    ["Motif tribal en or rose", "Tribal pattern in rose gold"],
    ["Esthétique aquatique en or rose", "Aquatic aesthetic in rose gold"],
    ["Voile pixelisé en or rose", "Pixelated veil in rose gold"],
    ["Effet holographique en or rose", "Holographic effect in rose gold"],
    ["Dégradé mystique en or rose", "Mystical gradient in rose gold"]
  ],
  "Holographic Chrome": [
    ["Graphisme galactique en chrome holographique", "Galactic graphics in holographic chrome"],
    ["Forme néon en chrome holographique", "Neon shape in holographic chrome"],
    ["Texture poétique en chrome holographique", "Poetic texture in holographic chrome"],
    ["Relief digital en chrome holographique", "Digital relief in holographic chrome"],
    ["Style pastel en chrome holographique", "Pastel style in holographic chrome"]
  ],
  "Beetle Green": [
    ["Dessin gothique en vert scarabée", "Gothic design in beetle green"],
    ["Nappe givrée en vert scarabée", "Frosted overlay in beetle green"],
    ["Effet cosmique en vert scarabée", "Cosmic effect in beetle green"],
    ["Tracé bohème en vert scarabée", "Bohemian lines in beetle green"],
    ["Voile organique en vert scarabée", "Organic veil in beetle green"]
  ],
  "Metallic Copper": [
    ["Texture champêtre en cuivre métallique", "Rustic texture in metallic copper"],
    ["Dégradé pixelisé en cuivre métallique", "Pixelated gradient in metallic copper"],
    ["Style lunaire en cuivre métallique", "Lunar style in metallic copper"],
    ["Esthétique tribale en cuivre métallique", "Tribal aesthetic in metallic copper"],
    ["Motif ondulé en cuivre métallique", "Wavy pattern in metallic copper"]
  ]
};

/**
 * Gets a random selection of example prompts
 */
export const getRandomExamples = (count = 8, language: Language = 'fr'): string[] => {
  const promptsToUse = examplePromptsBase[language] || examplePromptsBase.en;
  const shuffled = [...promptsToUse].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get prompts specific to a color
 * @param colorName The name of the color
 * @param language The current language
 * @returns Array of prompts for the color, or random prompts if none exist for the color
 */
export const getColorSpecificPrompts = (colorName: string, language: Language = 'fr'): string[] => {
  const colorPrompts = colorSpecificPrompts[colorName];
  
  if (colorPrompts && colorPrompts.length > 0) {
    // Return the appropriate language version (0 for French, 1 for English)
    const langIndex = language === 'fr' ? 0 : 1;
    return colorPrompts.map(promptPair => promptPair[langIndex]);
  }
  
  // Fallback to random examples if no specific prompts for this color
  return getRandomExamples(5, language);
};

/**
 * Extracts the main concept from a full example prompt
 * and ensures it's not too long for display
 */
export const extractMainConcept = (example: string): string => {
  // Extract the main concept before any descriptors
  const mainConcept = example.split(" avec ")[0].split(" en ")[0].split(" inspiré")[0].split(" with ")[0].split(" inspired")[0].split(" in ")[0];
  return mainConcept;
};
