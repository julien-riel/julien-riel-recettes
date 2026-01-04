# Planificateur de Repas - 30 Recettes Sante

Un outil web interactif pour planifier vos soupers de la semaine avec 30 recettes internationales equilibrees, sans produits laitiers.

## Technologies

- **React 19** - Bibliotheque UI
- **Vite** - Build tool et dev server
- **CSS** - Styles personnalises

## Installation

```bash
# Installer les dependances
npm install

# Lancer le serveur de developpement
npm run dev

# Build pour la production
npm run build

# Previsualiser le build
npm run preview
```

## Structure du projet

```
src/
  components/
    RecipeCard.jsx      # Carte de recette pour la grille
    RecipeDetail.jsx    # Modal de detail de recette
    WeekPlanner.jsx     # Planificateur hebdomadaire
    TasksPanel.jsx      # Panel taches et epicerie
  data/
    recettes.js         # Donnees des 60 recettes
    categories.js       # Categories d'ingredients
    regions.js          # Regions geographiques
  App.jsx               # Composant principal
  main.jsx              # Point d'entree
  index.css             # Styles globaux
```

## Philosophie nutritionnelle

Chaque recette respecte un equilibre precis :

| Composante | Proportion |
|------------|------------|
| Legumes | 50% |
| Proteines | 25% |
| Feculents | 25% |

Toutes les recettes sont **sans produits laitiers**, facilitant la digestion et convenant aux personnes intolerantes au lactose.

## Fonctionnalites

### 1. Selection des recettes

L'onglet principal permet de parcourir les 60 recettes disponibles :

- **Cartes visuelles** - Chaque recette affiche son nom, origine, description historique, temps de preparation et duree de conservation
- **Filtres par region** - Asie, Mediterranee, Amerique Latine, Afrique/Caraibes, Europe
- **Selection multiple** - Cochez les recettes pour les ajouter a votre planification
- **Vue detaillee** - Cliquez sur une carte pour voir la recette complete

### 2. Planifier la semaine

Un calendrier visuel pour organiser vos 7 soupers :

- **Un repas par jour** - Interface simplifiee focalisee sur le souper
- **Menus deroulants** - Les recettes selectionnees apparaissent en priorite
- **Remplissage automatique** - Remplit la semaine avec vos recettes selectionnees
- **Impression** - Generez un menu imprimable pour l'afficher sur le frigo

### 3. Taches & Epicerie

Deux listes essentielles pour votre organisation :

**Liste des taches (preparation week-end)**
- Ce qu'il faut preparer a l'avance pour chaque recette
- Temps estime de preparation
- Informations de conservation

**Liste d'epicerie**
- Tous les ingredients regroupes par categorie
- Cases a cocher pour faciliter les courses
- Imprimable en format pratique

## Detail d'une recette

Chaque fiche recette contient :

- Nom et pays d'origine
- Nombre de portions (4 par defaut)
- Description historique et culturelle du plat
- Temps de preparation (semaine et week-end)
- Composition de l'assiette (legumes, proteines, feculents)
- Liste complete des ingredients
- Etapes de preparation avec badges "WE" pour les etapes realisables a l'avance
- Variantes de proteines suggeres

## Deploiement

Le projet se deploie automatiquement sur push vers `main` via GitHub Actions. Le workflow :

1. Installe les dependances Node.js
2. Build le projet avec Vite
3. Deploie le dossier `dist/` sur le serveur via SSH/rsync

### Secrets requis

- `SSH_PRIVATE_KEY` - Cle SSH privee
- `SSH_HOST` - Hote du serveur
- `SSH_PORT` - Port SSH
- `SSH_USER` - Utilisateur SSH

## Commandes Claude

Le projet inclut des commandes Claude Code pour faciliter la gestion des recettes.

| Commande | Description |
|----------|-------------|
| `/ajouter-recette` | Ajoute une nouvelle recette en suivant le format exact du projet |
| `/suggerer-recettes` | Analyse les recettes existantes et suggere de nouvelles recettes |
| `/menu-semaine` | Genere un menu equilibre de 7 jours avec liste d'epicerie |
| `/convertir-recette` | Convertit une recette externe au format du projet (ratio 50/25/25, sans laitiers) |
| `/valider-recettes` | Verifie la conformite technique de toutes les recettes |
| `/reviser-recette` | Analyse la qualite culinaire et la clarte des instructions |

### Exemples d'utilisation

```bash
# Ajouter une recette
/ajouter-recette Poulet kung pao avec riz jasmin
/ajouter-recette interactive

# Obtenir des suggestions
/suggerer-recettes analyser
/suggerer-recettes Asie
/suggerer-recettes vegetarien

# Planifier la semaine
/menu-semaine
/menu-semaine sans porc, rapide

# Convertir une recette trouvee en ligne
/convertir-recette coller
/convertir-recette [texte de la recette]

# Valider les recettes
/valider-recettes toutes
/valider-recettes 15

# Reviser une recette
/reviser-recette 5
/reviser-recette toutes
```

### Notes

- `/valider-recettes` complete `/reviser-recette` : l'une verifie la structure technique, l'autre la qualite culinaire
- `/ajouter-recette interactive` pose des questions pour guider la creation
- `/suggerer-recettes analyser` montre les regions et proteines sous-representees

## Licence

Planificateur cree pour accompagner le livre "30 Repas Sante Sans Produits Laitiers"
