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

Deux listes essentielles pour votre organisation. **Important :** Les taches et la liste d'epicerie sont generees a partir du **menu planifie** (pas de la selection de recettes).

**Liste des taches (preparation week-end)**
- Ce qu'il faut preparer a l'avance pour chaque recette du menu
- Temps estime de preparation
- Informations de conservation

**Liste d'epicerie**
- Tous les ingredients du menu regroupes par categorie
- Quantites ajustees selon les portions definies pour chaque jour
- Cases a cocher pour faciliter les courses ("a la maison" ou "achete")
- Imprimable en format pratique

### 4. Cuisiner

L'onglet pour preparer vos recettes. **Important :** Cet onglet affiche les recettes du **menu planifie** (pas de la selection).

- Liste des recettes a cuisiner cette semaine
- Portions ajustees selon la planification
- Selection des recettes a imprimer
- Impression des fiches recettes avec ingredients ajustes

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

# Recettes à ajouter

```
  /ajouter-recette Köfte turques aux aubergines - Turquie - boulettes d'agneau épicées (cumin, sumac, persil) servies sur aubergines fondantes à la tomate, accompagnées de boulgour pilaf

  /ajouter-recette Poisson grillé à la chermoula - Maroc - poisson blanc (bar, dorade ou cabillaud) mariné à la chermoula (coriandre, persil, cumin, paprika, ail, citron confit), servi avec couscous aux herbes et poivrons grillés

  /ajouter-recette Maghmour libanais - Liban - moussaka végétarienne aux aubergines fondantes et pois chiches dans une sauce tomate épicée à la cannelle et piment d'Alep, servie avec pain pita

  /ajouter-recette Calamars farcis à la grecque - Grèce - tubes de calamars farcis au riz, oignons, tomates et aneth, mijotés dans une sauce tomate au vin blanc

  /ajouter-recette Pasta e fagioli - Italie - soupe rustique aux haricots blancs cannellini et pâtes ditalini, avec céleri, carottes, tomates et romarin

# Suggestions
 /ajouter-recette Köfte turques aux aubergines - Turquie - boulettes d'agneau épicées (cumin, sumac, persil) servies sur aubergines fondantes à la tomate, accompagnées de boulgour pilaf

  /ajouter-recette Mapo Tofu - Chine (Sichuan) - tofu soyeux dans sauce épicée aux haricots fermentés, porc haché, poivre du Sichuan, servi sur riz jasmin

  /ajouter-recette Poulet basquaise - France (Pays Basque) - poulet mijoté aux poivrons rouges et verts, tomates, oignons et piment d'Espelette, servi avec riz ou pommes de terre

  /ajouter-recette Adobo philippin - Philippines - poulet et porc braisés au vinaigre, sauce soja et ail, caramélisés, servis sur riz jasmin

  /ajouter-recette Laksa malaisien - Malaisie - soupe épicée au lait de coco, crevettes, tofu, nouilles de riz, germes de soja et bok choy

  /ajouter-recette Chili sin carne - USA/Tex-Mex - ragoût végétarien aux haricots rouges et noirs, poivrons, maïs, tomates, épicé au chipotle, servi avec riz

  /ajouter-recette Canard laqué simplifié - Chine (Pékin) - magret de canard à la peau croustillante, sauce hoisin, concombre et oignons verts, servi avec crêpes mandarin

  /ajouter-recette Frittata aux légumes méditerranéens - Italie - omelette épaisse aux courgettes, poivrons, tomates séchées et épinards, servie avec pain ciabatta grillé

  /ajouter-recette Bobotie sud-africain - Afrique du Sud - pain de viande épicé aux fruits secs et curry, gratiné aux œufs, servi avec riz au curcuma

  /ajouter-recette Phở gà vietnamien - Vietnam - soupe au poulet avec bouillon parfumé (anis étoilé, cannelle, gingembre), nouilles de riz et herbes fraîches

# Bols

 /ajouter-recette Poké bowl au saumon - Hawaï - saumon cru mariné (soja, sésame), avocat, edamame, concombre, chou rouge et algues wakame sur riz sushi vinaigré

  /ajouter-recette Chirashi bowl - Japon - assortiment de poissons crus (saumon, thon, crevettes) sur riz sushi vinaigré, avec concombre, avocat, omelette fine et nori

  /ajouter-recette Bol shawarma au poulet - Liban - poulet épicé (cumin, curcuma, paprika) grillé, sauce tahini, pickles d'oignons, salade fraîche sur riz aux vermicelles

  /ajouter-recette Bol brésilien au poulet - Brésil - poulet grillé aux épices, haricots noirs, riz, farofa (manioc grillé), chou kale sauté et vinaigrette lime-coriandre

  /ajouter-recette Oyakodon japonais - Japon - poulet et œuf mijotés dans bouillon dashi sucré-salé, oignons, champignons shiitake, servis sur riz japonais

# Salade-repas
 /ajouter-recette Salade thaï au bœuf grillé (Yam Nuea) - Thaïlande - bœuf grillé tranché sur lit de laitue, concombre, tomates, oignon rouge, menthe et coriandre, vinaigrette lime-piment-sauce poisson

  /ajouter-recette Salade César revisitée - Mexique/USA - poulet grillé sur romaine croquante, croûtons à l'ail, sauce crémeuse au tahini (ail, citron, moutarde, câpres), avocat

  /ajouter-recette Salade niçoise - France (Nice) - thon, œufs durs, haricots verts, pommes de terre nouvelles, tomates, olives niçoises, vinaigrette à l'huile d'olive et ail

  /ajouter-recette Salade de quinoa tex-mex - USA - quinoa, haricots noirs, maïs grillé, poivrons, tomates, avocat, jalapeño, vinaigrette lime-chipotle-coriandre

  /ajouter-recette Salade japonaise au saumon teriyaki - Japon - saumon glacé teriyaki sur edamame, concombre, chou rouge et avocat, vinaigrette sésame-gingembre, servi froid avec riz sushi

# Soupe-repas

 /ajouter-recette Salade thaï au bœuf grillé (Yam Nuea) - Thaïlande - bœuf grillé tranché sur lit de laitue, concombre, tomates, oignon rouge, menthe et coriandre, vinaigrette lime-piment-sauce poisson

  /ajouter-recette Salade César revisitée - Mexique/USA - poulet grillé sur romaine croquante, croûtons à l'ail, sauce crémeuse au tahini (ail, citron, moutarde, câpres), avocat

  /ajouter-recette Salade niçoise - France (Nice) - thon, œufs durs, haricots verts, pommes de terre nouvelles, tomates, olives niçoises, vinaigrette à l'huile d'olive et ail

  /ajouter-recette Salade de quinoa tex-mex - USA - quinoa, haricots noirs, maïs grillé, poivrons, tomates, avocat, jalapeño, vinaigrette lime-chipotle-coriandre

  /ajouter-recette Salade japonaise au saumon teriyaki - Japon - saumon glacé teriyaki sur edamame, concombre, chou rouge et avocat, vinaigrette sésame-gingembre, servi froid avec riz sushi

# Repas très simple et rapide


  /ajouter-recette Pâtes aglio e olio aux légumes - Italie - spaghetti à l'ail et huile d'olive, piment, épinards, tomates cerises et pois chiches, 12 min total sans préparation

  /ajouter-recette Riz sauté aux œufs - Chine - riz froid sauté au wok avec œufs brouillés, petits pois, carottes et oignons verts, sauce soja et sésame, 10 min total

  /ajouter-recette Quesadillas aux haricots noirs - Mexique - tortillas grillées farcies de purée de haricots noirs, poivrons, oignons et maïs, servies avec avocat, 12 min total

  /ajouter-recette Omelette aux légumes garnie - France - omelette baveuse aux champignons, épinards et herbes fraîches, servie avec pain grillé, 10 min total

  /ajouter-recette Tartine scandinave au saumon fumé - Danemark - smørrebrød au saumon fumé sur pain de seigle, avocat, concombre, radis, aneth et câpres, 8 min sans cuisson
  ```

  ```
  ⎿  Tip: Working with HTML/CSS? Add the frontend-design plugin:
     /plugin marketplace add anthropics/claude-code
     /plugin install frontend-design@claude-code-plugins
  ```

───────────────────────────────────────────────────