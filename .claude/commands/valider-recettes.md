# Valider toutes les recettes

Vérifie que toutes les recettes respectent les standards du projet et génère un rapport de conformité.

## Arguments

$ARGUMENTS - "toutes" pour tout valider, ou un numéro de recette spécifique

## Instructions

Tu es un auditeur qualité pour le projet de recettes. Tu dois vérifier la conformité technique et nutritionnelle de chaque recette.

### Critères de validation

#### 1. Structure technique
- [ ] Tous les champs requis sont présents
- [ ] Le numéro correspond au nom de fichier
- [ ] L'export est correct dans index.js
- [ ] Pas de caractères spéciaux problématiques

#### 2. Ratio nutritionnel (50/25/25)
- [ ] Les légumes représentent environ 50% du plat
- [ ] Les protéines représentent environ 25%
- [ ] Les féculents représentent environ 25%
- [ ] Les aromates (ail, coriandre, persil, menthe) ne comptent pas comme légumes

#### 3. Sans produits laitiers
- [ ] Aucune mention de : lait, crème, beurre, fromage, yaourt
- [ ] Pas d'ingrédients cachés (certains pains, sauces)

#### 4. Cohérence des données
- [ ] `legumes` correspond aux légumes dans `ingredients`
- [ ] `proteines` correspond aux protéines dans `ingredients`
- [ ] `feculents` correspond aux féculents dans `ingredients`
- [ ] Tous les ingrédients sont utilisés dans les étapes
- [ ] `etapes_weekend` référence des étapes existantes

#### 5. Temps et conservation
- [ ] `temps_prep_semaine` est réaliste (généralement < 30 min)
- [ ] `temps_prep_weekend` inclut la préparation à l'avance
- [ ] `conservation` est cohérente avec le type de plat
- [ ] `rechauffage` est approprié

#### 6. Qualité du contenu
- [ ] Orthographe française correcte (accents)
- [ ] `description` est historiquement plausible
- [ ] `variantes` sont des alternatives réalistes

### Format du rapport

```
# Rapport de validation des recettes

**Date**: [Date]
**Recettes analysées**: [N]

## Résumé

| Statut | Nombre | Pourcentage |
|--------|--------|-------------|
| Conformes | X | X% |
| Avertissements | X | X% |
| Erreurs | X | X% |

## Détails par recette

### Recette #1: [Nom]
**Statut**: Conforme / Avertissement / Erreur

✓ Structure technique
✓ Ratio nutritionnel
✓ Sans produits laitiers
⚠ Cohérence des données : [détail]
✗ Temps et conservation : [problème]

### Recette #2: [Nom]
...

## Problèmes prioritaires

1. **[Problème critique]** - Recettes #X, #Y
   - Description du problème
   - Action corrective suggérée

2. **[Avertissement]** - Recettes #Z
   - Description
   - Suggestion

## Actions recommandées

- [ ] Corriger [problème 1] dans recette #X
- [ ] Vérifier [élément] dans recettes #Y, #Z
- [ ] Ajouter [information manquante] partout
```

## Exécution

1. Lis toutes les recettes dans `src/data/recettes/`
2. Pour chaque recette, applique tous les critères de validation
3. Compile les résultats
4. Génère le rapport avec les problèmes classés par priorité
5. Propose des corrections automatiques si possible

## Modes

- `/valider-recettes toutes` : Rapport complet de toutes les recettes
- `/valider-recettes 15` : Validation détaillée de la recette #15
- `/valider-recettes corriger` : Valide et corrige automatiquement les problèmes simples

## Différence avec /reviser-recette

- `/valider-recettes` : Vérifie la conformité technique et structurelle
- `/reviser-recette` : Analyse la qualité culinaire et la clarté des instructions

Les deux commandes sont complémentaires.
