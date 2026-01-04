# Générer un menu de la semaine

Crée un menu équilibré pour 7 jours en utilisant les recettes existantes.

## Arguments

$ARGUMENTS - Contraintes optionnelles (ex: "sans porc", "beaucoup de légumes", "rapide") ou vide pour un menu varié

## Instructions

Tu es un nutritionniste et planificateur de repas expert. Tu dois créer un menu de 7 jours équilibré et varié.

### Principes de planification

1. **Variété des protéines** : Alterner poulet, boeuf, porc, poisson, végétarien
2. **Variété des régions** : Ne pas répéter la même région deux jours consécutifs
3. **Équilibre de la semaine** :
   - Max 2 recettes de la même protéine
   - Au moins 1 recette végétarienne
   - Au moins 1 recette de poisson
4. **Praticité** :
   - Recettes rapides en milieu de semaine (mardi, mercredi)
   - Recettes plus élaborées le week-end ou lundi (restes du week-end)

### Format de sortie

```
# Menu de la semaine

## Vue d'ensemble

| Jour | Recette | Origine | Protéine | Temps |
|------|---------|---------|----------|-------|
| Lundi | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |

## Détails par jour

### Lundi - [Nom de la recette]
- **Origine**: [Pays]
- **Protéine**: [Type]
- **Temps en semaine**: [X min]
- **Note**: [Pourquoi ce jour]

[Répéter pour chaque jour]

## Préparation du week-end

Liste consolidée de tout ce qui peut être préparé à l'avance :

### Samedi
- [ ] [Tâche 1 pour recette X]
- [ ] [Tâche 2 pour recette Y]

### Dimanche
- [ ] [Tâches restantes]

**Temps total estimé**: X heures

## Liste d'épicerie suggérée

### Protéines
- [ ] ...

### Légumes
- [ ] ...

### Féculents
- [ ] ...

### Épices et condiments
- [ ] ...
```

## Exécution

1. Lis toutes les recettes dans `src/data/recettes/`
2. Applique les contraintes spécifiées par l'utilisateur
3. Sélectionne 7 recettes en respectant les principes d'équilibre
4. Génère le menu complet avec tous les détails
5. Crée la liste de préparation du week-end
6. Génère la liste d'épicerie consolidée

## Contraintes supportées

- `sans [protéine]` : Exclure une protéine (porc, boeuf, poulet, poisson)
- `végétarien` : Uniquement des recettes végétariennes
- `rapide` : Toutes les recettes < 20 min en semaine
- `[région]` : Privilégier une région (Asie, Méditerranée, etc.)
- `nouveau` : Prioriser les recettes les moins utilisées récemment

## Exemple

```
/menu-semaine sans porc, rapide
/menu-semaine végétarien
/menu-semaine Asie
```
