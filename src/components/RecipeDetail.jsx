import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Recipe detail modal component
 * @param {Object} props - Component props
 * @param {Object} props.recette - Recipe data
 * @param {boolean} props.isSelected - Whether the recipe is selected
 * @param {boolean} props.isFavorite - Whether the recipe is a favorite
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onToggleFavorite - Toggle favorite callback
 * @param {number} props.portions - Current portions
 * @param {Function} props.onUpdatePortions - Update portions callback
 * @param {Function} props.scaleIngredient - Scale ingredient callback
 */
function RecipeDetail({ recette, isSelected, isFavorite, onClose, onToggle, onToggleFavorite, portions, onUpdatePortions, scaleIngredient }) {
  const portionOptions = [2, 4, 6, 8]
  const multiplier = portions / 4
  const [lightboxPhoto, setLightboxPhoto] = useState(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (lightboxPhoto) {
          setLightboxPhoto(null)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose, lightboxPhoto])

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('recipe-detail')) {
      onClose()
    }
  }

  const handleToggle = () => {
    onToggle(recette.num)
    onClose()
  }

  const handleFavorite = (e) => {
    onToggleFavorite(recette.num, e)
  }

  return (
    <div className="recipe-detail open" onClick={handleBackdropClick}>
      <div className="recipe-detail-content">
        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <button
          className={`detail-favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <h2>
          <span className="recipe-num">#{recette.num}</span> {recette.nom}
        </h2>
        <div className="origine">
          {recette.origine} • {recette.portions} portions
        </div>

        <div className="description-box">
          {recette.description}
        </div>

        <div className="info-grid">
          <div className="info-box">
            <label>Préparation</label>
            <strong>{recette.temps_prep_semaine}</strong>
          </div>
          <div className="info-box">
            <label>Week-end</label>
            <strong>{recette.temps_prep_weekend}</strong>
          </div>
          <div className="info-box portions-selector">
            <label>Portions</label>
            <div className="portions-buttons">
              {portionOptions.map(p => (
                <button
                  key={p}
                  className={`portion-btn ${portions === p ? 'active' : ''}`}
                  onClick={() => onUpdatePortions(recette.num, p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="info-box">
            <label>Conservation</label>
            <strong>{recette.conservation.split('|')[0].trim()}</strong>
          </div>
        </div>

        <div className="info-grid nutrition-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="info-box legumes-box">
            <label>Légumes (50%)</label>
            <span>{recette.legumes}</span>
          </div>
          <div className="info-box proteines-box">
            <label>Protéines (25%)</label>
            <span>{recette.proteines}</span>
          </div>
          <div className="info-box feculents-box">
            <label>Féculents (25%)</label>
            <span>{recette.feculents}</span>
          </div>
        </div>

        <h3>Ingrédients {multiplier !== 1 && <span className="portions-indicator">(pour {portions} portions)</span>}</h3>
        <ul className="ingredients-list">
          {recette.ingredients.map((ing, i) => (
            <li key={i}>{multiplier !== 1 ? scaleIngredient(ing, multiplier) : ing}</li>
          ))}
        </ul>

        <h3>Préparation</h3>
        <div className="weekend-legend">
          <span className="weekend-badge">WE</span> = Peut être fait le week-end à l'avance
        </div>
        <ol className="steps-list">
          {recette.etapes.map((etape, index) => {
            const isWeekend = recette.etapes_weekend && recette.etapes_weekend.includes(index + 1)
            return (
              <li key={index} className={isWeekend ? 'weekend-step' : ''}>
                {isWeekend && <span className="weekend-badge">WE</span>}
                {etape}
              </li>
            )
          })}
        </ol>

        <h3>Préparation du week-end</h3>
        <div className="weekend-note">
          <strong>Ce qui peut être préparé à l'avance :</strong><br />
          {recette.note_weekend || recette.prep_weekend}
        </div>

        <h3>Variantes possibles</h3>
        <p className="variantes-text">{recette.variantes}</p>

        {/* Source info section */}
        <div className={`source-section ${recette.source?.type || 'ai'}`}>
          <h3>
            {!recette.source || recette.source.type === 'ai' ? '🤖 Recette générée par IA' :
             recette.source.type === 'ai-tested' ? '✓ Recette testée' :
             '👨‍👩‍👧‍👦 Recette de famille'}
          </h3>
          {recette.source?.rating && (
            <div className="source-rating-display">
              {'★'.repeat(recette.source.rating)}{'☆'.repeat(5 - recette.source.rating)}
            </div>
          )}
          {recette.source?.note && (
            <p className="source-note">{recette.source.note}</p>
          )}
          {recette.source?.photos && recette.source.photos.length > 0 && (
            <div className="source-photos">
              {recette.source.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`${recette.nom} - photo ${idx + 1}`}
                  className="source-photo"
                  onClick={() => setLightboxPhoto(photo)}
                />
              ))}
            </div>
          )}
          {!recette.source && (
            <p className="source-note source-untested">Cette recette n'a pas encore été testée. Les quantités et étapes sont générées par IA.</p>
          )}
        </div>

        <div className="detail-actions">
          <button
            className={`btn ${isSelected ? 'btn-orange' : 'btn-primary'}`}
            onClick={handleToggle}
          >
            {isSelected ? '✓ Sélectionnée' : '+ Ajouter à ma sélection'}
          </button>
        </div>
      </div>

      {lightboxPhoto && createPortal(
        <div className="photo-lightbox" onClick={() => setLightboxPhoto(null)}>
          <button className="lightbox-close" aria-label="Fermer">✕</button>
          <img src={lightboxPhoto} alt={recette.nom} />
        </div>,
        document.body
      )}
    </div>
  )
}

export default RecipeDetail
