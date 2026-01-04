# Suggérer de nouvelles recettes

Propose une liste de nouvelles recettes adaptées au projet, basées sur les recettes existantes et les préférences.

## Arguments

$ARGUMENTS - Critères de suggestion (région, protéine, style) ou "analyser" pour une analyse des manques

## Instructions

Tu es un consultant culinaire expert. Analyse les recettes existantes et propose des suggestions pertinentes.

### Analyse des recettes existantes

Avant de suggérer, tu dois :
1. Lire toutes les recettes dans `src/data/recettes/`
2. Analyser la répartition par région
3. Analyser la répartition par type de protéine
4. Identifier les "trous" dans la collection

### Critères de suggestion

Chaque suggestion doit :
- Respecter le ratio 50% légumes / 25% protéines / 25% féculents
- Être sans produits laitiers
- Apporter de la diversité (éviter les doublons de style)
- Être réalisable en moins de 45 minutes en semaine
- Se conserver et se réchauffer facilement

### Régions disponibles

- Québec, Asie, Méditerranée, Amérique, Afrique, Europe

### Format de sortie

Pour chaque recette suggérée, fournis :

```
## Suggestion [N]: [Nom du plat]

**Origine**: [Pays]
**Région**: [Catégorie]
**Protéine**: [Type de protéine]
**Légumes principaux**: [Liste]
**Féculent**: [Type]

### Pourquoi cette recette ?
[Justification basée sur l'analyse - ce qu'elle apporte de nouveau]

### Description
[2-3 phrases sur l'histoire et la culture du plat]

### Aperçu des ingrédients clés
[Liste des 5-6 ingrédients principaux]

### Difficulté estimée
[Facile / Moyen / Avancé]
```

## Modes d'exécution

### Mode "analyser"
Produis un rapport complet :
- Répartition actuelle par région (avec pourcentages)
- Répartition par protéine (poulet, boeuf, porc, poisson, végé)
- Régions sous-représentées
- Types de protéines manquants
- 10 suggestions prioritaires avec justification

### Mode par critère
Si l'utilisateur spécifie des critères :
- `/suggerer-recettes Asie` → 5 recettes asiatiques manquantes
- `/suggerer-recettes végétarien` → 5 recettes végétariennes
- `/suggerer-recettes poisson` → 5 recettes de poisson
- `/suggerer-recettes rapide` → 5 recettes de moins de 20 min

### Mode libre
Sans critère spécifique, propose 5 recettes variées qui comblent les manques identifiés.

## Exécution

1. Lis toutes les recettes existantes
2. Analyse selon le mode demandé
3. Génère les suggestions avec tous les détails
4. Indique comment utiliser `/ajouter-recette` pour implémenter une suggestion

## Bonus

À la fin, propose une commande `/ajouter-recette` prête à l'emploi pour la suggestion la plus pertinente.
