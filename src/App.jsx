import { useState, useCallback } from 'react'
import { RECETTES } from './data/recettes'
import { REGIONS } from './data/regions'
import { CATEGORIES_INGREDIENTS, getBaseIngredient } from './data/categories'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import WeekPlanner from './components/WeekPlanner'
import TasksPanel from './components/TasksPanel'

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
  const [activeTab, setActiveTab] = useState('selection')
  const [selectedRecipes, setSelectedRecipes] = useState(new Set())
  const [activeFilter, setActiveFilter] = useState('all')
  const [detailRecipe, setDetailRecipe] = useState(null)
  const [weekPlan, setWeekPlan] = useState({
    Lundi: null,
    Mardi: null,
    Mercredi: null,
    Jeudi: null,
    Vendredi: null,
    Samedi: null,
    Dimanche: null
  })
  const [menuPrintVisible, setMenuPrintVisible] = useState(false)
  const [tasksPrintVisible, setTasksPrintVisible] = useState(false)
  const [groceryPrintVisible, setGroceryPrintVisible] = useState(false)

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

  const selectAll = useCallback(() => {
    setSelectedRecipes(new Set(RECETTES.map(r => r.num)))
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedRecipes(new Set())
  }, [])

  const filteredRecipes = activeFilter === 'all'
    ? RECETTES
    : RECETTES.filter(r => getRegion(r.origine) === activeFilter)

  const updateMeal = useCallback((jour, value) => {
    setWeekPlan(prev => ({
      ...prev,
      [jour]: value ? parseInt(value) : null
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

    // Première passe : regrouper par ingrédient de base
    selected.forEach(recette => {
      recette.ingredients.forEach(ing => {
        const baseIng = getBaseIngredient(ing)

        // Ignorer l'eau pure
        if (baseIng === 'eau') return

        const category = categorizeIngredient(ing)

        if (!ingredientsByBase[category]) {
          ingredientsByBase[category] = {}
        }
        if (!ingredientsByBase[category][baseIng]) {
          ingredientsByBase[category][baseIng] = []
        }
        ingredientsByBase[category][baseIng].push(ing)
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
  }, [getSelectedRecipesList])

  const handlePrint = useCallback((area) => {
    const printArea = document.getElementById(`${area}-print-area`)
    if (printArea) {
      printArea.classList.add('print-target')
      window.print()
      printArea.classList.remove('print-target')
    }
  }, [])

  const regions = [
    { id: 'all', label: 'Toutes', count: RECETTES.length },
    { id: 'Québec', label: 'Québec' },
    { id: 'Asie', label: 'Asie' },
    { id: 'Méditerranée', label: 'Méditerranée' },
    { id: 'Amérique', label: 'Amérique Latine' },
    { id: 'Afrique', label: 'Afrique & Caraïbes' },
    { id: 'Europe', label: 'Europe' }
  ]

  return (
    <>
      <header>
        <h1>Carnet de Recettes</h1>
        <p>Cuisines du monde sans produits laitiers — équilibre parfait entre légumes, protéines et féculents</p>
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
        </nav>

        {/* Panel Selection */}
        <div className={`panel ${activeTab === 'selection' ? 'active' : ''}`}>
          <div className="selection-count">
            <span><strong>{selectedRecipes.size}</strong> recette{selectedRecipes.size > 1 ? 's' : ''} sélectionnée{selectedRecipes.size > 1 ? 's' : ''}</span>
            <div className="selection-buttons">
              <button className="btn btn-secondary" onClick={selectAll}>
                Tout sélectionner
              </button>
              <button className="btn btn-gray" onClick={deselectAll}>
                Effacer la sélection
              </button>
            </div>
          </div>

          <div className="filters">
            {regions.map(region => (
              <button
                key={region.id}
                className={`filter-btn ${activeFilter === region.id ? 'active' : ''}`}
                data-region={region.id}
                onClick={() => setActiveFilter(region.id)}
              >
                {region.label}
                {region.count && <span className="filter-count">{region.count}</span>}
              </button>
            ))}
          </div>

          <div className="recipes-grid">
            {filteredRecipes.map(recette => (
              <RecipeCard
                key={recette.num}
                recette={recette}
                isSelected={selectedRecipes.has(recette.num)}
                onToggle={toggleRecipe}
                onShowDetail={() => setDetailRecipe(recette)}
              />
            ))}
          </div>
        </div>

        {/* Panel Menu */}
        <div className={`panel ${activeTab === 'menu' ? 'active' : ''}`}>
          <h2 className="panel-title">Planifiez vos soupers</h2>
          <p className="panel-subtitle">Attribuez une recette à chaque jour de la semaine pour créer votre menu personnalisé.</p>

          <WeekPlanner
            weekPlan={weekPlan}
            selectedRecipes={selectedRecipes}
            recettes={RECETTES}
            onUpdateMeal={updateMeal}
          />

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setMenuPrintVisible(true)}>
              Générer le menu
            </button>
            <button className="btn btn-secondary" onClick={autoFillWeek}>
              Remplissage automatique
            </button>
            <button className="btn btn-gray" onClick={clearWeek}>
              Réinitialiser
            </button>
          </div>

          <div id="menu-print-area" className={`print-area ${menuPrintVisible ? 'visible' : ''}`}>
            <h2>Menu de la semaine</h2>
            <table className="menu-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>Jour</th>
                  <th>Souper</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(weekPlan).map(([jour, recetteNum]) => {
                  const recette = recetteNum ? RECETTES.find(r => r.num === recetteNum) : null
                  return (
                    <tr key={jour}>
                      <td><strong>{jour}</strong></td>
                      <td>
                        {recette
                          ? <span>#{recette.num} {recette.nom} <span style={{ color: '#666', fontSize: '0.85rem' }}>({recette.origine})</span></span>
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="print-buttons">
              <button className="btn btn-primary" onClick={() => handlePrint('menu')}>
                Imprimer
              </button>
            </div>
          </div>
        </div>

        {/* Panel Taches */}
        <div className={`panel ${activeTab === 'taches' ? 'active' : ''}`}>
          <TasksPanel
            selectedRecipes={getSelectedRecipesList()}
            categorizedIngredients={getCategorizedIngredients()}
            tasksPrintVisible={tasksPrintVisible}
            groceryPrintVisible={groceryPrintVisible}
            onShowTasks={() => setTasksPrintVisible(true)}
            onShowGrocery={() => setGroceryPrintVisible(true)}
            onPrint={handlePrint}
          />
        </div>
      </div>

      {/* Modal detail recette */}
      {detailRecipe && (
        <RecipeDetail
          recette={detailRecipe}
          isSelected={selectedRecipes.has(detailRecipe.num)}
          onClose={() => setDetailRecipe(null)}
          onToggle={toggleRecipe}
        />
      )}
    </>
  )
}

export default App
