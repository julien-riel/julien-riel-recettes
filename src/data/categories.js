export const CATEGORIES_INGREDIENTS = {
  'Viandes & Poissons': [
    'poulet', 'bœuf', 'porc', 'agneau', 'crevettes', 'crevette', 'poisson', 'saumon',
    'merguez', 'viande', 'cuisse', 'poitrine', 'cabillaud', 'lotte', 'moules',
    'calamars', 'fruits de mer', 'fumet', 'jambon'
  ],
  'Légumes frais': [
    'poivron', 'oignon', 'ail', 'carotte', 'courgette', 'tomate', 'concombre',
    'épinard', 'champignon', 'shiitake', 'brocoli', 'chou', 'laitue', 'salade',
    'pomme de terre', 'patate', 'haricot vert', 'haricots verts', 'germe', 'avocat',
    'citron', 'lime', 'gingembre', 'échalote', 'céleri', 'aubergine', 'courge',
    'olive', 'pak choi', 'poireau', 'rutabaga', 'manioc', 'christophine', 'chayotte',
    'pois mange-tout', 'mange-tout', 'petits pois', 'bambou', 'romaine', 'kale',
    'artichaut', 'piment'
  ],
  'Herbes fraîches': [
    'basilic', 'coriandre', 'persil', 'menthe', 'citronnelle', 'thym frais',
    'romarin', 'origan frais', 'aneth', 'ciboulette', 'bouquet garni',
    'feuilles de lime', 'laurier'
  ],
  'Féculents': [
    'riz', 'nouille', 'semoule', 'couscous', 'boulgour', 'quinoa', 'vermicelle',
    'orzo', 'pain', 'pita', 'tortilla', 'arepa', 'farine de maïs', 'maïs',
    'polenta', 'injera', 'ramen', 'naan', 'pâte à tarte', 'pâtes à tarte'
  ],
  'Légumineuses & Protéines végétales': [
    'pois chiche', 'lentille', 'haricot rouge', 'haricot noir', 'haricots rouges',
    'haricots noirs', 'tofu', 'fève', 'edamame', 'pois jaunes'
  ],
  'Conserves & Sauces': [
    'sauce soja', 'sauce poisson', 'sauce huître', "sauce d'huître", 'concentré',
    'tomates concassées', 'lait de coco', 'bouillon', 'pâte de curry', 'pâte de tomate',
    'pâte de crevettes', 'gochujang', 'miso', 'tahini', 'vinaigre', 'moutarde',
    'harissa', 'sambal', 'kecap manis', 'nuoc mam', 'houmous', 'lait d\'avoine'
  ],
  'Épices & Condiments': [
    'cumin', 'paprika', 'curcuma', 'curry', 'cannelle', 'safran', 'coriandre moulue',
    'cayenne', 'berbere', 'berbéré', 'garam masala', 'cinq épices', 'graines de sésame',
    'sésame', 'achiote', 'poivre', 'sel', 'sucre', 'herbes de provence', 'sarriette',
    'bicarbonate', 'clou de girofle', 'colombo', 'cardamome', 'thym séché',
    'origan séché', 'nori', 'roux de curry', 'piment de jamaïque', 'muscade'
  ],
  'Huiles & Matières grasses': [
    'huile', 'ghee', 'beurre d\'arachide', 'beurre de', 'niter kibbeh',
    'arachides', 'cacahuètes', 'noix de cajou'
  ],
  'Œufs & Produits frais': [
    'œuf', 'oeuf'
  ],
  'Fruits': [
    'mangue', 'ananas', 'orange'
  ]
};

/**
 * Normalise un ingrédient pour le regroupement
 * Retire les quantités, les coupes et les préparations
 */
export function normalizeIngredient(ingredient) {
  let normalized = ingredient.toLowerCase().trim();

  // Retirer les quantités au début (ex: "300g de", "2 c. à soupe de", "1/2")
  normalized = normalized.replace(/^[\d\s,./½¼¾]+(?:g|kg|ml|l|cl)?\s*(?:de\s+|d[''])?/i, '');
  normalized = normalized.replace(/^[\d\s,./½¼¾]+\s*c\.\s*à\s*(?:soupe|café|thé)\s*(?:de\s+|d[''])?/i, '');
  normalized = normalized.replace(/^c\.\s*à\s*(?:soupe|café|thé)\s*(?:de\s+|d[''])?/i, '');
  normalized = normalized.replace(/^[\d\s,./½¼¾]+\s*(?:gousses?|feuilles?|branches?|bouquets?|tranches?|morceaux?|cubes?|portions?|épis?)\s*(?:de\s+|d[''])?/i, '');

  // Retirer "d'" ou "de" au début si présent après nettoyage
  normalized = normalized.replace(/^d['']?\s*/i, '');
  normalized = normalized.replace(/^de\s+/i, '');

  // Retirer les préparations et coupes entre virgules ou parenthèses
  normalized = normalized.replace(/,\s*(émincée?s?|hachée?s?|râpée?s?|coupée?s?|tranchée?s?|concassée?s?|en (?:cubes?|dés?|lanières?|julienne|rondelles?|quartiers?|morceaux?|tronçons?|tranches?|demi-lunes?|demi-rondelles?|chemise)|finement|grossièrement|égouttée?s?|décortiquée?s?).*$/i, '');
  normalized = normalized.replace(/\s*\([^)]*\)\s*/g, ' ');

  // Nettoyer les espaces multiples
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Extrait l'ingrédient de base pour le regroupement
 */
