
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
  "Warm Sand Color": [
    ["Motif bohème", "Bohemian pattern"],
    ["Effet vaporeux", "Misty effect"],
    ["Tracé ondulé", "Wavy lines"],
    ["Dégradé fruité", "Fruity gradient"],
    ["Nappe cosmique", "Cosmic overlay"]
  ],
  "Matte Ivory": [
    ["Style holographique", "Holographic style"],
    ["Texture givré", "Frosted texture"],
    ["Effet champêtre", "Rustic effect"],
    ["Finition mystique", "Mystical finish"],
    ["Motif floral", "Floral pattern"]
  ],
  "Mocha Brown": [
    ["Voile lunaire", "Lunar veil"],
    ["Dessin pixelisé", "Pixelated design"],
    ["Graphisme psyché", "Psychedelic graphics"],
    ["Esthétique animalier", "Animal aesthetic"],
    ["Dégradé bohème", "Bohemian gradient"]
  ],
  "Rosy Nude": [
    ["Tracé gourmand", "Gourmet lines"],
    ["Finition pastel", "Pastel finish"],
    ["Texture digitale", "Digital texture"],
    ["Style vintage", "Vintage style"],
    ["Motif abstrait", "Abstract pattern"]
  ],
  "Café au Lait": [
    ["Relief tropical", "Tropical relief"],
    ["Graphisme gothique", "Gothic graphics"],
    ["Motif pixelisé", "Pixelated pattern"],
    ["Effet aquatique", "Aquatic effect"],
    ["Style glacé", "Frosted style"]
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
  ],
  "Steel Blue": [
    ["Voile abstrait", "Abstract veil"],
    ["Finition fruitée", "Fruity finish"],
    ["Graphisme linéaire", "Linear graphics"],
    ["Nappe vintage", "Vintage overlay"],
    ["Effet perlé", "Pearly effect"]
  ],
  "Warm Bronze": [
    ["Dessin surréaliste", "Surrealist design"],
    ["Style calligraphié", "Calligraphic style"],
    ["Relief digital", "Digital relief"],
    ["Texture givré", "Frosted texture"],
    ["Dégradé aquatique", "Aquatic gradient"]
  ],
  "Platinum": [
    ["Esthétique lunaire", "Lunar aesthetic"],
    ["Tracé tribal", "Tribal lines"],
    ["Voile glacé", "Icy veil"],
    ["Finition pastel", "Pastel finish"],
    ["Graphisme holographique", "Holographic graphics"]
  ],
  "Mirror Black": [
    ["Motif vaporeux", "Misty pattern"],
    ["Dégradé floral", "Floral gradient"],
    ["Forme gothique", "Gothic shape"],
    ["Effet oriental", "Oriental effect"],
    ["Texture glacée", "Icy texture"]
  ],
  "Chrome Lavender": [
    ["Style dynamisé", "Dynamic style"],
    ["Tracé floral", "Floral lines"],
    ["Nappe abstraite", "Abstract overlay"],
    ["Esthétique givrée", "Frosted aesthetic"],
    ["Motif psyché", "Psychedelic pattern"]
  ],

  // Translucent "Jelly" Effect
  "Transparent Candy Pink": [
    ["Texture fruitée", "Fruity texture"],
    ["Effet aquatique", "Aquatic effect"],
    ["Nappe irisée", "Iridescent overlay"],
    ["Style pastel", "Pastel style"],
    ["Tracé cosmique", "Cosmic lines"]
  ],
  "Peach Orange": [
    ["Dégradé givré", "Frosted gradient"],
    ["Graphisme bohème", "Bohemian graphics"],
    ["Motif pixelisé", "Pixelated pattern"],
    ["Voile vintage", "Vintage veil"],
    ["Finition digitale", "Digital finish"]
  ],
  "Frosted Blue": [
    ["Dessin lunaire", "Lunar design"],
    ["Forme holographique", "Holographic shape"],
    ["Esthétique champêtre", "Rustic aesthetic"],
    ["Texture tropicale", "Tropical texture"],
    ["Style surréaliste", "Surrealist style"]
  ],
  "Watercolor Lavender": [
    ["Motif abstrait", "Abstract pattern"],
    ["Tracé tribal", "Tribal lines"],
    ["Nappe brillante", "Glossy overlay"],
    ["Dégradé mystique", "Mystical gradient"],
    ["Effet floral", "Floral effect"]
  ],
  "Lime Jelly": [
    ["Voile gothique", "Gothic veil"],
    ["Esthétique givrée", "Frosted aesthetic"],
    ["Style poétique", "Poetic style"],
    ["Texture linéaire", "Linear texture"],
    ["Graphisme néon", "Neon graphics"]
  ],
  "Cherry Gloss Red": [
    ["Finition cosmique", "Cosmic finish"],
    ["Motif oriental", "Oriental pattern"],
    ["Nappe aquatique", "Aquatic overlay"],
    ["Forme fruitée", "Fruity shape"],
    ["Tracé ondulé", "Wavy lines"]
  ],
  "Bubblegum Mauve": [
    ["Dégradé calligraphié", "Calligraphic gradient"],
    ["Relief pastel", "Pastel relief"],
    ["Effet digital", "Digital effect"],
    ["Texture pixelisée", "Pixelated texture"],
    ["Style vintage", "Vintage style"]
  ],
  "Melon Yellow": [
    ["Esthétique tribale", "Tribal aesthetic"],
    ["Motif givré", "Frosted pattern"],
    ["Nappe galactique", "Galactic overlay"],
    ["Forme dynamique", "Dynamic shape"],
    ["Finition brillante", "Glossy finish"]
  ],
  "Translucent Lychee": [
    ["Voile aquatique", "Aquatic veil"],
    ["Tracé floral", "Floral lines"],
    ["Graphisme holographique", "Holographic graphics"],
    ["Dégradé lunaire", "Lunar gradient"],
    ["Texture perlé", "Pearly texture"]
  ],
  "Glossy Apricot": [
    ["Effet fruité", "Fruity effect"],
    ["Style gothique", "Gothic style"],
    ["Nappe vaporeuse", "Misty overlay"],
    ["Forme abstraite", "Abstract shape"],
    ["Dessin galactique", "Galactic design"]
  ],

  // Vibrant & Vitamin-Rich
  "Lemon Yellow": [
    ["Finition givrée", "Frosted finish"],
    ["Esthétique dynamique", "Dynamic aesthetic"],
    ["Motif pastel", "Pastel pattern"],
    ["Dégradé fruité", "Fruity gradient"],
    ["Graphisme tribal", "Tribal graphics"]
  ],
  "Neon Coral": [
    ["Texture aquatique", "Aquatic texture"],
    ["Tracé lunaire", "Lunar lines"],
    ["Style cosmique", "Cosmic style"],
    ["Voile pixelisé", "Pixelated veil"],
    ["Forme tropicale", "Tropical shape"]
  ],
  "Electric Blue": [
    ["Nappe bohème", "Bohemian overlay"],
    ["Effet néon", "Neon effect"],
    ["Esthétique tribale", "Tribal aesthetic"],
    ["Relief digital", "Digital relief"],
    ["Dégradé holographique", "Holographic gradient"]
  ],
  "Kiwi Green": [
    ["Motif calligraphié", "Calligraphic pattern"],
    ["Finition abstraite", "Abstract finish"],
    ["Voile glacé", "Icy veil"],
    ["Texture pastel", "Pastel texture"],
    ["Forme pixelisée", "Pixelated shape"]
  ],
  "Hot Pink": [
    ["Dégradé gothique", "Gothic gradient"],
    ["Tracé tribal", "Tribal lines"],
    ["Style fruité", "Fruity style"],
    ["Nappe givrée", "Frosted overlay"],
    ["Effet linéaire", "Linear effect"]
  ],
  "Orange Punch": [
    ["Graphisme poétique", "Poetic graphics"],
    ["Texture digitale", "Digital texture"],
    ["Motif aquatique", "Aquatic pattern"],
    ["Voile tribal", "Tribal veil"],
    ["Esthétique givrée", "Frosted aesthetic"]
  ],
  "Intense Fuchsia": [
    ["Style holographique", "Holographic style"],
    ["Tracé vaporeux", "Misty lines"],
    ["Finition lunaire", "Lunar finish"],
    ["Dégradé abstrait", "Abstract gradient"],
    ["Relief pastel", "Pastel relief"]
  ],
  "Ultra Violet": [
    ["Voile organique", "Organic veil"],
    ["Motif champêtre", "Rustic pattern"],
    ["Graphisme digital", "Digital graphics"],
    ["Esthétique tropicale", "Tropical aesthetic"],
    ["Texture gothique", "Gothic texture"]
  ],
  "Paprika Red": [
    ["Dégradé galactique", "Galactic gradient"],
    ["Nappe pixelisée", "Pixelated overlay"],
    ["Forme tribal", "Tribal shape"],
    ["Finition pastel", "Pastel finish"],
    ["Style gothique", "Gothic style"]
  ],
  "Turquoise Aqua": [
    ["Motif floral", "Floral pattern"],
    ["Esthétique néon", "Neon aesthetic"],
    ["Tracé givré", "Frosted lines"],
    ["Voile dynamique", "Dynamic veil"],
    ["Texture holographique", "Holographic texture"]
  ],
  
  // Earthy & Terracotta
  "Burnt Brick": [
    ["Texture terracotta", "Terracotta texture"],
    ["Finition brute", "Raw finish"],
    ["Voile tribal", "Tribal veil"],
    ["Graphisme ocre", "Ochre graphics"],
    ["Motif naturel", "Natural pattern"]
  ],
  "Terracotta Clay": [
    ["Dégradé sable", "Sand gradient"],
    ["Esthétique chaleureuse", "Warm aesthetic"],
    ["Tracé rustique", "Rustic lines"],
    ["Forme minérale", "Mineral shape"],
    ["Effet mat", "Matte effect"]
  ],
  "Golden Ochre": [
    ["Style ensoleillé", "Sunny style"],
    ["Relief argile", "Clay relief"],
    ["Nappe dorée", "Golden overlay"],
    ["Dessin ethnique", "Ethnic design"],
    ["Finition veloutée", "Velvety finish"]
  ],
  "Matte Olive": [
    ["Motif désertique", "Desert pattern"],
    ["Texture douce", "Soft texture"],
    ["Voile feuille", "Leaf veil"],
    ["Dégradé kaki", "Khaki gradient"],
    ["Tracé organique", "Organic lines"]
  ],
  "Desert Sand": [
    ["Graphisme en spirale", "Spiral graphics"],
    ["Esthétique minérale", "Mineral aesthetic"],
    ["Nappe nude", "Nude overlay"],
    ["Forme rocailleuse", "Rocky shape"],
    ["Effet sec", "Dry effect"]
  ],
  "Clay Brown": [
    ["Finition brute", "Raw finish"],
    ["Voile charbon", "Charcoal veil"],
    ["Tracé pierre", "Stone lines"],
    ["Dégradé profond", "Deep gradient"],
    ["Motif texturé", "Textured pattern"]
  ],
  "Soft Mustard": [
    ["Effet lumineux", "Luminous effect"],
    ["Graphisme mat", "Matte graphics"],
    ["Texture végétale", "Plant texture"],
    ["Style rétro", "Retro style"],
    ["Nappe ocre", "Ochre overlay"]
  ],
  "Cinnamon": [
    ["Voile toasté", "Toasted veil"],
    ["Motif boisé", "Woody pattern"],
    ["Tracé chaud", "Warm lines"],
    ["Esthétique racine", "Root aesthetic"],
    ["Dégradé épicé", "Spicy gradient"]
  ],
  "Earthy Nude": [
    ["Finition satinée", "Satin finish"],
    ["Texture beige", "Beige texture"],
    ["Dessin naturel", "Natural design"],
    ["Style brut", "Raw style"],
    ["Voile poudré", "Powdered veil"]
  ],
  "Reddish Copper": [
    ["Dégradé volcanique", "Volcanic gradient"],
    ["Motif intense", "Intense pattern"],
    ["Graphisme terreux", "Earthy graphics"],
    ["Tracé incandescent", "Incandescent lines"],
    ["Effet sculpté", "Sculpted effect"]
  ],
  
  // Icy Whites & Blues
  "Glacier Blue": [
    ["Dégradé polaire", "Polar gradient"],
    ["Texture givrée", "Frosted texture"],
    ["Finition cristalline", "Crystalline finish"],
    ["Voile arctique", "Arctic veil"],
    ["Graphisme gelé", "Frozen graphics"]
  ],
  "Pearly White": [
    ["Motif opale", "Opal pattern"],
    ["Esthétique douce", "Soft aesthetic"],
    ["Tracé perlé", "Pearly lines"],
    ["Voile laiteux", "Milky veil"],
    ["Style angélique", "Angelic style"]
  ],
  "Polar Blue": [
    ["Finition bleutée", "Bluish finish"],
    ["Graphisme iceberg", "Iceberg graphics"],
    ["Dégradé brumeux", "Misty gradient"],
    ["Texture arctique", "Arctic texture"],
    ["Voile métallique", "Metallic veil"]
  ],
  "Frosted Silver": [
    ["Style miroir", "Mirror style"],
    ["Effet miroir", "Mirror effect"],
    ["Forme givrée", "Frosted shape"],
    ["Voile lunaire", "Lunar veil"],
    ["Nappe brillante", "Glossy overlay"]
  ],
  "Frosted Grey": [
    ["Esthétique cristaux", "Crystal aesthetic"],
    ["Dégradé brume", "Mist gradient"],
    ["Motif neigeux", "Snowy pattern"],
    ["Texture minérale", "Mineral texture"],
    ["Tracé nuageux", "Cloudy lines"]
  ],
  "Bluish Ivory": [
    ["Graphisme glacé", "Icy graphics"],
    ["Finition satin", "Satin finish"],
    ["Voile fumé", "Smoky veil"],
    ["Motif silence", "Silence pattern"],
    ["Dégradé doux", "Soft gradient"]
  ],
  "Opal Blue": [
    ["Texture opaline", "Opaline texture"],
    ["Esthétique limpide", "Clear aesthetic"],
    ["Tracé lustré", "Glossy lines"],
    ["Voile nuancé", "Nuanced veil"],
    ["Dégradé céleste", "Celestial gradient"]
  ],
  "Bluish Silver": [
    ["Style arctique", "Arctic style"],
    ["Graphisme métallisé", "Metallic graphics"],
    ["Nappe givrée", "Frosted overlay"],
    ["Voile froid", "Cold veil"],
    ["Tracé argenté", "Silver lines"]
  ],
  "Snow White": [
    ["Dégradé pur", "Pure gradient"],
    ["Texture flocon", "Snowflake texture"],
    ["Voile nacré", "Pearly veil"],
    ["Motif givré", "Frosted pattern"],
    ["Style immaculé", "Immaculate style"]
  ],
  "Pearly Blue": [
    ["Effet perle", "Pearl effect"],
    ["Nappe arctique", "Arctic overlay"],
    ["Voile translucide", "Translucent veil"],
    ["Dégradé givré", "Frosted gradient"],
    ["Motif miroir", "Mirror pattern"]
  ],
  
  // Mystical & Magical Hues
  "Astral Plum": [
    ["Motif ésotérique", "Esoteric pattern"],
    ["Texture mystique", "Mystical texture"],
    ["Voile céleste", "Celestial veil"],
    ["Tracé profond", "Deep lines"],
    ["Esthétique galactique", "Galactic aesthetic"]
  ],
  "Deep Indigo": [
    ["Dégradé astral", "Astral gradient"],
    ["Style nébuleux", "Nebulous style"],
    ["Forme symbolique", "Symbolic shape"],
    ["Nappe sombre", "Dark overlay"],
    ["Finition cosmique", "Cosmic finish"]
  ],
  "Glittery Black": [
    ["Voile nuit", "Night veil"],
    ["Effet stellaire", "Stellar effect"],
    ["Graphisme intersidéral", "Interstellar graphics"],
    ["Tracé lunaire", "Lunar lines"],
    ["Texture brillante", "Glossy texture"]
  ],
  "Iridescent Burgundy": [
    ["Esthétique vamp", "Vamp aesthetic"],
    ["Dégradé ensorcelé", "Enchanted gradient"],
    ["Voile rougeoyant", "Glowing veil"],
    ["Motif antique", "Antique pattern"],
    ["Finition obscure", "Dark finish"]
  ],
  "Mystic Violet": [
    ["Tracé sacré", "Sacred lines"],
    ["Style astral", "Astral style"],
    ["Nappe occulte", "Occult overlay"],
    ["Motif astral", "Astral pattern"],
    ["Dégradé sombre", "Dark gradient"]
  ],
  "Starry Night Blue": [
    ["Voile galaxie", "Galaxy veil"],
    ["Finition céleste", "Celestial finish"],
    ["Motif constellation", "Constellation pattern"],
    ["Tracé galactique", "Galactic lines"],
    ["Esthétique onirique", "Dreamlike aesthetic"]
  ],
  "Dark Emerald Green": [
    ["Texture pierre précieuse", "Gemstone texture"],
    ["Nappe dense", "Dense overlay"],
    ["Style magique", "Magical style"],
    ["Motif forêt", "Forest pattern"],
    ["Dégradé jade", "Jade gradient"]
  ],
  "Lunar Mauve": [
    ["Effet astral", "Astral effect"],
    ["Voile magique", "Magical veil"],
    ["Tracé flottant", "Floating lines"],
    ["Dégradé vaporeux", "Misty gradient"],
    ["Style féérique", "Fairy-like style"]
  ],
  "Sparkling Charcoal": [
    ["Texture cendrée", "Ashy texture"],
    ["Finition brillante", "Glossy finish"],
    ["Voile obscure", "Dark veil"],
    ["Graphisme intense", "Intense graphics"],
    ["Motif métallique", "Metallic pattern"]
  ],
  "Cosmic Purple": [
    ["Motif intergalactique", "Intergalactic pattern"],
    ["Dégradé lumineux", "Luminous gradient"],
    ["Voile violet", "Purple veil"],
    ["Tracé flamboyant", "Flamboyant lines"],
    ["Esthétique divine", "Divine aesthetic"]
  ],
  
  // Sunset Vibes
  "Mandarin Orange": [
    ["Dégradé solaire", "Solar gradient"],
    ["Voile orangé", "Orange veil"],
    ["Texture chaleur", "Heat texture"],
    ["Graphisme vibrant", "Vibrant graphics"],
    ["Motif flare", "Flare pattern"]
  ],
  "Sunset Pink": [
    ["Tracé déclinant", "Declining lines"],
    ["Esthétique coucher de soleil", "Sunset aesthetic"],
    ["Voile saumoné", "Salmon veil"],
    ["Finition douce", "Soft finish"],
    ["Motif rayon", "Ray pattern"]
  ],
  "Vibrant Fuchsia": [
    ["Graphisme néon", "Neon graphics"],
    ["Voile intense", "Intense veil"],
    ["Dégradé flamboyant", "Flamboyant gradient"],
    ["Motif chaud", "Hot pattern"],
    ["Texture punchy", "Punchy texture"]
  ],
  "Poppy Red": [
    ["Motif floral", "Floral pattern"],
    ["Esthétique été", "Summer aesthetic"],
    ["Voile coquelicot", "Poppy veil"],
    ["Finition chaleureuse", "Warm finish"],
    ["Tracé vif", "Vivid lines"]
  ],
  "Mango Yellow": [
    ["Dégradé fruité", "Fruity gradient"],
    ["Texture douce", "Soft texture"],
    ["Voile vitaminé", "Vitamin-rich veil"],
    ["Motif soleil", "Sun pattern"],
    ["Graphisme exotique", "Exotic graphics"]
  ],
  "Dark Coral": [
    ["Finition feu", "Fire finish"],
    ["Tracé couchant", "Sunset lines"],
    ["Voile brûlé", "Burnt veil"],
    ["Dégradé vif", "Vivid gradient"],
    ["Style incandescent", "Incandescent style"]
  ],
  "Golden Salmon": [
    ["Texture dorée", "Golden texture"],
    ["Esthétique sunset", "Sunset aesthetic"],
    ["Nappe douce", "Soft overlay"],
    ["Motif chaleur", "Heat pattern"],
    ["Voile lumineux", "Luminous veil"]
  ],
  "Warm Peach": [
    ["Dégradé pastel chaud", "Warm pastel gradient"],
    ["Voile pêche", "Peach veil"],
    ["Finition légère", "Light finish"],
    ["Graphisme estival", "Summer graphics"],
    ["Motif nuancé", "Nuanced pattern"]
  ],
  "Neon Shock Pink": [
    ["Voile électrique", "Electric veil"],
    ["Texture flashy", "Flashy texture"],
    ["Esthétique pop", "Pop aesthetic"],
    ["Motif glow", "Glow pattern"],
    ["Dégradé acide", "Acidic gradient"]
  ],
  "Orangey Red": [
    ["Finition ardente", "Ardent finish"],
    ["Voile crépusculaire", "Twilight veil"],
    ["Dégradé sunset", "Sunset gradient"],
    ["Motif solaire", "Solar pattern"],
    ["Tracé intense", "Intense lines"]
  ],
  
  // Sorbet Pop
  "Frosted Raspberry": [
    ["Voile acidulé", "Tangy veil"],
    ["Texture fraîche", "Fresh texture"],
    ["Graphisme fruité", "Fruity graphics"],
    ["Dégradé sucré", "Sweet gradient"],
    ["Motif glacé", "Icy pattern"]
  ],
  "Lime Green": [
    ["Esthétique punchy", "Punchy aesthetic"],
    ["Tracé pétillant", "Sparkling lines"],
    ["Nappe citronnée", "Lemony overlay"],
    ["Voile zesté", "Zesty veil"],
    ["Motif vif", "Vivid pattern"]
  ],
  "Pastel Peach": [
    ["Texture douce", "Soft texture"],
    ["Voile velouté", "Velvety veil"],
    ["Dégradé léger", "Light gradient"],
    ["Motif pastel", "Pastel pattern"],
    ["Finition onctueuse", "Creamy finish"]
  ],
  "Curaçao Blue": [
    ["Voile tropical", "Tropical veil"],
    ["Motif rafraîchissant", "Refreshing pattern"],
    ["Dégradé piscine", "Pool gradient"],
    ["Texture fruitée", "Fruity texture"],
    ["Tracé frais", "Fresh lines"]
  ],
  "Sorbet Lavender": [
    ["Graphisme doux", "Soft graphics"],
    ["Voile givré", "Frosted veil"],
    ["Texture lisse", "Smooth texture"],
    ["Dégradé pastel", "Pastel gradient"],
    ["Esthétique tendre", "Tender aesthetic"]
  ],
  "Sweet Strawberry": [
    ["Nappe sucrée", "Sweet overlay"],
    ["Motif fruits rouges", "Red fruits pattern"],
    ["Voile bonbon", "Candy veil"],
    ["Finition confiserie", "Confectionery finish"],
    ["Tracé juteux", "Juicy lines"]
  ],
  "Whipped Mint": [
    ["Texture glacée", "Icy texture"],
    ["Graphisme givré", "Frosted graphics"],
    ["Dégradé mentholé", "Menthol gradient"],
    ["Voile léger", "Light veil"],
    ["Motif éclatant", "Bright pattern"]
  ],
  "Orange Ice": [
    ["Voile crémeux", "Creamy veil"],
    ["Dégradé fruit givré", "Frosted fruit gradient"],
    ["Motif sorbet", "Sorbet pattern"],
    ["Finition douce", "Soft finish"],
    ["Tracé agrume", "Citrus lines"]
  ],
  "Pink Lychee": [
    ["Texture subtile", "Subtle texture"],
    ["Voile fruit blanc", "White fruit veil"],
    ["Graphisme élégant", "Elegant graphics"],
    ["Dégradé rosé", "Rosy gradient"],
    ["Motif tendre", "Tender pattern"]
  ],
  "Sweet Pineapple": [
    ["Motif exotique", "Exotic pattern"],
    ["Tracé sucré", "Sweet lines"],
    ["Finition juteuse", "Juicy finish"],
    ["Voile jaune pâle", "Pale yellow veil"],
    ["Texture tropicale", "Tropical texture"]
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
