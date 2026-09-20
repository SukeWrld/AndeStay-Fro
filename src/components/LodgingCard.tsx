import type { Alojamiento } from '../types';

interface LodgingCardProps {
  alojamiento: Alojamiento;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export function LodgingCard({
  alojamiento,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}: LodgingCardProps) {
  return (
    <div
      className={`card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(alojamiento.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(alojamiento.id);
        }
      }}
    >
      <img src={alojamiento.imagen} alt={alojamiento.titulo} className="card-img" />
      <div className="card-body">
        <div className="card-header">
          <h3>{alojamiento.titulo}</h3>
          <button
            type="button"
            className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite(alojamiento.id);
            }}
            aria-label={
              isFavorite
                ? `Quitar ${alojamiento.titulo} de favoritos`
                : `Agregar ${alojamiento.titulo} a favoritos`
            }
          >
            {isFavorite ? 'Guardado' : 'Guardar'}
          </button>
          {isSelected && <span className="selected-tag">Seleccionado</span>}
        </div>
        <p>{alojamiento.ubicacion}</p>
        <p className="price">${alojamiento.precio.toLocaleString('es-CL')} / noche</p>
      </div>
    </div>
  );
}
