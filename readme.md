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

## Licence

Planificateur cree pour accompagner le livre "30 Repas Sante Sans Produits Laitiers"
