import type { Alojamiento, ReservaResponse } from '../types';

interface ReservationsModalProps {
  reservas: ReservaResponse[];
  alojamientos: Alojamiento[];
  isCancelling: number | null;
  onClose: () => void;
  onCancel: (reservation: ReservaResponse) => void;
}

export function ReservationsModal({
  reservas,
  alojamientos,
  isCancelling,
  onClose,
  onCancel
}: ReservationsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="payment-modal reservations-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservations-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar reservas">
          ×
        </button>
        <span className="modal-eyebrow">Tus reservas</span>
        <h2 id="reservations-modal-title">Revisar reservas</h2>
        <p className="modal-description">Consulta tus alojamientos y cancela una reserva si ya no la necesitas.</p>

        {reservas.length > 0 ? (
          <div className="reservations-list">
            {reservas.map((reserva) => {
              const alojamiento = alojamientos.find((item) => item.id === reserva.unidadId);
              const estado = reserva.estado.toLowerCase().includes('cancel')
                ? 'Cancelada'
                : 'En espera';
              return (
                <article className="reservation-review-item" key={reserva.id}>
                  <div>
                    <strong>{alojamiento?.titulo ?? `Reserva #${reserva.id}`}</strong>
                    <span>{reserva.fechaEntrada} al {reserva.fechaSalida}</span>
                    <span>Estado: {estado}</span>
                  </div>
                  <button
                    type="button"
                    className="cancel-reservation-button"
                    onClick={() => onCancel(reserva)}
                    disabled={isCancelling === reserva.id}
                  >
                    {isCancelling === reserva.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-favorites">No tienes reservas registradas.</p>
        )}
      </div>
    </div>
  );
}