/**
 * Week planner component for meal scheduling
 * @param {Object} props - Component props
 * @param {Object} props.weekPlan - Current week plan state
 * @param {Object} props.weekPortions - Portions per day
 * @param {Set} props.selectedRecipes - Set of selected recipe numbers
 * @param {Array} props.recettes - Array of all recipes
 * @param {Function} props.onUpdateMeal - Update meal callback
 * @param {Function} props.onUpdatePortions - Update portions callback
 * @param {Function} props.onShowDetail - Show recipe detail callback
 */
function WeekPlanner({ weekPlan, weekPortions = {}, selectedRecipes, recettes, onUpdateMeal, onUpdatePortions, onShowDetail }) {
  const jours = Object.keys(weekPlan)
  const selected = recettes.filter(r => selectedRecipes.has(r.num))
  const other = recettes.filter(r => !selectedRecipes.has(r.num))

  // Get recipes already used in other days
  const usedRecipes = Object.values(weekPlan).filter(v => v !== null)

  const jourLabels = {
    Lundi: { short: 'Lun', full: 'Lundi' },
    Mardi: { short: 'Mar', full: 'Mardi' },
    Mercredi: { short: 'Mer', full: 'Mercredi' },
    Jeudi: { short: 'Jeu', full: 'Jeudi' },
    Vendredi: { short: 'Ven', full: 'Vendredi' },
    Samedi: { short: 'Sam', full: 'Samedi' },
    Dimanche: { short: 'Dim', full: 'Dimanche' }
  }

  const isWeekend = (jour) => jour === 'Samedi' || jour === 'Dimanche'

  return (
    <div className="week-planner">
      {jours.map(jour => {
        const selectedRecipe = weekPlan[jour]
          ? recettes.find(r => r.num === weekPlan[jour])
          : null

        return (
          <div key={jour} className={`day-column ${isWeekend(jour) ? 'weekend' : ''}`}>
            <div className="day-header">
              <span className="day-short">{jourLabels[jour].short}</span>
              <span className="day-full">{jourLabels[jour].full}</span>
            </div>
            <div className="day-content">
              <div className="meal-slot">
                <label>Souper</label>
                <select
                  value={weekPlan[jour] || ''}
                  onChange={(e) => onUpdateMeal(jour, e.target.value)}
                  aria-label={`Sélectionner le souper pour ${jour}`}
                >
                  <option value="">— Choisir —</option>
                  {selected.length > 0 && (
                    <optgroup label="⭐ Sélectionnées">
                      {selected.map(r => {
                        const isUsedElsewhere = usedRecipes.includes(r.num) && weekPlan[jour] !== r.num
                        return (
                          <option key={r.num} value={r.num} disabled={isUsedElsewhere}>
                            #{r.num} {r.nom}{isUsedElsewhere ? ' (déjà planifié)' : ''}
                          </option>
                        )
                      })}
                    </optgroup>
                  )}
                  <optgroup label="Autres recettes">
                    {other.map(r => {
                      const isUsedElsewhere = usedRecipes.includes(r.num) && weekPlan[jour] !== r.num
                      return (
                        <option key={r.num} value={r.num} disabled={isUsedElsewhere}>
                          #{r.num} {r.nom}{isUsedElsewhere ? ' (déjà planifié)' : ''}
                        </option>
                      )
                    })}
                  </optgroup>
                </select>
                {selectedRecipe && (
                  <div className="selected-preview">
                    <button
                      className="preview-info"
                      onClick={() => onShowDetail && onShowDetail(selectedRecipe)}
                      aria-label={`Voir la recette ${selectedRecipe.nom}`}
                    >
                      <span className="preview-name">{selectedRecipe.nom}</span>
                      <span className="preview-origin">{selectedRecipe.origine}</span>
                    </button>
                    <div className="portions-selector">
                      <label>Portions:</label>
                      <select
                        value={weekPortions[jour] || 4}
                        onChange={(e) => onUpdatePortions(jour, e.target.value)}
                        aria-label={`Nombre de portions pour ${jour}`}
                      >
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="6">6</option>
                        <option value="8">8</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WeekPlanner
