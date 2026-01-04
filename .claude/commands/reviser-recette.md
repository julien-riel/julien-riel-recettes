# Réviser une recette

Révise une recette du planificateur de repas en analysant sa qualité et sa cohérence et ensuite applique
tes suggestions

## Arguments

$ARGUMENTS - Le numéro de la recette à réviser (1-35), ou "toutes" pour réviser toutes les recettes

## Instructions

Tu es un réviseur culinaire francophone expert. Analyse la recette demandée selon les critères suivants:

### 1. Langue et orthographe
- Vérifie l'orthographe française (attention aux accents)
- Vérifie la grammaire et la syntaxe
- Assure-toi que le style est cohérent

### 2. Cohérence des informations
- Le champ `legumes` correspond-il aux légumes dans `ingredients`?
- Le champ `proteines` correspond-il aux protéines dans `ingredients`?
- Le champ `feculents` correspond-il aux féculents dans `ingredients`?
- Les `variantes` proposées sont-elles réalistes?

### 3. Clarté des étapes
- Les étapes sont-elles dans un ordre logique?
- Les temps de cuisson sont-ils précisés?
- Y a-t-il des étapes manquantes ou redondantes?
- Tous les ingrédients listés sont-ils utilisés dans les étapes?

### 4. Temps de préparation
- Les temps `temps_prep_semaine` et `temps_prep_weekend` sont-ils réalistes?
- Les `etapes_weekend` correspondent-elles à des étapes qui peuvent vraiment être préparées à l'avance?
- La `note_weekend` est-elle cohérente avec `prep_weekend`?

### 5. Conservation et réchauffage
- Les informations de `conservation` sont-elles réalistes pour ce type de plat?
- Les instructions de `rechauffage` sont-elles appropriées?

### 6. Description culturelle
- La `description` est-elle informative et exacte historiquement?
- Ajoute-t-elle de la valeur à la recette?

### 7. Proportions
- Les quantités sont-elles appropriées pour 4 portions?
- Le ratio 50% légumes / 25% protéines / 25% féculents est-il respecté?

### 8. Préparation le week-end
- les etapes_weekend correspondent-ils aux notes week-end.
- est-ce que les notes week-ends sont suffisants claires pour faire une liste de tâche du week-end

## 9. Quantité de légumes
- Est-ce que 50% de légumes correspond à ce qui est dans l'assiette
- Les herbes et aromates ne sont pas des légumes: ail, coriandre, persils, menthe
- Est-ce que la recette contient suffisament de fibres

## Format de sortie

Pour chaque recette révisée, produis un rapport structuré:

```
## Recette #[num]: [nom]

### Résumé
[Note globale: Excellent / Bon / À améliorer / Problématique]

### Points positifs
- [liste des points forts]

### Corrections requises
- [ ] [correction 1 avec explication]
- [ ] [correction 2 avec explication]

### Suggestions d'amélioration
- [suggestion 1]
- [suggestion 2]

### Modifications proposées
[Si des corrections sont nécessaires, propose le code corrigé pour les champs concernés]
```

## Exécution

1. Lis la recette demandée dans `src/data/recettes/`
2. Analyse selon tous les critères ci-dessus
3. Produis le rapport de révision
4. Si des corrections sont nécessaires, applique les modifications exactes à apporter

Si l'argument est "toutes", (tu peux utiliser des sous-agents) révise et corrige chaque recette séquentiellement en produisant un rapport consolidé à la fin avec:
- Nombre de recettes excellentes
- Nombre de recettes à corriger
- Liste des corrections prioritaires
