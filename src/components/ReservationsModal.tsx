import type { Alojamiento, ReservaResponse } from '../types';

interface ReservationsModalProps {
  reservas: ReservaResponse[];
  alojamientos: Alojamiento[];
  isCancelling: string | null;
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
  const activeReservations = reservas.filter((reserva) => reserva.estado.toUpperCase() !== 'CANCELADA');

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
        <p className="modal-description">Consulta tus reservas activas y cancela una si ya no la necesitas.</p>

        {activeReservations.length > 0 ? (
          <div className="reservations-list">
            {activeReservations.map((reserva) => {
              const alojamiento = alojamientos.find((item) => item.id === reserva.unidadId);
              return (
                <article className="reservation-review-item" key={reserva.id}>
                  <div>
                    <strong>{alojamiento?.titulo ?? `Reserva #${reserva.id}`}</strong>
                    <span>{reserva.fechaEntrada} al {reserva.fechaSalida}</span>
                    <span>Estado: {reserva.estado.replaceAll('_', ' ')}</span>
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
          <p className="empty-favorites">No tienes reservas activas.</p>
        )}
      </div>
    </div>
  );
}