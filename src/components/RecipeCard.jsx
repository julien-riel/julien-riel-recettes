/**
 * Recipe card component for the grid view
 * @param {Object} props - Component props
 * @param {Object} props.recette - Recipe data
 * @param {boolean} props.isSelected - Whether the recipe is selected
 * @param {boolean} props.isFavorite - Whether the recipe is a favorite
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onToggleFavorite - Toggle favorite callback
 * @param {Function} props.onShowDetail - Show detail modal callback
 */
function RecipeCard({ recette, isSelected, isFavorite, onToggle, onToggleFavorite, onShowDetail }) {
  const handleClick = (e) => {
    if (e.target.tagName !== 'INPUT' && !e.target.classList.contains('favorite-btn')) {
      onShowDetail()
    }
  }

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onToggleFavorite(recette.num, e)
  }

  const getRegionIcon = (origine) => {
    const iconMap = {
      'Thaïlande': '◆',
      'Corée': '◇',
      'Japon': '●',
      'Vietnam': '○',
      'Indonésie': '■',
      'Maroc': '▲',
      'Grèce': '◆',
      'Liban': '◇',
      'Israël': '●',
      'Mexique': '▲',
      'Brésil': '■',
      'Venezuela': '◆',
      'Pérou': '◇',
      'Inde': '●',
      'Sénégal': '▲',
      'Éthiopie': '■',
      'Jamaïque': '◆',
      'Antilles': '◇',
      'Espagne': '●',
      'Québec': '❖',
      'France': '◆',
      'Italie': '■'
    }
    return iconMap[origine] || '◈'
  }

  return (
    <div
      className={`recipe-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <button
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <div className="header">
        <input
          type="checkbox"
          className="checkbox"
          checked={isSelected}
          onChange={(e) => onToggle(recette.num, e)}
          aria-label={`Sélectionner ${recette.nom}`}
        />
        <span className="num">{recette.num}</span>
        <span className="nom">{recette.nom}</span>
      </div>
      <div className="origine">
        <span className="origine-icon">{getRegionIcon(recette.origine)}</span>
        {recette.origine} • {recette.portions} portions
      </div>
      <div className="description">{recette.description}</div>
      <div className="meta">
        <span title="Temps de préparation">{recette.temps_prep_semaine}</span>
        <span title="Conservation">{recette.conservation.split('|')[0].trim()}</span>
      </div>
    </div>
  )
}

export default RecipeCard
