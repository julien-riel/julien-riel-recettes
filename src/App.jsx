import { useState, useCallback, useEffect } from 'react'
import { RECETTES } from './data/recettes'
import { REGIONS } from './data/regions'
import { CATEGORIES_INGREDIENTS, getBaseIngredient, normalizeIngredient } from './data/categories'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import WeekPlanner from './components/WeekPlanner'
import TasksPanel from './components/TasksPanel'

const STORAGE_KEY = 'recettes-app-state'

/**
 * Loads state from localStorage
 * @returns {Object|null} The saved state or null
 */
function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e)
  }
  return null
}

/**
 * Saves state to localStorage
 * @param {Object} state - The state to save
 */
function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Error saving to localStorage:', e)
  }
}

/**
 * Extracts the protein type from a recipe
 * @param {Object} recette - The recipe object
 * @returns {string} The protein type
 */
function getProteinType(recette) {
  const p = recette.proteines.toLowerCase()
  if (p.includes('poulet')) return 'poulet'
  if (p.includes('porc') || p.includes('jambon')) return 'porc'
  if (p.includes('bœuf') || p.includes('boeuf') || p.includes('agneau')) return 'boeuf'
  if (p.includes('crevette') || p.includes('poisson') || p.includes('saumon') || p.includes('fruits de mer')) return 'poisson'
  if (p.includes('tofu') || p.includes('pois chiche') || p.includes('lentille') || p.includes('haricot')) return 'vegetarien'
  return 'autre'
}

/**
 * Extracts prep time in minutes from a recipe
 * @param {Object} recette - The recipe object
 * @returns {number} Prep time in minutes
 */
function getPrepMinutes(recette) {
  const match = recette.temps_prep_semaine.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

/**
 * Gets the prep time category
 * @param {Object} recette - The recipe object
 * @returns {string} 'rapide', 'moyen', or 'long'
 */
function getPrepCategory(recette) {
  const minutes = getPrepMinutes(recette)
  if (minutes <= 15) return 'rapide'
  if (minutes <= 30) return 'moyen'
  return 'long'
}

/**
 * Calculates recipe difficulty
 * @param {Object} recette - The recipe object
 * @returns {string} 'facile', 'moyen', or 'difficile'
 */
function getDifficulty(recette) {
  const score = recette.ingredients.length + recette.etapes.length + getPrepMinutes(recette) / 10
  if (score < 15) return 'facile'
  if (score < 25) return 'moyen'
  return 'difficile'
}

/**
 * Scales an ingredient quantity
 * @param {string} ingredient - The ingredient string
 * @param {number} multiplier - The scaling multiplier
 * @returns {string} The scaled ingredient string
 */
function scaleIngredient(ingredient, multiplier) {
  const match = ingredient.match(/^([\d.,½¼¾⅓⅔]+)\s*(g|kg|ml|L|cl|c\.\s*à\s*s\.|c\.\s*à\s*c\.|tasse|tasses|)?\s*/i)
  if (match) {
    let qty = match[1]
      .replace(',', '.')
      .replace('½', '0.5')
      .replace('¼', '0.25')
      .replace('¾', '0.75')
      .replace('⅓', '0.33')
      .replace('⅔', '0.66')
    qty = parseFloat(qty)
    if (!isNaN(qty)) {
      const scaled = (qty * multiplier)
      const displayQty = scaled % 1 === 0 ? scaled.toString() : scaled.toFixed(1).replace('.0', '')
      return ingredient.replace(match[0], `${displayQty} ${match[2] || ''} `.trimEnd() + ' ')
    }
  }
  return ingredient
}

/**
 * Determines the region for a given origin
 * @param {string} origine - The country of origin
 * @returns {string} The region name
 */
function getRegion(origine) {
  for (const [region, pays] of Object.entries(REGIONS)) {
    if (pays.includes(origine)) return region
  }
  return 'Autre'
}

/**
 * Categorizes an ingredient into a shopping category
 * Prioritizes the keyword that appears earliest in the ingredient string
 * @param {string} ingredient - The ingredient to categorize
 * @returns {string} The category name
 */
function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase()
  let bestMatch = { category: 'Autres', position: Infinity }

  for (const [category, keywords] of Object.entries(CATEGORIES_INGREDIENTS)) {
    for (const keyword of keywords) {
      const position = lower.indexOf(keyword)
      if (position !== -1 && position < bestMatch.position) {
        bestMatch = { category, position }
      }
    }
  }

  return bestMatch.category
}

