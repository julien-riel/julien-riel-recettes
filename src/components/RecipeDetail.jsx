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
    return () => document.removeEventListener('keydown', handleEscape)
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
        <button className="close-btn" onClick={onClose}>x</button>

        <h2>#{recette.num} - {recette.nom}</h2>
        <div className="origine">{recette.origine} - {recette.portions} portions</div>

        <div className="description-box">
          {recette.description}
        </div>

        <div className="info-grid">
          <div className="info-box">
            <label>Semaine</label>
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

        <div className="info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="info-box" style={{ background: 'var(--vert-clair)' }}>
            <label>Legumes (50%)</label>
            <span>{recette.legumes}</span>
          </div>
          <div className="info-box" style={{ background: 'var(--orange-clair)' }}>
            <label>Proteines (25%)</label>
            <span>{recette.proteines}</span>
          </div>
          <div className="info-box" style={{ background: 'var(--bleu-clair)' }}>
            <label>Feculents (25%)</label>
            <span>{recette.feculents}</span>
          </div>
        </div>

        <h3>Ingredients</h3>
        <ul>
          {recette.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>

        <h3>Preparation</h3>
        <div className="weekend-legend">
          <span className="weekend-badge">WE</span> = Peut etre fait le week-end a l'avance
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

        <h3>Preparation week-end</h3>
        <div className="weekend-note">
          <strong>Ce qui peut etre prepare a l'avance :</strong><br />
          {recette.note_weekend || recette.prep_weekend}
        </div>

        <h3>Variantes</h3>
        <p>{recette.variantes}</p>

        <div style={{ marginTop: '25px' }}>
          <button
            className={`btn ${isSelected ? 'btn-orange' : 'btn-primary'}`}
            onClick={handleToggle}
          >
            {isSelected ? 'Selectionnee' : '+ Ajouter a ma selection'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail
