import { useEffect } from 'react'

/**
 * Recipe detail modal component
 * @param {Object} props - Component props
 * @param {Object} props.recette - Recipe data
 * @param {boolean} props.isSelected - Whether the recipe is selected
 * @param {Function} props.onClose - Close modal callback
 * @param {Function} props.onToggle - Toggle selection callback
 */
function RecipeDetail({ recette, isSelected, onClose, onToggle }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('recipe-detail')) {
      onClose()
    }
  }

  const handleToggle = () => {
    onToggle(recette.num)
  }


  return (
    <div className="recipe-detail open" onClick={handleBackdropClick}>
      <div className="recipe-detail-content">
        <button className="close-btn" onClick={onClose} aria-label="Fermer">
          ✕
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
          <div className="info-box">
            <label>Portions</label>
            <strong>{recette.portions}</strong>
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

        <h3>Ingrédients</h3>
        <ul className="ingredients-list">
          {recette.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
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

        <div className="detail-actions">
          <button
            className={`btn ${isSelected ? 'btn-orange' : 'btn-primary'}`}
            onClick={handleToggle}
          >
            {isSelected ? '✓ Sélectionnée' : '+ Ajouter à ma sélection'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