function App() {
  // Load saved state from localStorage
  const savedState = loadFromStorage()

  const [activeTab, setActiveTab] = useState('selection')
  const [selectedRecipes, setSelectedRecipes] = useState(() => new Set(savedState?.selectedRecipes || []))
  const [activeFilter, setActiveFilter] = useState('all')
  const [detailRecipe, setDetailRecipe] = useState(null)
  const [weekPlan, setWeekPlan] = useState(savedState?.weekPlan || {
    Lundi: null,
    Mardi: null,
    Mercredi: null,
    Jeudi: null,
    Vendredi: null,
    Samedi: null,
    Dimanche: null
  })
  const [weekPortions, setWeekPortions] = useState(savedState?.weekPortions || {
    Lundi: 4,
    Mardi: 4,
    Mercredi: 4,
    Jeudi: 4,
    Vendredi: 4,
    Samedi: 4,
    Dimanche: 4
  })

  // New states for features
  const [favoriteRecipes, setFavoriteRecipes] = useState(() => new Set(savedState?.favorites || []))
  const [darkMode, setDarkMode] = useState(savedState?.darkMode || false)
  const [searchQuery, setSearchQuery] = useState('')
  const [proteinFilter, setProteinFilter] = useState('all')
  const [prepTimeFilter, setPrepTimeFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [ownedIngredients, setOwnedIngredients] = useState(() => new Set(savedState?.owned || []))
  const [portionMultipliers, setPortionMultipliers] = useState(savedState?.portions || {})
  const [recipesToPrint, setRecipesToPrint] = useState(new Set())

  // Save to localStorage when relevant state changes
  useEffect(() => {
    saveToStorage({
      selectedRecipes: [...selectedRecipes],
      weekPlan,
      weekPortions,
      favorites: [...favoriteRecipes],
      darkMode,
      owned: [...ownedIngredients],
      portions: portionMultipliers
    })
  }, [selectedRecipes, weekPlan, weekPortions, favoriteRecipes, darkMode, ownedIngredients, portionMultipliers])

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Auto-select all recipes for printing when entering cuisiner tab
  useEffect(() => {
    if (activeTab === 'cuisiner') {
      setRecipesToPrint(new Set(selectedRecipes))
    }
  }, [activeTab, selectedRecipes])

  const toggleRecipe = useCallback((num, event) => {
    if (event) event.stopPropagation()
    setSelectedRecipes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(num)) {
        newSet.delete(num)
      } else {
        newSet.add(num)
      }
      return newSet
    })
  }, [])

  const toggleFavorite = useCallback((num, event) => {
    if (event) event.stopPropagation()
    setFavoriteRecipes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(num)) {
        newSet.delete(num)
      } else {
        newSet.add(num)
      }
      return newSet
    })
  }, [])

  const toggleOwned = useCallback((ingredient) => {
    const normalized = normalizeIngredient(ingredient)
    setOwnedIngredients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(normalized)) {
        newSet.delete(normalized)
      } else {
        newSet.add(normalized)
      }
      return newSet
    })
  }, [])

  const updatePortions = useCallback((recipeNum, portions) => {
    setPortionMultipliers(prev => ({
      ...prev,
      [recipeNum]: portions / 4 // Base is 4 portions
    }))
  }, [])

  const selectAll = useCallback(() => {
    setSelectedRecipes(new Set(RECETTES.map(r => r.num)))
  }, [])

  const selectRandomWeek = useCallback(() => {
    // Shuffle and pick 7 random recipes
    const shuffled = [...RECETTES].sort(() => Math.random() - 0.5)
    const randomSeven = shuffled.slice(0, 7).map(r => r.num)
    setSelectedRecipes(new Set(randomSeven))
    // Apply selection filter to show only selected recipes
    setActiveFilter('selection')
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedRecipes(new Set())
    // Reset filter if currently filtering by selection
    if (activeFilter === 'selection') {
      setActiveFilter('all')
    }
  }, [activeFilter])

  // Filter recipes based on all active filters
  const filteredRecipes = RECETTES.filter(r => {
    // Region filter
    if (activeFilter === 'selection') {
      if (!selectedRecipes.has(r.num)) return false
    } else if (activeFilter === 'favoris') {
      if (!favoriteRecipes.has(r.num)) return false
    } else if (activeFilter !== 'all' && getRegion(r.origine) !== activeFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!r.nom.toLowerCase().includes(query) && !r.origine.toLowerCase().includes(query)) {
        return false
      }
    }

    // Protein filter
    if (proteinFilter !== 'all' && getProteinType(r) !== proteinFilter) {
      return false
    }

    // Prep time filter
    if (prepTimeFilter !== 'all' && getPrepCategory(r) !== prepTimeFilter) {
      return false
    }

    // Difficulty filter
    if (difficultyFilter !== 'all' && getDifficulty(r) !== difficultyFilter) {
      return false
    }

    return true
  })

  const updateMeal = useCallback((jour, value) => {
    setWeekPlan(prev => ({
      ...prev,
      [jour]: value ? parseInt(value) : null
    }))
  }, [])

  const updateWeekPortions = useCallback((jour, portions) => {
    setWeekPortions(prev => ({
      ...prev,
      [jour]: parseInt(portions)
    }))
  }, [])

  const autoFillWeek = useCallback(() => {
    const selected = Array.from(selectedRecipes)
    if (selected.length === 0) {
      alert('Veuillez d\'abord sélectionner des recettes dans l\'onglet "Sélection"')
      return
    }

    const jours = Object.keys(weekPlan)
    const newPlan = {}
    jours.forEach((jour, index) => {
      newPlan[jour] = selected[index % selected.length]
    })
    setWeekPlan(newPlan)
  }, [selectedRecipes, weekPlan])

  const clearWeek = useCallback(() => {
    setWeekPlan({
      Lundi: null,
      Mardi: null,
      Mercredi: null,
      Jeudi: null,
      Vendredi: null,
      Samedi: null,
      Dimanche: null
    })
  }, [])

  const getSelectedRecipesList = useCallback(() => {
    return RECETTES.filter(r => selectedRecipes.has(r.num))
  }, [selectedRecipes])

  const getCategorizedIngredients = useCallback(() => {
    const selected = getSelectedRecipesList()
    const categorized = {}
    const ingredientsByBase = {}

    // Trouver le multiplicateur de portions pour une recette
    const getRecipeMultiplier = (recetteNum) => {
      for (const [jour, num] of Object.entries(weekPlan)) {
        if (num === recetteNum) {
          const portions = weekPortions[jour] || 4
          return portions / 4 // Recettes sont pour 4 portions par défaut
        }
      }
      return 1 // Pas dans le plan = portions par défaut
    }

    // Première passe : regrouper par ingrédient de base avec mise à l'échelle
    selected.forEach(recette => {
      const multiplier = getRecipeMultiplier(recette.num)
      recette.ingredients.forEach(ing => {
        const baseIng = getBaseIngredient(ing)

        // Ignorer l'eau pure
        if (baseIng === 'eau') return

        // Mettre à l'échelle l'ingrédient si nécessaire
        const scaledIng = multiplier !== 1 ? scaleIngredient(ing, multiplier) : ing
        const category = categorizeIngredient(ing)

        if (!ingredientsByBase[category]) {
          ingredientsByBase[category] = {}
        }
        if (!ingredientsByBase[category][baseIng]) {
          ingredientsByBase[category][baseIng] = []
        }
        ingredientsByBase[category][baseIng].push(scaledIng)
      })
    })

    // Deuxième passe : créer l'affichage regroupé
    for (const [category, ingredients] of Object.entries(ingredientsByBase)) {
      if (!categorized[category]) {
        categorized[category] = new Set()
      }
      for (const [baseIng, variants] of Object.entries(ingredients)) {
        if (variants.length === 1) {
          // Un seul variant, on garde l'original
          categorized[category].add(variants[0])
        } else {
          // Plusieurs variants, on affiche le nom de base avec le compte
          const displayName = `${baseIng.charAt(0).toUpperCase() + baseIng.slice(1)} (${variants.length} recettes)`
          categorized[category].add(displayName)
        }
      }
    }

    return categorized
  }, [getSelectedRecipesList, weekPlan, weekPortions])

  const handlePrint = useCallback((area) => {
    const printArea = document.getElementById(`${area}-print-area`)
    if (printArea) {
      // Add print-target to both the print area and parent panel for compatibility
      const parentPanel = printArea.closest('.panel')
      printArea.classList.add('print-target')
      if (parentPanel) parentPanel.classList.add('print-target')

      window.print()

      printArea.classList.remove('print-target')
      if (parentPanel) parentPanel.classList.remove('print-target')
    }
  }, [])

  const regions = [
    { id: 'all', label: 'Toutes', count: RECETTES.length },
    { id: 'favoris', label: 'Favoris', count: favoriteRecipes.size, icon: '♥' },
    { id: 'Québec', label: 'Québec' },
    { id: 'Asie', label: 'Asie' },
    { id: 'Méditerranée', label: 'Méditerranée' },
    { id: 'Amérique', label: 'Amérique Latine' },
    { id: 'Afrique', label: 'Afrique & Caraïbes' },
    { id: 'Europe', label: 'Europe' }
  ]

  const proteinOptions = [
    { id: 'all', label: 'Toutes' },
    { id: 'poulet', label: 'Poulet' },
    { id: 'boeuf', label: 'Boeuf' },
    { id: 'porc', label: 'Porc' },
    { id: 'poisson', label: 'Poisson' },
    { id: 'vegetarien', label: 'Végétarien' }
  ]

  const prepTimeOptions = [
    { id: 'all', label: 'Tous' },
    { id: 'rapide', label: '≤15 min' },
    { id: 'moyen', label: '16-30 min' },
    { id: 'long', label: '>30 min' }
  ]

  const difficultyOptions = [
    { id: 'all', label: 'Toutes' },
    { id: 'facile', label: 'Facile' },
    { id: 'moyen', label: 'Moyen' },
    { id: 'difficile', label: 'Difficile' }
  ]

  return (
    <>
      <header>
        <div className="header-content">
          <div className="header-text">
            <h1>Carnet de Recettes</h1>
            <p>Cuisines du monde sans produits laitiers — équilibre parfait entre légumes, protéines et féculents (50%, 25%, 25%)</p>
          </div>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="container">
        <nav className="tabs">
          <button
            className={`tab-btn ${activeTab === 'selection' ? 'active' : ''}`}
            onClick={() => setActiveTab('selection')}
          >
            <span className="tab-icon">◈</span> Sélection
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <span className="tab-icon">◇</span> Planifier
          </button>
          <button
            className={`tab-btn ${activeTab === 'taches' ? 'active' : ''}`}
            onClick={() => setActiveTab('taches')}
          >
            <span className="tab-icon">○</span> Épicerie
          </button>
          <button
            className={`tab-btn ${activeTab === 'cuisiner' ? 'active' : ''}`}
            onClick={() => setActiveTab('cuisiner')}
          >
            <span className="tab-icon">◉</span> Cuisiner
          </button>
        </nav>

        {/* Panel Selection */}
        <div className={`panel ${activeTab === 'selection' ? 'active' : ''}`}>
          <div className="selection-count">
            <button
              className={`selection-count-btn ${activeFilter === 'selection' ? 'active' : ''}`}
              onClick={() => setActiveFilter(activeFilter === 'selection' ? 'all' : 'selection')}
              disabled={selectedRecipes.size === 0}
            >
              <strong>{selectedRecipes.size}</strong> recette{selectedRecipes.size > 1 ? 's' : ''} sélectionnée{selectedRecipes.size > 1 ? 's' : ''}
              {selectedRecipes.size > 0 && <span className="filter-hint">{activeFilter === 'selection' ? '✕' : '→ Filtrer'}</span>}
            </button>
            <div className="selection-buttons">
              <button className="btn btn-primary" onClick={selectRandomWeek}>
                🎲 Semaine aléatoire
              </button>
              <button className="btn btn-secondary" onClick={selectAll}>
                Tout sélectionner
              </button>
              <button className="btn btn-gray" onClick={deselectAll}>
                Effacer
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          {/* Region filters */}
          <div className="filters">
            {regions.map(region => (
              <button
                key={region.id}
                className={`filter-btn ${activeFilter === region.id ? 'active' : ''}`}
                data-region={region.id}
                onClick={() => setActiveFilter(region.id)}
              >
                {region.icon && <span className="filter-icon">{region.icon}</span>}
                {region.label}
                {region.count !== undefined && <span className="filter-count">{region.count}</span>}
              </button>
            ))}
          </div>

          {/* Additional filters */}
          <div className="filters-row">
            <div className="filter-group">
              <label>Protéine</label>
              <select value={proteinFilter} onChange={(e) => setProteinFilter(e.target.value)}>
                {proteinOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Temps</label>
              <select value={prepTimeFilter} onChange={(e) => setPrepTimeFilter(e.target.value)}>
                {prepTimeOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Difficulté</label>
              <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                {difficultyOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            {(proteinFilter !== 'all' || prepTimeFilter !== 'all' || difficultyFilter !== 'all') && (
              <button
                className="btn btn-gray btn-sm"
                onClick={() => {
                  setProteinFilter('all')
                  setPrepTimeFilter('all')
                  setDifficultyFilter('all')
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Results count */}
          {(searchQuery || proteinFilter !== 'all' || prepTimeFilter !== 'all' || difficultyFilter !== 'all') && (
            <div className="results-count">
              {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} trouvée{filteredRecipes.length > 1 ? 's' : ''}
            </div>
          )}

          <div className="recipes-grid">
            {filteredRecipes.map(recette => (
              <RecipeCard
                key={recette.num}
                recette={recette}
                isSelected={selectedRecipes.has(recette.num)}
                isFavorite={favoriteRecipes.has(recette.num)}
                onToggle={toggleRecipe}
                onToggleFavorite={toggleFavorite}
                onShowDetail={() => setDetailRecipe(recette)}
              />
            ))}
          </div>
        </div>

        {/* Panel Menu */}
        <div className={`panel ${activeTab === 'menu' ? 'active' : ''}`}>
          <div className="panel-header-row">
            <div>
              <h2 className="panel-title">Planifiez vos soupers</h2>
              <p className="panel-subtitle">Attribuez une recette à chaque jour de la semaine.</p>
            </div>
            <div className="panel-actions">
              <button className="btn btn-secondary" onClick={autoFillWeek}>
                Remplissage auto
              </button>
              <button className="btn btn-gray" onClick={clearWeek}>
                Réinitialiser
              </button>
            </div>
          </div>

          <WeekPlanner
            weekPlan={weekPlan}
            weekPortions={weekPortions}
            selectedRecipes={selectedRecipes}
            recettes={RECETTES}
            onUpdateMeal={updateMeal}
            onUpdatePortions={updateWeekPortions}
          />

          <div id="menu-print-area" className="menu-summary">
            <h3>Menu de la semaine</h3>
            <table className="menu-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Jour</th>
                  <th>Souper</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Portions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(weekPlan).map(([jour, recetteNum]) => {
                  const recette = recetteNum ? RECETTES.find(r => r.num === recetteNum) : null
                  const portions = weekPortions[jour] || 4
                  return (
                    <tr key={jour}>
                      <td><strong>{jour}</strong></td>
                      <td>
                        {recette
                          ? <span>#{recette.num} {recette.nom} <span style={{ color: 'var(--gris-clair)', fontSize: '0.85rem' }}>({recette.origine})</span></span>
                          : <span className="empty-slot">—</span>}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {recette ? portions : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="print-buttons">
              <button className="btn btn-primary" onClick={() => handlePrint('menu')}>
                Imprimer le menu
              </button>
            </div>
          </div>
        </div>

        {/* Panel Taches */}
        <div className={`panel ${activeTab === 'taches' ? 'active' : ''}`}>
          <TasksPanel
            selectedRecipes={getSelectedRecipesList()}
            categorizedIngredients={getCategorizedIngredients()}
            weekPlan={weekPlan}
            weekPortions={weekPortions}
            recettes={RECETTES}
            onPrint={handlePrint}
            ownedIngredients={ownedIngredients}
            onToggleOwned={toggleOwned}
          />
        </div>

        {/* Panel Cuisiner */}
        <div className={`panel ${activeTab === 'cuisiner' ? 'active' : ''}`}>
          <div className="panel-header-row">
            <div>
              <h2 className="panel-title">Cuisiner</h2>
              <p className="panel-subtitle">Sélectionnez les recettes à imprimer pour cuisiner.</p>
            </div>
            <div className="panel-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setRecipesToPrint(new Set(selectedRecipes))}
                disabled={selectedRecipes.size === 0}
              >
                Tout cocher
              </button>
              <button
                className="btn btn-gray"
                onClick={() => setRecipesToPrint(new Set())}
                disabled={recipesToPrint.size === 0}
              >
                Tout décocher
              </button>
            </div>
          </div>

          {selectedRecipes.size === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍🍳</div>
              <h3>Aucune recette sélectionnée</h3>
              <p>Retournez à l'onglet "Sélection" pour choisir vos recettes.</p>
            </div>
          ) : (
            <>
              <div className="cook-recipes-grid">
                {getSelectedRecipesList().map(recette => {
                  const isChecked = recipesToPrint.has(recette.num)
                  // Chercher les portions dans le plan de la semaine
                  let portions = 4
                  let jourAssigne = null
                  for (const [jour, num] of Object.entries(weekPlan)) {
                    if (num === recette.num) {
                      portions = weekPortions[jour] || 4
                      jourAssigne = jour
                      break
                    }
                  }
                  return (
                    <div
                      key={recette.num}
                      className={`cook-recipe-card ${isChecked ? 'checked' : ''}`}
                      onClick={() => {
                        setRecipesToPrint(prev => {
                          const newSet = new Set(prev)
                          if (newSet.has(recette.num)) {
                            newSet.delete(recette.num)
                          } else {
                            newSet.add(recette.num)
                          }
                          return newSet
                        })
                      }}
                    >
                      <input
                        type="checkbox"
                        className="cook-checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        aria-label={`Imprimer ${recette.nom}`}
                      />
                      <div className="cook-recipe-info">
                        <span className="cook-recipe-num">#{recette.num}</span>
                        <span className="cook-recipe-name">{recette.nom}</span>
                        <span className="cook-recipe-origin">{recette.origine}</span>
                        {jourAssigne && (
                          <span className="cook-recipe-portions">{jourAssigne} • {portions} portions</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="cook-print-section">
                <div className="cook-print-count">
                  <strong>{recipesToPrint.size}</strong> recette{recipesToPrint.size > 1 ? 's' : ''} à imprimer
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handlePrint('recipes')}
                  disabled={recipesToPrint.size === 0}
                >
                  Imprimer les recettes
                </button>
              </div>

              {/* Zone d'impression des recettes */}
              <div id="recipes-print-area" className="print-area recipes-print-area">
                {RECETTES.filter(r => recipesToPrint.has(r.num)).map(recette => {
                  // Chercher les portions dans le plan de la semaine
                  let portions = 4
                  for (const [jour, num] of Object.entries(weekPlan)) {
                    if (num === recette.num) {
                      portions = weekPortions[jour] || 4
                      break
                    }
                  }
                  const multiplier = portions / 4
                  return (
                    <div key={recette.num} className="print-recipe">
                      <h2>#{recette.num} {recette.nom}</h2>
                      <p className="print-recipe-origin">{recette.origine} • {portions} portions</p>

                      <div className="print-recipe-section">
                        <h3>Ingrédients</h3>
                        <ul>
                          {recette.ingredients.map((ing, i) => (
                            <li key={i}>{multiplier !== 1 ? scaleIngredient(ing, multiplier) : ing}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="print-recipe-section">
                        <h3>Préparation</h3>
                        <ol>
                          {recette.etapes.map((etape, i) => (
                            <li key={i}>{etape}</li>
                          ))}
                        </ol>
                      </div>

                      {recette.variantes && (
                        <div className="print-recipe-section">
                          <h3>Variantes</h3>
                          <p>{recette.variantes}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal detail recette */}
      {detailRecipe && (
        <RecipeDetail
          recette={detailRecipe}
          isSelected={selectedRecipes.has(detailRecipe.num)}
          isFavorite={favoriteRecipes.has(detailRecipe.num)}
          onClose={() => setDetailRecipe(null)}
          onToggle={toggleRecipe}
          onToggleFavorite={toggleFavorite}
          portions={Math.round((portionMultipliers[detailRecipe.num] || 1) * 4)}
          onUpdatePortions={updatePortions}
          scaleIngredient={scaleIngredient}
        />
      )}
    </>
  )
}

export default App
