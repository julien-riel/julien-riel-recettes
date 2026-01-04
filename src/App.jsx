import { useState, useCallback } from 'react'
import { RECETTES } from './data/recettes'
import { REGIONS } from './data/regions'
import { CATEGORIES_INGREDIENTS } from './data/categories'
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
 * @param {string} ingredient - The ingredient to categorize
 * @returns {string} The category name
 */
function categorizeIngredient(ingredient) {
  const lower = ingredient.toLowerCase()

  for (const [category, keywords] of Object.entries(CATEGORIES_INGREDIENTS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return category
      }
    }
  }
  return 'Autres'
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

    selected.forEach(recette => {
      recette.ingredients.forEach(ing => {
        const category = categorizeIngredient(ing)
        if (!categorized[category]) {
          categorized[category] = new Set()
        }
        categorized[category].add(ing)
      })
    })

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

  return (
    <>
      <header>
        <h1>Planificateur de Repas</h1>
        <p>60 recettes sante - Sans produits laitiers - 50% legumes / 25% proteines / 25% feculents</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'selection' ? 'active' : ''}`}
            onClick={() => setActiveTab('selection')}
          >
            Selection des recettes
          </button>
          <button
            className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Planifier la semaine
          </button>
          <button
            className={`tab-btn ${activeTab === 'taches' ? 'active' : ''}`}
            onClick={() => setActiveTab('taches')}
          >
            Taches & Epicerie
          </button>
        </div>

        {/* Panel Selection */}
        <div className={`panel ${activeTab === 'selection' ? 'active' : ''}`}>
          <div className="selection-count">
            <span><strong>{selectedRecipes.size}</strong> recette(s) selectionnee(s)</span>
            <div className="selection-buttons">
              <button className="btn btn-secondary" onClick={selectAll}>
                Tout selectionner
              </button>
              <button className="btn btn-gray" onClick={deselectAll}>
                Tout deselectionner
              </button>
            </div>
          </div>

          <div className="filters">
            <button
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Toutes ({RECETTES.length})
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Quebec' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Quebec')}
            >
              Quebec
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Asie' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Asie')}
            >
              Asie
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Mediterranee' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Mediterranee')}
            >
              Mediterranee
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Amerique' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Amerique')}
            >
              Amerique Latine
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Afrique' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Afrique')}
            >
              Afrique / Caraibes
            </button>
            <button
              className={`filter-btn ${activeFilter === 'Europe' ? 'active' : ''}`}
              onClick={() => setActiveFilter('Europe')}
            >
              Europe
            </button>
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
          <h2 className="panel-title">Planifier vos soupers de la semaine</h2>
          <p className="panel-subtitle">Selectionnez une recette pour chaque jour de la semaine.</p>

          <WeekPlanner
            weekPlan={weekPlan}
            selectedRecipes={selectedRecipes}
            recettes={RECETTES}
            onUpdateMeal={updateMeal}
          />

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setMenuPrintVisible(true)}>
              Generer le menu
            </button>
            <button className="btn btn-secondary" onClick={autoFillWeek}>
              Remplir automatiquement
            </button>
            <button className="btn btn-gray" onClick={clearWeek}>
              Effacer
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
