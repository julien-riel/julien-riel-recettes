import { useState } from 'react'
import { normalizeIngredient } from '../data/categories'

/**
 * Tasks and grocery panel component
 * @param {Object} props - Component props
 * @param {Array} props.selectedRecipes - Array of selected recipes
 * @param {Object} props.categorizedIngredients - Ingredients organized by category
 * @param {Object} props.weekPlan - Week plan with day -> recipe num mapping
 * @param {Object} props.weekPortions - Portions per day
 * @param {Array} props.recettes - All recipes
 * @param {Function} props.onPrint - Print callback
 * @param {Set} props.ownedIngredients - Set of owned ingredient names
 * @param {Function} props.onToggleOwned - Toggle owned ingredient callback
 * @param {boolean} props.shoppingMode - Whether in shopping mode
 * @param {Function} props.onToggleShoppingMode - Toggle shopping mode callback
 * @param {Set} props.purchasedItems - Set of purchased item names
 * @param {Function} props.onTogglePurchased - Toggle purchased item callback
 * @param {Function} props.onShowDetail - Show recipe detail callback
 */
function TasksPanel({
  selectedRecipes,
  categorizedIngredients,
  weekPlan = {},
  weekPortions = {},
  recettes = [],
  onPrint,
  ownedIngredients = new Set(),
  onToggleOwned,
  shoppingMode = false,
  onToggleShoppingMode,
  purchasedItems = new Set(),
  onTogglePurchased,
  onShowDetail
}) {
  const [copyFeedback, setCopyFeedback] = useState(false)

  const orderedCategories = [
    { key: 'Viandes & Poissons', icon: '🥩' },
    { key: 'Œufs & Produits frais', icon: '🥚' },
    { key: 'Légumes frais', icon: '🥬' },
    { key: 'Fruits', icon: '🍎' },
    { key: 'Herbes fraîches', icon: '🌿' },
    { key: 'Féculents', icon: '🍚' },
    { key: 'Légumineuses & Protéines végétales', icon: '🫘' },
    { key: 'Conserves & Sauces', icon: '🥫' },
    { key: 'Épices & Condiments', icon: '🧂' },
    { key: 'Huiles & Matières grasses', icon: '🫒' },
    { key: 'Autres', icon: '📦' }
  ]

  // Count items to buy (not owned and not purchased)
  const itemsToBuy = Object.values(categorizedIngredients)
    .reduce((acc, set) => {
      if (!set) return acc
      return acc + Array.from(set).filter(item => {
        const normalized = normalizeIngredient(item)
        return !ownedIngredients.has(normalized) && !purchasedItems.has(normalized)
      }).length
    }, 0)

  /**
   * Copies the grocery list to clipboard for iPhone Reminders
   * Excludes items marked as "owned" or "purchased"
   */
  const copyGroceryList = async () => {
    const lines = []

    orderedCategories.forEach(({ key }) => {
      const items = categorizedIngredients[key]
      if (!items || items.size === 0) return

      Array.from(items)
        .filter(item => {
          const normalized = normalizeIngredient(item)
          return !ownedIngredients.has(normalized) && !purchasedItems.has(normalized)
        })
        .sort((a, b) => a.localeCompare(b))
        .forEach(item => lines.push(item))
    })

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  return (
    <>
      <h2 className="panel-title">Préparation & Épicerie</h2>
      <p className="panel-subtitle">
        Organisez vos achats et votre préparation du week-end
      </p>

      {selectedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Aucun menu planifié</h3>
          <p>Retournez à l'onglet "Planifier" pour créer votre menu de la semaine.</p>
        </div>
      ) : (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{selectedRecipes.length}</span>
              <span className="stat-label">Recette{selectedRecipes.length > 1 ? 's' : ''}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{itemsToBuy}</span>
              <span className="stat-label">À acheter</span>
            </div>
          </div>
        </>
      )}

      {/* Zone tâches */}
      {selectedRecipes.length > 0 && (
      <div id="tasks-print-area" className="print-area visible">
        <h2>Préparation du week-end</h2>
        <p className="print-subtitle">
          {selectedRecipes.length} recette{selectedRecipes.length > 1 ? 's' : ''} à préparer
        </p>
        <ul className="task-list">
          {selectedRecipes.map(recette => (
            <li key={recette.num}>
              <span className="task-check"></span>
              <div className="task-content">
                <button
                  className="recipe-name-btn"
                  onClick={() => onShowDetail && onShowDetail(recette)}
                  aria-label={`Voir la recette ${recette.nom}`}
                >
                  #{recette.num} {recette.nom}
                </button>
                <div className="task-description">{recette.prep_weekend}</div>
                <div className="task-meta">
                  <span>⏱ {recette.temps_prep_weekend}</span>
                  <span>📦 {recette.conservation}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="print-buttons">
          <button className="btn btn-primary" onClick={() => onPrint('tasks')}>
            🖨️ Imprimer les tâches
          </button>
        </div>
      </div>
      )}

      {/* Zone épicerie */}
      {selectedRecipes.length > 0 && (
      <div id="grocery-print-area" className="print-area visible">
        <div className="grocery-header">
          <div>
            <h2>Liste d'épicerie</h2>
            <p className="print-subtitle">
              {itemsToBuy} ingrédient{itemsToBuy > 1 ? 's' : ''} à acheter
            </p>
          </div>
          <button
            className={`btn ${shoppingMode ? 'btn-primary shopping-active' : 'btn-secondary'}`}
            onClick={onToggleShoppingMode}
          >
            {shoppingMode ? '✅ À l\'épicerie' : '🛒 À l\'épicerie'}
          </button>
        </div>

        {/* Mini menu de la semaine */}
        {Object.values(weekPlan).some(v => v !== null) && (
          <div className="week-menu-summary">
            {Object.entries(weekPlan).map(([jour, recetteNum]) => {
              const recette = recetteNum ? recettes.find(r => r.num === recetteNum) : null
              const portions = weekPortions[jour] || 4
              return (
                <div key={jour} className="week-menu-item">
                  <span className="week-menu-day">{jour.slice(0, 3)}</span>
                  {recette ? (
                    <button
                      className="week-menu-recipe-btn"
                      onClick={() => onShowDetail && onShowDetail(recette)}
                      aria-label={`Voir la recette ${recette.nom}`}
                    >
                      {recette.nom} ({portions} p.)
                    </button>
                  ) : (
                    <span className="week-menu-recipe">—</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="grocery-grid">
          {orderedCategories.map(({ key, icon }) => {
            const items = categorizedIngredients[key]
            if (!items || items.size === 0) return null
            return (
              <div key={key} className="grocery-section">
                <h3>
                  <span className="category-icon">{icon}</span>
                  {key}
                  <span className="category-count">{items.size}</span>
                </h3>
                <ul className="grocery-list">
                  {Array.from(items).sort((a, b) => {
                    const aNorm = normalizeIngredient(a)
                    const bNorm = normalizeIngredient(b)
                    // Sort: not checked first, then owned, then purchased
                    const aOwned = ownedIngredients.has(aNorm)
                    const bOwned = ownedIngredients.has(bNorm)
                    const aPurchased = purchasedItems.has(aNorm)
                    const bPurchased = purchasedItems.has(bNorm)
                    const aChecked = aOwned || aPurchased
                    const bChecked = bOwned || bPurchased
                    if (aChecked && !bChecked) return 1
                    if (!aChecked && bChecked) return -1
                    return a.localeCompare(b)
                  }).map((item, i) => {
                    const normalized = normalizeIngredient(item)
                    const isOwned = ownedIngredients.has(normalized)
                    const isPurchased = purchasedItems.has(normalized)
                    const isChecked = shoppingMode ? isPurchased : isOwned
                    const onToggle = shoppingMode ? onTogglePurchased : onToggleOwned

                    return (
                      <li key={i} className={isOwned || isPurchased ? 'owned' : ''}>
                        <input
                          type="checkbox"
                          className="owned-checkbox"
                          checked={isChecked}
                          onChange={() => onToggle(item)}
                          aria-label={shoppingMode
                            ? `Marquer ${item} comme acheté`
                            : `Marquer ${item} comme déjà à la maison`}
                        />
                        <span className={`item-text ${isOwned || isPurchased ? 'strikethrough' : ''}`}>
                          {item}
                        </span>
                        {isOwned && !shoppingMode && (
                          <span className="owned-badge">à la maison</span>
                        )}
                        {isPurchased && shoppingMode && (
                          <span className="owned-badge purchased">acheté</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="print-buttons">
          <button className="btn btn-primary" onClick={() => onPrint('grocery')}>
            🖨️ Imprimer la liste
          </button>
          <button className="btn btn-secondary" onClick={copyGroceryList}>
            {copyFeedback ? '✅ Copié!' : '📋 Copier pour Rappels'}
          </button>
        </div>
      </div>
      )}
    </>
  )
}

export default TasksPanel
