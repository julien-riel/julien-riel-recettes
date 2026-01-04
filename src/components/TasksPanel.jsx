/**
 * Tasks and grocery panel component
 * @param {Object} props - Component props
 * @param {Array} props.selectedRecipes - Array of selected recipes
 * @param {Object} props.categorizedIngredients - Ingredients organized by category
 * @param {boolean} props.tasksPrintVisible - Whether tasks print area is visible
 * @param {boolean} props.groceryPrintVisible - Whether grocery print area is visible
 * @param {Function} props.onShowTasks - Show tasks callback
 * @param {Function} props.onShowGrocery - Show grocery callback
 * @param {Function} props.onPrint - Print callback
 */
function TasksPanel({
  selectedRecipes,
  categorizedIngredients,
  tasksPrintVisible,
  groceryPrintVisible,
  onShowTasks,
  onShowGrocery,
  onPrint
}) {
  const orderedCategories = [
    { key: 'Viandes & Poissons', icon: '▣' },
    { key: 'Œufs & Produits frais', icon: '○' },
    { key: 'Légumes frais', icon: '◆' },
    { key: 'Fruits', icon: '◇' },
    { key: 'Herbes fraîches', icon: '✦' },
    { key: 'Féculents', icon: '■' },
    { key: 'Légumineuses & Protéines végétales', icon: '●' },
    { key: 'Conserves & Sauces', icon: '▲' },
    { key: 'Épices & Condiments', icon: '✧' },
    { key: 'Huiles & Matières grasses', icon: '◈' },
    { key: 'Autres', icon: '□' }
  ]

  const totalIngredients = Object.values(categorizedIngredients)
    .reduce((acc, set) => acc + (set?.size || 0), 0)

  return (
    <>
      <h2 className="panel-title">Préparation & Épicerie</h2>
      <p className="panel-subtitle">
        Organisez vos achats et votre préparation du week-end
      </p>

      {selectedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Aucune recette sélectionnée</h3>
          <p>Retournez à l'onglet "Sélection" pour choisir vos recettes de la semaine.</p>
        </div>
      ) : (
        <>
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{selectedRecipes.length}</span>
              <span className="stat-label">Recette{selectedRecipes.length > 1 ? 's' : ''}</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{totalIngredients}</span>
              <span className="stat-label">Ingrédient{totalIngredients > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="actions" style={{ marginBottom: '24px', marginTop: '8px' }}>
            <button className="btn btn-primary" onClick={onShowTasks}>
              Voir les tâches
            </button>
            <button className="btn btn-orange" onClick={onShowGrocery}>
              Liste d'épicerie
            </button>
          </div>
        </>
      )}

      {/* Zone tâches */}
      <div id="tasks-print-area" className={`print-area ${tasksPrintVisible ? 'visible' : ''}`}>
        <h2>Préparation du week-end</h2>
        <p className="print-subtitle">
          {selectedRecipes.length} recette{selectedRecipes.length > 1 ? 's' : ''} à préparer
        </p>
        <ul className="task-list">
          {selectedRecipes.map(recette => (
            <li key={recette.num}>
              <span className="task-check"></span>
              <div className="task-content">
                <div className="recipe-name">#{recette.num} {recette.nom}</div>
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
            Imprimer les tâches
          </button>
        </div>
      </div>

      {/* Zone épicerie */}
      <div id="grocery-print-area" className={`print-area ${groceryPrintVisible ? 'visible' : ''}`}>
        <h2>Liste d'épicerie</h2>
        <p className="print-subtitle">
          {totalIngredients} ingrédient{totalIngredients > 1 ? 's' : ''} pour {selectedRecipes.length} recette{selectedRecipes.length > 1 ? 's' : ''}
        </p>
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
                  {Array.from(items).sort().map((item, i) => (
                    <li key={i}>
                      <span className="check-box">☐</span>
                      <span className="item-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="print-buttons">
          <button className="btn btn-primary" onClick={() => onPrint('grocery')}>
            Imprimer la liste
          </button>
        </div>
      </div>
    </>
  )
}

export default TasksPanel
