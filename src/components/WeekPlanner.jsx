/**
 * Week planner component for meal scheduling
 * @param {Object} props - Component props
 * @param {Object} props.weekPlan - Current week plan state
 * @param {Set} props.selectedRecipes - Set of selected recipe numbers
 * @param {Array} props.recettes - Array of all recipes
 * @param {Function} props.onUpdateMeal - Update meal callback
 */
function WeekPlanner({ weekPlan, selectedRecipes, recettes, onUpdateMeal }) {
  const jours = Object.keys(weekPlan)
  const selected = recettes.filter(r => selectedRecipes.has(r.num))
  const other = recettes.filter(r => !selectedRecipes.has(r.num))

  return (
    <div className="week-planner">
      {jours.map(jour => (
        <div key={jour} className="day-column">
          <div className="day-header">{jour}</div>
          <div className="day-content">
            <div className="meal-slot">
              <label>Souper</label>
              <select
                value={weekPlan[jour] || ''}
                onChange={(e) => onUpdateMeal(jour, e.target.value)}
              >
                <option value="">-- Choisir --</option>
                {selected.length > 0 && (
                  <optgroup label="Selectionnees">
                    {selected.map(r => (
                      <option key={r.num} value={r.num}>
                        #{r.num} {r.nom}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Autres recettes">
                  {other.map(r => (
                    <option key={r.num} value={r.num}>
                      #{r.num} {r.nom}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WeekPlanner
