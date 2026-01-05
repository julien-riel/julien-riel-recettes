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
 * @param {Array} props.customItems - Array of custom items {text, category}
 * @param {Function} props.onAddCustomItem - Add custom item callback
 * @param {Function} props.onRemoveCustomItem - Remove custom item callback
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
  onShowDetail,
  customItems = [],
  onAddCustomItem,
  onRemoveCustomItem
}) {
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [newItemText, setNewItemText] = useState('')

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

  // Merge categorizedIngredients with customItems
  const mergedIngredients = { ...categorizedIngredients }
  customItems.forEach((item, index) => {
    if (!mergedIngredients[item.category]) {
      mergedIngredients[item.category] = new Set()
    }
    // Store custom items with a special marker to identify them
    mergedIngredients[item.category].add(`__custom__${index}__${item.text}`)
  })

  // Helper to extract display text from an item (handles custom items)
  const getDisplayText = (item) => {
    if (item.startsWith('__custom__')) {
      return item.replace(/^__custom__\d+__/, '')
    }
    return item
  }

  // Helper to check if an item is custom
  const isCustomItem = (item) => item.startsWith('__custom__')

  // Helper to get custom item index
  const getCustomItemIndex = (item) => {
    const match = item.match(/^__custom__(\d+)__/)
    return match ? parseInt(match[1]) : -1
  }

  // Count items to buy (not owned and not purchased)
  const itemsToBuy = Object.values(mergedIngredients)
    .reduce((acc, set) => {
      if (!set) return acc
      return acc + Array.from(set).filter(item => {
        const displayText = getDisplayText(item)
        const normalized = normalizeIngredient(displayText)
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
      const items = mergedIngredients[key]
      if (!items || items.size === 0) return

      Array.from(items)
        .filter(item => {
          const displayText = getDisplayText(item)
          const normalized = normalizeIngredient(displayText)
          return !ownedIngredients.has(normalized) && !purchasedItems.has(normalized)
        })
        .sort((a, b) => getDisplayText(a).localeCompare(getDisplayText(b)))
        .forEach(item => lines.push(getDisplayText(item)))
    })

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  /**
   * Handles adding a new custom item
   */
  const handleAddItem = (e) => {
    e.preventDefault()
    if (newItemText.trim()) {
      onAddCustomItem(newItemText)
      setNewItemText('')
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

        {/* Ajouter un item personnalisé */}
        <form className="add-item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            className="add-item-input"
            placeholder="Ajouter un item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            aria-label="Ajouter un item à la liste d'épicerie"
          />
          <button
            type="submit"
            className="add-item-btn"
            disabled={!newItemText.trim()}
            aria-label="Ajouter"
          >
            <span className="add-item-icon">+</span>
          </button>
        </form>

        <div className="grocery-grid">
          {orderedCategories.map(({ key, icon }) => {
            const items = mergedIngredients[key]
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
                    const aText = getDisplayText(a)
                    const bText = getDisplayText(b)
                    const aNorm = normalizeIngredient(aText)
                    const bNorm = normalizeIngredient(bText)
                    // Sort: not checked first, then owned, then purchased
                    const aOwned = ownedIngredients.has(aNorm)
                    const bOwned = ownedIngredients.has(bNorm)
                    const aPurchased = purchasedItems.has(aNorm)
                    const bPurchased = purchasedItems.has(bNorm)
                    const aChecked = aOwned || aPurchased
                    const bChecked = bOwned || bPurchased
                    if (aChecked && !bChecked) return 1
                    if (!aChecked && bChecked) return -1
                    return aText.localeCompare(bText)
                  }).map((item, i) => {
                    const displayText = getDisplayText(item)
                    const isCustom = isCustomItem(item)
                    const customIndex = getCustomItemIndex(item)
                    const normalized = normalizeIngredient(displayText)
                    const isOwned = ownedIngredients.has(normalized)
                    const isPurchased = purchasedItems.has(normalized)
                    const isChecked = shoppingMode ? isPurchased : isOwned
                    const onToggle = shoppingMode ? onTogglePurchased : onToggleOwned

                    return (
                      <li key={i} className={`${isOwned || isPurchased ? 'owned' : ''} ${isCustom ? 'custom-item' : ''}`}>
                        <input
                          type="checkbox"
                          className="owned-checkbox"
                          checked={isChecked}
                          onChange={() => onToggle(displayText)}
                          aria-label={shoppingMode
                            ? `Marquer ${displayText} comme acheté`
                            : `Marquer ${displayText} comme déjà à la maison`}
                        />
                        <span className={`item-text ${isOwned || isPurchased ? 'strikethrough' : ''}`}>
                          {displayText}
                        </span>
                        {isCustom && (
                          <button
                            className="remove-custom-btn"
                            onClick={() => onRemoveCustomItem(customIndex)}
                            aria-label={`Supprimer ${displayText}`}
                            title="Supprimer"
                          >
                            ×
                          </button>
                        )}
                        {isOwned && !shoppingMode && !isCustom && (
                          <span className="owned-badge">à la maison</span>
                        )}
                        {isPurchased && shoppingMode && !isCustom && (
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
