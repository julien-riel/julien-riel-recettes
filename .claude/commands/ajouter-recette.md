# Ajouter une nouvelle recette

Ajoute une nouvelle recette au planificateur de repas en suivant le format et les standards du projet.

## Arguments

$ARGUMENTS - Description de la recette à créer (nom, origine, ingrédients principaux) ou "interactive" pour un mode guidé

## Instructions

Tu es un chef cuisinier expert et un développeur. Tu dois créer une nouvelle recette qui respecte parfaitement le format et la philosophie du projet.

### Philosophie nutritionnelle obligatoire

Chaque recette DOIT respecter :
- **50% légumes** - Pas les aromates (ail, coriandre, persil, menthe)
- **25% protéines** - Viande, poisson, tofu, légumineuses
- **25% féculents** - Riz, pâtes, pommes de terre, pain
- **Sans produits laitiers** - Aucun lait, fromage, crème, beurre

### Régions disponibles

Les pays d'origine doivent appartenir à une de ces régions :
- Québec: Québec
- Asie: Thaïlande, Corée du Sud, Japon, Vietnam, Inde, Indonésie, Chine, Hawaï
- Méditerranée: Israël, Grèce, Maroc, Liban, Espagne, Italie, Turquie
- Amérique: Mexique, Pérou, Brésil, Venezuela, Costa Rica, Cuba, El Salvador, Colombie
- Afrique: Sénégal, Jamaïque, Éthiopie, Martinique, Nigeria
- Europe: France, Pologne, Fusion

### Structure de la recette

Crée un fichier JavaScript dans `src/data/recettes/` avec ce format exact :

```javascript
export const recetteXX = {
  "num": XX,                           // Prochain numéro disponible
  "nom": "Nom du plat",               // Nom en français
  "origine": "Pays",                  // Pays d'origine
  "temps_prep_semaine": "XX min",     // Temps si préparé en semaine
  "temps_prep_weekend": "XX min",     // Temps si préparé le week-end
  "prep_weekend": "Description courte des préparations possibles le week-end",
  "conservation": "Frigo X jours | Congélateur X mois",
  "rechauffage": "Instructions de réchauffage",
  "proteines": "Protéine principale (quantité)",
  "legumes": "Liste des légumes principaux",
  "feculents": "Féculent (quantité)",
  "variantes": "Alternatives de protéines",
  "ingredients": [
    "Quantité et description de chaque ingrédient"
  ],
  "etapes": [
    "Étape 1 de préparation",
    "Étape 2...",
  ],
  "portions": 4,
  "description": "Description historique et culturelle du plat (2-3 phrases)",
  "etapes_weekend": [1, 2],           // Numéros des étapes faisables à l'avance (1-indexed)
  "note_weekend": "Ce qui peut être préparé à l'avance"
};
```

## Exécution

1. **Déterminer le prochain numéro** : Lis `src/data/recettes/index.js` pour trouver le prochain numéro disponible

2. **Mode interactif** : Si l'argument est "interactive", pose des questions sur :
   - Nom et origine du plat
   - Protéine principale souhaitée
   - Type de légumes préférés
   - Féculent désiré
   - Niveau de difficulté

3. **Créer la recette** :
   - Génère un nom de fichier : `recette-XX-nom-du-plat-en-kebab-case.js`
   - Crée le contenu avec tous les champs requis
   - Assure-toi que les proportions 50/25/25 sont respectées
   - Écris une description culturelle authentique

4. **Mettre à jour l'index** :
   - Ajoute l'import dans `src/data/recettes/index.js`
   - Ajoute la recette au tableau RECETTES
   - Ajoute l'export individuel

5. **Valider** :
   - Vérifie que tous les ingrédients sont utilisés dans les étapes
   - Vérifie la cohérence des temps de préparation
   - Assure-toi que les étapes_weekend sont logiques

## Exemple d'utilisation

- `/ajouter-recette Poulet au curry japonais avec riz`
- `/ajouter-recette Poké bowl hawaïen au thon`
- `/ajouter-recette interactive`
