import { useState } from 'react';
import type { Alojamiento, ReservaResponse } from '../types';

interface PaymentModalProps {
  reservation: ReservaResponse;
  alojamiento: Alojamiento;
  onClose: () => void;
}

export function PaymentModal({ reservation, alojamiento, onClose }: PaymentModalProps) {
  const [isPaid, setIsPaid] = useState(false);
  const total = alojamiento.precio * 3;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPaid(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar pago">
          ×
        </button>

        {isPaid ? (
          <div className="payment-success">
            <span className="payment-success-icon" aria-hidden="true">✓</span>
            <span className="modal-eyebrow">Pago recibido</span>
            <h2 id="payment-modal-title">¡Reserva confirmada!</h2>
            <p className="modal-description">
              Tu reserva en {alojamiento.titulo} quedó lista. Te enviaremos los detalles a tu correo.
            </p>
            <button type="button" className="modal-submit" onClick={onClose}>Listo</button>
          </div>
        ) : (
          <>
            <span className="modal-eyebrow">Paso 2 de 2</span>
            <h2 id="payment-modal-title">Completa tu pago</h2>
            <p className="modal-description">Tu reserva está creada. Confirma el pago para asegurar tu alojamiento.</p>

            <div className="payment-summary">
              <div>
                <strong>{alojamiento.titulo}</strong>
                <span>Reserva #{reservation.id} · 15 nov - 18 nov</span>
              </div>
              <strong>${total.toLocaleString('es-CL')}</strong>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Método de pago
                <select className="payment-input" defaultValue="card">
                  <option value="card">Tarjeta de crédito o débito</option>
                  <option value="transfer">Transferencia bancaria</option>
                </select>
              </label>
              <label>
                Número de tarjeta
                <input className="payment-input" type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19} required />
              </label>
              <div className="payment-fields-row">
                <label>
                  Vencimiento
                  <input className="payment-input" type="text" placeholder="MM/AA" maxLength={5} required />
                </label>
                <label>
                  CVV
                  <input className="payment-input" type="password" inputMode="numeric" placeholder="123" maxLength={4} required />
                </label>
              </div>
              <button type="submit" className="modal-submit">Pagar reserva</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}