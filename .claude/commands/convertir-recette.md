# Convertir une recette externe

Convertit une recette provenant d'une source externe au format du projet.

## Arguments

$ARGUMENTS - La recette à convertir (texte, URL, ou "coller" pour mode interactif)

## Instructions

Tu es un chef adaptateur expert. Tu dois convertir une recette externe au format standardisé du projet tout en l'adaptant à la philosophie nutritionnelle.

### Adaptations requises

1. **Ratio 50/25/25** : Ajuster les quantités pour respecter :
   - 50% légumes
   - 25% protéines
   - 25% féculents

2. **Sans produits laitiers** : Remplacer :
   - Beurre → Huile d'olive ou huile de coco
   - Crème → Lait de coco
   - Fromage → Levure nutritionnelle ou omettre
   - Lait → Lait végétal
   - Yaourt → Yaourt de coco

3. **Portions** : Adapter pour 4 personnes

4. **Temps réalistes** : Estimer temps_prep_semaine et temps_prep_weekend

### Processus de conversion

1. **Analyser la recette source** :
   - Identifier la protéine principale
   - Lister les légumes
   - Identifier le féculent
   - Repérer les produits laitiers à remplacer

2. **Adapter les proportions** :
   - Calculer les nouvelles quantités
   - Ajouter des légumes si nécessaire
   - Réduire les féculents si trop présents

3. **Restructurer les étapes** :
   - Identifier ce qui peut être préparé à l'avance
   - Numéroter les étapes clairement
   - Préciser les temps de cuisson

4. **Enrichir** :
   - Rechercher l'origine et l'histoire du plat
   - Proposer des variantes de protéines
   - Estimer la conservation

### Format de sortie

```
## Analyse de la recette source

**Nom original**: [Nom]
**Source**: [URL ou source]

### Problèmes identifiés
- [ ] Ratio non respecté : [détails]
- [ ] Produits laitiers : [liste]
- [ ] Portions à ajuster : [X → 4]

### Modifications proposées
1. [Modification 1]
2. [Modification 2]

---

## Recette convertie

[Afficher la recette complète au format du projet]

---

## Validation

- [ ] Ratio 50/25/25 respecté
- [ ] Sans produits laitiers
- [ ] 4 portions
- [ ] Temps réalistes
- [ ] Description culturelle ajoutée
```

## Mode interactif ("coller")

Si l'argument est "coller" :
1. Demande à l'utilisateur de coller la recette
2. Analyse et propose les adaptations
3. Demande confirmation avant de créer le fichier

## Exécution

1. Récupère ou reçois la recette source
2. Analyse et identifie les adaptations nécessaires
3. Convertis au format du projet
4. Propose la recette convertie
5. Si approuvé, utilise le même processus que `/ajouter-recette` pour créer le fichier

## Exemples

```
/convertir-recette https://www.marmiton.org/recettes/recette_poulet-basquaise_17893.aspx
/convertir-recette coller
/convertir-recette Boeuf bourguignon: 500g boeuf, 200g carottes, 200g champignons, vin rouge, bouillon...
```
