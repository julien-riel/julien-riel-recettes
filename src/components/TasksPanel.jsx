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
    'Viandes & Poissons',
    'Legumes frais',
    'Herbes fraiches',
    'Feculents',
    'Legumineuses & Proteines vegetales',
    'Conserves & Sauces',
    'Epices & Condiments',
    'Huiles & Matieres grasses',
    'Autres'
  ]

  return (
    <>
      <h2 className="panel-title">Liste des taches et epicerie</h2>
      <p className="panel-subtitle">Basees sur les recettes selectionnees</p>

      <div className="actions" style={{ marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={onShowTasks}>
          Generer les taches
        </button>
        <button className="btn btn-orange" onClick={onShowGrocery}>
          Generer la liste d'epicerie
        </button>
      </div>

      {/* Zone taches */}
      <div id="tasks-print-area" className={`print-area ${tasksPrintVisible ? 'visible' : ''}`}>
        <h2>Preparation du week-end</h2>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          Taches a realiser pour preparer vos repas de la semaine
        </p>
        <ul className="task-list">
          {selectedRecipes.length === 0 ? (
            <li>Aucune recette selectionnee. Allez dans l'onglet "Selection" pour choisir vos recettes.</li>
          ) : (
            selectedRecipes.map(recette => (
              <li key={recette.num}>
                <span className="task-check">[ ]</span>
                <div>
                  <div className="recipe-name">#{recette.num} {recette.nom}</div>
                  <div>{recette.prep_weekend}</div>
                  <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                    Temps: {recette.temps_prep_weekend} - {recette.conservation}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="print-buttons">
          <button className="btn btn-primary" onClick={() => onPrint('tasks')}>
            Imprimer les taches
          </button>
        </div>
      </div>

      {/* Zone epicerie */}
      <div id="grocery-print-area" className={`print-area ${groceryPrintVisible ? 'visible' : ''}`}>
        <h2>Liste d'epicerie</h2>
        <p style={{ marginBottom: '15px', color: '#666' }}>
          Ingredients pour <span>{selectedRecipes.length}</span> recette(s) selectionnee(s)
        </p>
        <div>
          {selectedRecipes.length === 0 ? (
            <p>Aucune recette selectionnee. Allez dans l'onglet "Selection" pour choisir vos recettes.</p>
          ) : (
            orderedCategories.map(category => {
              const items = categorizedIngredients[category]
              if (!items || items.size === 0) return null
              return (
                <div key={category} className="grocery-section">
                  <h3>{category}</h3>
                  <ul className="grocery-list">
                    {Array.from(items).sort().map((item, i) => (
                      <li key={i}>
                        <span className="check-box">[ ]</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })
          )}
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
