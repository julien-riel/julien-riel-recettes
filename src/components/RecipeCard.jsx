import * as Flags from 'country-flag-icons/react/3x2'

/**
 * Country code mapping for flag display
 */
const COUNTRY_CODES = {
  'Thaïlande': 'TH',
  'Corée': 'KR',
  'Corée du Sud': 'KR',
  'Japon': 'JP',
  'Vietnam': 'VN',
  'Indonésie': 'ID',
  'Maroc': 'MA',
  'Grèce': 'GR',
  'Liban': 'LB',
  'Israël': 'IL',
  'Israël / Maghreb': 'IL',
  'Mexique': 'MX',
  'Mexique / USA': 'MX',
  'Brésil': 'BR',
  'Venezuela': 'VE',
  'Pérou': 'PE',
  'Inde': 'IN',
  'Inde / Royaume-Uni': 'IN',
  'Sénégal': 'SN',
  'Éthiopie': 'ET',
  'Jamaïque': 'JM',
  'Antilles': 'MQ',
  'Martinique / Antilles': 'MQ',
  'Espagne': 'ES',
  'Québec': 'CA',
  'Québec / Italie': 'CA',
  'France': 'FR',
  'Italie': 'IT',
  'Italie / Méditerranée': 'IT',
  'Fusion': null
}

/**
 * Flag icon component
 * @param {Object} props - Component props
 * @param {string} props.country - Country name
 */
function FlagIcon({ country }) {
  const code = COUNTRY_CODES[country]
  if (!code) {
    return <span className="flag-fallback">🌍</span>
  }
  const FlagComponent = Flags[code]
  if (!FlagComponent) {
    return <span className="flag-fallback">🌍</span>
  }
  return <FlagComponent title={country} className="flag-icon" />
}

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

  const getSourceInfo = (source) => {
    if (!source) return { icon: '🤖', label: 'IA', className: 'source-ai' }
    switch (source.type) {
      case 'ai-tested':
        return { icon: '✓', label: 'Testée', className: 'source-tested' }
      case 'family':
        return { icon: '👨‍👩‍👧‍👦', label: 'Famille', className: 'source-family' }
      default:
        return { icon: '🤖', label: 'IA', className: 'source-ai' }
    }
  }

  const sourceInfo = getSourceInfo(recette.source)

  const hasPhoto = recette.source?.photos?.length > 0

  return (
    <div
      className={`recipe-card ${isSelected ? 'selected' : ''} ${hasPhoto ? 'has-photo' : ''}`}
      onClick={handleClick}
    >
      {hasPhoto && (
        <div className="recipe-card-photo">
          <img src={recette.source.photos[0]} alt={recette.nom} />
        </div>
      )}
      <button
        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {isFavorite ? '❤️' : '🤍'}
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
        <span className="origine-icon"><FlagIcon country={recette.origine} /></span>
        {recette.origine} • 👥 {recette.portions} portions
      </div>
      <div className="description">{recette.description}</div>
      <div className="meta">
        <span title="Temps de préparation">⏱️ {recette.temps_prep_semaine}</span>
        <span title="Conservation">🧊 {recette.conservation.split('|')[0].trim()}</span>
      </div>
      <div className={`source-badge ${sourceInfo.className}`} title={sourceInfo.label}>
        <span className="source-icon">{sourceInfo.icon}</span>
        <span className="source-label">{sourceInfo.label}</span>
        {recette.source?.rating && (
          <span className="source-rating">{'★'.repeat(recette.source.rating)}</span>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