export function getBaseIngredient(ingredient) {
  const normalized = normalizeIngredient(ingredient);

  // Mapping des ingrédients similaires (ordre important - plus spécifique d'abord)
  const ingredientGroups = [
    // Viandes
    ['poulet', ['poitrine de poulet', 'poulet', 'hauts de cuisse de poulet', 'cuisses de poulet', 'hauts de cuisses de poulet']],
    ['bœuf', ['bœuf haché', 'bœuf', 'bavette', 'rumsteck']],
    ['porc', ['porc haché', 'porc', 'poitrine de porc', 'épaule de porc']],
    ['crevettes', ['crevettes', 'crevette']],
    ['poisson blanc', ['filet de poisson blanc', 'poisson blanc', 'cabillaud', 'lotte']],

    // Légumes
    ['oignons verts', ['oignon vert', 'oignons verts']],
    ['oignon', ['oignon blanc', 'oignon rouge', 'gros oignon', 'oignon']],
    ['carotte', ['carotte', 'carottes']],
    ['tomates cerises', ['tomates cerises']],
    ['tomates concassées', ['tomates concassées']],
    ['tomate', ['tomate', 'tomates']],
    ['poivron', ['poivron', 'poivrons']],
    ['concombre', ['concombre', 'concombres']],
    ['ail', ['ail', 'gousses d\'ail', 'gousse d\'ail']],
    ['gingembre', ['gingembre', 'morceau de gingembre', 'cm de gingembre']],
    ['courgette', ['courgette', 'courgettes']],
    ['aubergine', ['aubergine']],
    ['épinards', ['épinard', 'épinards']],
    ['chou', ['chou blanc', 'chou rouge', 'chou vert', 'chou']],
    ['champignons shiitake', ['champignon shiitake', 'champignons shiitake', 'shiitake']],
    ['olives', ['olive', 'olives']],
    ['haricots verts', ['haricot vert', 'haricots verts']],
    ['piment', ['piment', 'piments']],
    ['pommes de terre', ['pomme de terre', 'pommes de terre']],
    ['patate douce', ['patate douce', 'patates douces']],
    ['citron', ['citron', 'citrons', 'jus de citron', 'jus d\'un citron', 'jus de 2 citrons']],
    ['lime', ['lime', 'limes', 'citron vert', 'citrons verts', 'jus de lime', 'jus de 2 limes']],
    ['laitue', ['laitue', 'romaine', 'cœur de laitue', 'feuilles de laitue']],
    ['céleri', ['céleri', 'branches de céleri']],
    ['échalote', ['échalote', 'échalotes']],
    ['avocat', ['avocat', 'avocats']],
    ['brocoli', ['brocoli', 'brocoli chinois']],
    ['pak choi', ['pak choi']],
    ['germes de soja', ['germe de soja', 'germes de soja']],
    ['petits pois', ['petits pois', 'pois']],

    // Herbes
    ['basilic', ['basilic', 'basilic thaï', 'basilic frais']],
    ['coriandre', ['coriandre', 'bouquet de coriandre', 'coriandre fraîche']],
    ['persil', ['persil', 'bouquet de persil', 'persil frais', 'persil plat']],
    ['menthe', ['menthe', 'bouquet de menthe', 'menthe fraîche']],
    ['laurier', ['laurier', 'feuille de laurier', 'feuilles de laurier']],

    // Féculents
    ['riz', ['riz basmati', 'riz jasmin', 'riz long', 'riz japonais', 'riz rond', 'riz brisé', 'riz à sushi', 'riz bomba', 'riz arborio', 'riz']],
    ['vermicelles de riz', ['vermicelle de riz', 'vermicelles de riz']],
    ['nouilles', ['nouille', 'nouilles']],
    ['maïs', ['maïs', 'épi de maïs', 'maïs en grains']],
    ['tortillas', ['tortilla', 'tortillas']],
    ['semoule de couscous', ['semoule', 'couscous']],

    // Conserves & Sauces
    ['lait de coco', ['lait de coco']],
    ['bouillon de poulet', ['bouillon de poulet']],
    ['bouillon de bœuf', ['bouillon de bœuf']],
    ['bouillon', ['bouillon', 'eau ou bouillon']],
    ['sauce soja', ['sauce soja']],
    ['sauce poisson', ['sauce poisson']],
    ['sauce d\'huître', ['sauce huître', 'sauce d\'huître']],

    // Légumineuses
    ['haricots noirs', ['haricot noir', 'haricots noirs']],
    ['haricots rouges', ['haricot rouge', 'haricots rouges']],
    ['pois chiches', ['pois chiche', 'pois chiches']],
    ['lentilles', ['lentille', 'lentilles']],
    ['tofu', ['tofu']],

    // Épices
    ['cumin', ['cumin']],
    ['curcuma', ['curcuma']],
    ['paprika', ['paprika']],
    ['cannelle', ['cannelle']],
    ['garam masala', ['garam masala']],
    ['graines de sésame', ['graines de sésame', 'sésame']],
    ['sel et poivre', ['sel et poivre', 'sel, poivre']],
    ['sucre', ['sucre', 'sucre de palme', 'cassonade']],
    ['sarriette', ['sarriette']],

    // Huiles
    ['huile d\'olive', ['huile d\'olive', 'huile olive']],
    ['huile de sésame', ['huile de sésame']],
    ['huile d\'arachide', ['huile d\'arachide', 'huile arachide']],
    ['huile végétale', ['huile végétale', 'huile', 'huile pour cuisson', 'huile pour friture']],
    ['ghee', ['ghee']],

    // Œufs
    ['œufs', ['œuf', 'oeuf', 'oeufs', 'œufs']],

    // Eau (ignorer)
    ['eau', ['eau', 'eau tiède']],
  ];

  for (const [base, variants] of ingredientGroups) {
    for (const variant of variants) {
      if (normalized === variant || normalized.startsWith(variant + ' ') || normalized.includes(' ' + variant)) {
        return base;
      }
    }
  }

  return normalized;
}
