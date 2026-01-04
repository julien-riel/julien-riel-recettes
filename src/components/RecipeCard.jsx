/**
 * Recipe card component for the grid view
 * @param {Object} props - Component props
 * @param {Object} props.recette - Recipe data
 * @param {boolean} props.isSelected - Whether the recipe is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onShowDetail - Show detail modal callback
 */
function RecipeCard({ recette, isSelected, onToggle, onShowDetail }) {
  const handleClick = (e) => {
    if (e.target.tagName !== 'INPUT') {
      onShowDetail()
    }
  }

  return (
    <div
      className={`recipe-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="header">
        <input
          type="checkbox"
          className="checkbox"
          checked={isSelected}
          onChange={(e) => onToggle(recette.num, e)}
        />
        <span className="num">{recette.num}</span>
        <span className="nom">{recette.nom}</span>
      </div>
      <div className="origine">{recette.origine} - {recette.portions} portions</div>
      <div className="description">{recette.description}</div>
      <div className="meta">
        <span>{recette.temps_prep_semaine}</span>
        <span>{recette.conservation.split('|')[0].trim()}</span>
      </div>
    </div>
  )
}

export default RecipeCard
