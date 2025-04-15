/**
 * Utility functions for handling prompt examples and text transformations
 */
import { Language } from '../locales/types';

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
    ["Relief brillant", "Glossy relief"],
    ["Esthétique nacrée", "Pearly aesthetic"],
    ["Effet glacé", "Frosted effect"],
    ["Graphisme ondulé", "Wavy graphics"],
    ["Style organique", "Organic style"]
  ],
  "Frosted Mint": [
    ["Voile abstrait", "Abstract veil"],
    ["Effet mat", "Matte effect"],
    ["Forme galactique", "Galactic shape"],
    ["Texture dynamique", "Dynamic texture"],
    ["Tracé dynamique", "Dynamic lines"]
  ],
  "Powder Pink": [
    ["Nappe animalier", "Animal print"],
    ["Effet brillant", "Glossy effect"],
    ["Nappe abstrait", "Abstract overlay"],
    ["Dessin oriental", "Oriental pattern"],
    ["Effet fruité", "Fruity effect"]
  ],
  "Greyed Blue": [
    ["Forme tribal", "Tribal shape"],
    ["Texture bohème", "Bohemian texture"],
    ["Silhouette pastel", "Pastel silhouette"],
    ["Nappe gourmand", "Gourmet overlay"],
    ["Texture irisée", "Iridescent texture"]
  ],
  "Pale Yellow": [
    ["Tracé brillant", "Glossy lines"],
    ["Nappe éthérée", "Ethereal overlay"],
    ["Esthétique brillante", "Glossy aesthetic"],
    ["Dégradé champêtre", "Rustic gradient"],
    ["Dessin digital", "Digital design"]
  ],
  "Soft Lavender": [
    ["Effet givré", "Frosted effect"],
    ["Texture gothique", "Gothic texture"],
    ["Voile galactique", "Galactic veil"],
    ["Forme pixelisée", "Pixelated shape"],
    ["Nappe aquatique", "Aquatic overlay"]
  ],
  "Pastel Coral": [
    ["Dessin mystique", "Mystical design"],
    ["Effet tropical", "Tropical effect"],
    ["Style tribal", "Tribal style"],
    ["Texture linéaire", "Linear texture"],
    ["Finition ondulée", "Wavy finish"]
  ],
  "Light Pistachio": [
    ["Voile pixelisé", "Pixelated veil"],
    ["Style scandinave", "Scandinavian style"],
    ["Finition irisée", "Iridescent finish"],
    ["Texture holographique", "Holographic texture"],
    ["Dégradé givré", "Frosted gradient"]
  ],
  "Pearl Grey": [
    ["Motif lunaire", "Lunar pattern"],
    ["Finition perlée", "Pearly finish"],
    ["Esthétique calligraphiée", "Calligraphic aesthetic"],
    ["Voile champêtre", "Rustic veil"],
    ["Dégradé poétique", "Poetic gradient"]
  ],
  "Soft Vanilla": [
    ["Effet poudré", "Powdered effect"],
    ["Tracé cosmique", "Cosmic lines"],
    ["Silhouette fruitée", "Fruity silhouette"],
    ["Nappe givrée", "Frosted overlay"],
    ["Style bohème", "Bohemian style"]
  ],

  // Neutres Minimalistes / Minimalist Neutrals
  "Latte Beige": [
    ["Dessin gothique", "Gothic design"],
    ["Effet digital", "Digital effect"],
    ["Texture animalier", "Animal texture"],
    ["Dégradé pastel", "Pastel gradient"],
    ["Style néon", "Neon style"]
  ],
  "Cool Taupe": [
    ["Voile vintage", "Vintage veil"],
    ["Style poétique", "Poetic style"],
    ["Motif tropical", "Tropical pattern"],
    ["Nappe mat", "Matte overlay"],
    ["Esthétique cosmique", "Cosmic aesthetic"]
  ],
  "Stone Grey": [
    ["Relief floral", "Floral relief"],
    ["Tracé aquatique", "Aquatic lines"],
    ["Finition lunaire", "Lunar finish"],
    ["Forme dynamique", "Dynamic shape"],
    ["Graphisme givré", "Frosted graphics"]
  ],
  "Cappuccino Brown": [
    ["Texture glacée", "Frosted texture"],
    ["Dégradé pixelisé", "Pixelated gradient"],
    ["Effet linéaire", "Linear effect"],
    ["Finition calligraphiée", "Calligraphic finish"],
    ["Esthétique gothique", "Gothic aesthetic"]
  ],
  "Nude Cream": [
    ["Dessin digital", "Digital design"],
    ["Forme pastel", "Pastel shape"],
    ["Voile galactique", "Galactic veil"],
    ["Nappe néon", "Neon overlay"],
    ["Graphisme tribal", "Tribal graphics"]
  ],

  // Chromes & Metallics
  "Liquid Silver": [
    ["Style givré", "Frosted style"],
    ["Tracé brillant", "Glossy lines"],
    ["Nappe lunaire", "Lunar overlay"],
    ["Texture tropicale", "Tropical texture"],
    ["Finition digitale", "Digital finish"]
  ],
  "Rose Gold": [
    ["Motif tribal", "Tribal pattern"],
    ["Esthétique aquatique", "Aquatic aesthetic"],
    ["Voile pixelisé", "Pixelated veil"],
    ["Effet holographique", "Holographic effect"],
    ["Dégradé mystique", "Mystical gradient"]
  ],
  "Holographic Chrome": [
    ["Graphisme galactique", "Galactic graphics"],
    ["Forme néon", "Neon shape"],
    ["Texture poétique", "Poetic texture"],
    ["Relief digital", "Digital relief"],
    ["Style pastel", "Pastel style"]
  ],
  "Beetle Green": [
    ["Dessin gothique", "Gothic design"],
    ["Nappe givrée", "Frosted overlay"],
    ["Effet cosmique", "Cosmic effect"],
    ["Tracé bohème", "Bohemian lines"],
    ["Voile organique", "Organic veil"]
  ],
  "Metallic Copper": [
    ["Texture champêtre", "Rustic texture"],
    ["Dégradé pixelisé", "Pixelated gradient"],
    ["Style lunaire", "Lunar style"],
    ["Esthétique tribale", "Tribal aesthetic"],
    ["Motif ondulé", "Wavy pattern"]
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
