import { useCallback, useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { cancelarReserva, crearReserva, obtenerReservas } from './api';
import { loginRequest } from './authConfig';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { LodgingCard } from './components/LodgingCard';
import { Navbar } from './components/Navbar';
import { PaymentModal } from './components/PaymentModal';
import { ReservationsModal } from './components/ReservationsModal';
import type { Alojamiento, ReservaResponse } from './types';

const API_SCOPE = import.meta.env.VITE_API_SCOPE as string | undefined;
const DEFAULT_GUEST_EMAIL = import.meta.env.VITE_RESERVATION_EMAIL?.trim();

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function defaultStay(): { checkIn: string; checkOut: string } {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);
  return { checkIn: formatLocalDate(checkIn), checkOut: formatLocalDate(checkOut) };
}

export function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const activeAccount = accounts[0];
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 2]);
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stayDates, setStayDates] = useState(defaultStay);
  const [guestCount, setGuestCount] = useState(2);
  const [paymentReservation, setPaymentReservation] = useState<{
    reservation: ReservaResponse;
    alojamiento: Alojamiento;
  } | null>(null);
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [isCancellingReservation, setIsCancellingReservation] = useState<string | null>(null);

  const alojamientos: Alojamiento[] = [
    {
      id: 1,
      titulo: 'Cabaña Valle Nevado',
      ubicacion: 'Farellones, Chile',
      precio: 85000,
      imagen: 'https://www.chileanski.com/fotos/hotel/hi/8640-hotel-valle-nevado-1414090166.jpg'
    },
    {
      id: 2,
      titulo: 'Refugio Pucón Vista Al Lago',
      ubicacion: 'Pucón, Chile',
      precio: 110000,
      imagen: 'https://a0.muscache.com/im/pictures/miso/Hosting-800687269420660060/original/b4eb3d50-3f4f-478c-8c5f-3aef5fdd8c65.jpeg?im_w=720'
    },
    {
      id: 3,
      titulo: 'Departamento San Pedro de Atacama',
      ubicacion: 'Atacama, Chile',
      precio: 65000,
      imagen: 'https://cf.bstatic.com/xdata/images/hotel/max500/890016648.jpg?k=dd57e4c8cddf6adb9b7b8a4496f4e86254e7efc8ec542d00e31690abb17ff5fa&o='
    },
    {
      id: 4,
      titulo: 'Lodge Torres del Paine',
      ubicacion: 'Puerto Natales, Chile',
      precio: 150000,
      imagen: 'https://assets.explora.com/app/uploads/2024/07/1.1-Suite-Exploradores-V-414x250-2.jpg'
    }
  ];

  const handleLogin = () => {
    instance.loginPopup(loginRequest)
      .then((result) => {
        if (result.account) {
          instance.setActiveAccount(result.account);
        }
        setApiError(null);
      })
      .catch((error: unknown) => {
        setApiError(error instanceof Error ? error.message : 'No se pudo iniciar sesión con Microsoft.');
      });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((error: unknown) => {
      setApiError(error instanceof Error ? error.message : 'No se pudo cerrar la sesión.');
    });
  };

  const getApiAccessToken = useCallback(async (): Promise<string | undefined> => {
    if (!API_SCOPE || !activeAccount) {
      return undefined;
    }

    const result = await instance.acquireTokenSilent({
      scopes: [API_SCOPE],
      account: activeAccount
    });
    return result.accessToken;
  }, [activeAccount, instance]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark-theme', next);
      return next;
    });
  };

  const toggleFavorite = (id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setIsClosingModal(true);
    window.setTimeout(() => {
      setActiveModal(null);
      setIsClosingModal(false);
    }, 220);
  };

  const handleCreateReservation = async () => {
    setIsCreatingReservation(true);
    setApiError(null);

    try {
      const today = formatLocalDate(new Date());
      if (stayDates.checkIn <= today || stayDates.checkOut <= stayDates.checkIn) {
        throw new Error('El check-in debe ser una fecha futura y el check-out posterior.');
      }

      const accessToken = await getApiAccessToken();
      const emailHuesped = activeAccount?.username?.trim() || DEFAULT_GUEST_EMAIL;
      if (!emailHuesped) {
        throw new Error('Inicia sesión o configura VITE_RESERVATION_EMAIL para recibir confirmaciones.');
      }

      const reserva = await crearReserva({
        unidadId: selectedId,
        nombreHuesped: activeAccount?.name ?? 'Huésped AndeStay',
        emailHuesped,
        fechaEntrada: stayDates.checkIn,
        fechaSalida: stayDates.checkOut,
        cantidadPersonas: guestCount
      }, accessToken);
      setReservas((prev) => [...prev, reserva]);
      const reservedAlojamiento = alojamientos.find((item) => item.id === reserva.unidadId);
      if (reservedAlojamiento) {
        setSelectedId(reservedAlojamiento.id);
        setPaymentReservation({ reservation: reserva, alojamiento: reservedAlojamiento });
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'No se pudo crear la reserva.');
    } finally {
      setIsCreatingReservation(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    getApiAccessToken()
      .then((accessToken) => obtenerReservas(accessToken))
      .then((items) => {
        if (isCurrent) setReservas(items);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setApiError(error instanceof Error ? error.message : 'No se pudo conectar con el backend.');
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoadingReservations(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [getApiAccessToken]);

  const favoriteAlojamientos = alojamientos.filter((item) => favoriteIds.includes(item.id));
  const activeReservationsCount = reservas.filter(
    (reserva) => reserva.estado.toUpperCase() !== 'CANCELADA'
  ).length;
  const alojamientoActual = alojamientos.find((item) => item.id === selectedId) ?? alojamientos[0];
  const reservaActual = [...reservas].reverse().find((reserva) =>
    reserva.unidadId === alojamientoActual.id
      && !reserva.estado.toLowerCase().includes('cancel')
  );

  const handleOpenPayment = () => {
    if (reservaActual) {
      setPaymentReservation({ reservation: reservaActual, alojamiento: alojamientoActual });
    }
  };

  const handleCancelReservation = async (reservation: ReservaResponse) => {
    if (!window.confirm('¿Quieres cancelar esta reserva?')) return;

    setIsCancellingReservation(reservation.id);
    setApiError(null);
    try {
      const accessToken = await getApiAccessToken();
      const updatedReservation = await cancelarReserva(reservation.id, accessToken);
      setReservas((prev) => prev.map((item) =>
        item.id === updatedReservation.id ? updatedReservation : item
      ));
      setPaymentReservation(null);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'No se pudo cancelar la reserva.');
    } finally {
      setIsCancellingReservation(null);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        isDarkMode={isDarkMode}
        isAuthenticated={isAuthenticated}
        userName={activeAccount?.name}
        onToggleTheme={toggleTheme}
        onLogin={() => setActiveModal('login')}
        onRegister={() => setActiveModal('register')}
        onLogout={handleLogout}
      />

      <main className="catalog-container" id="alojamientos">
        <h1>Alojamientos Disponibles</h1>
        <div className="grid-alojamientos">
          {alojamientos.map((item) => {
            return (
              <LodgingCard
                key={item.id}
                alojamiento={item}
                isSelected={selectedId === item.id}
                isFavorite={favoriteIds.includes(item.id)}
                onSelect={setSelectedId}
                onToggleFavorite={toggleFavorite}
              />
            );
          })}
        </div>

        <section className="favorites-section" id="favoritos">
          <div className="favorites-header">
            <div>
              <span className="eyebrow">Favoritos</span>
              <h2>Lo que más te ha gustado</h2>
            </div>
            <button type="button" className="favorites-button">Ver todos</button>
          </div>

          {favoriteAlojamientos.length > 0 ? (
            <div className="favorites-grid">
              {favoriteAlojamientos.map((item) => (
                <article key={`fav-${item.id}`} className="favorite-card">
                  <img src={item.imagen} alt={item.titulo} />
                  <div className="favorite-content">
                    <div className="favorite-title-row">
                      <h3>{item.titulo}</h3>
                      <button
                        type="button"
                        className="favorite-heart"
                        onClick={() => toggleFavorite(item.id)}
                        aria-label={`Quitar ${item.titulo} de favoritos`}
                      >
                        Quitar
                      </button>
                    </div>
                    <p>{item.ubicacion}</p>
                    <div className="favorite-footer">
                      <span className="price">${item.precio.toLocaleString('es-CL')}</span>
                      <span className="favorite-meta">/ noche</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-favorites">Todavía no tienes alojamientos en favoritos.</p>
          )}
        </section>

        <section className="reservas-section" id="reservas">
          <div className="favorites-header">
            <div>
              <span className="eyebrow">Reservas</span>
              <h2>Tu próximo alojamiento</h2>
            </div>
            <button type="button" className="favorites-button review-reservations-button" onClick={() => setIsReservationsModalOpen(true)}>
              Revisar reservas
            </button>
          </div>

          <p className="api-status" role="status">
            {isLoadingReservations
              ? 'Cargando reservas desde el backend...'
              : `${activeReservationsCount} reserva${activeReservationsCount === 1 ? '' : 's'} activa${activeReservationsCount === 1 ? '' : 's'} sincronizada${activeReservationsCount === 1 ? '' : 's'}`}
          </p>
          {apiError && <p className="api-error" role="alert">{apiError}</p>}

          <div className="reserva-card" key={`${alojamientoActual.id}-${reservaActual?.id ?? 'suggested'}`}>
            <div className="reserva-imagen">
              <img src={alojamientoActual.imagen} alt={alojamientoActual.titulo} />
            </div>

            <div className="reserva-info">
              <span className="reserva-badge">
                {reservaActual ? 'Reserva en espera' : 'Reserva sugerida'}
              </span>
              <h3>{alojamientoActual.titulo}</h3>
              <p>{alojamientoActual.ubicacion}</p>

              <div className="reserva-detalles">
                <div>
                  <span>Check-in</span>
                  {reservaActual ? (
                    <strong>{reservaActual.fechaEntrada}</strong>
                  ) : (
                    <input
                      className="reservation-input"
                      type="date"
                      min={formatLocalDate(new Date())}
                      value={stayDates.checkIn}
                      onChange={(event) => setStayDates((dates) => ({
                        ...dates,
                        checkIn: event.target.value
                      }))}
                      aria-label="Fecha de check-in"
                    />
                  )}
                </div>
                <div>
                  <span>Check-out</span>
                  {reservaActual ? (
                    <strong>{reservaActual.fechaSalida}</strong>
                  ) : (
                    <input
                      className="reservation-input"
                      type="date"
                      min={stayDates.checkIn}
                      value={stayDates.checkOut}
                      onChange={(event) => setStayDates((dates) => ({
                        ...dates,
                        checkOut: event.target.value
                      }))}
                      aria-label="Fecha de check-out"
                    />
                  )}
                </div>
                <div>
                  <span>Huéspedes</span>
                  {reservaActual ? (
                    <strong>{reservaActual.cantidadPersonas} personas</strong>
                  ) : (
                    <input
                      className="reservation-input"
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(event) => setGuestCount(Number(event.target.value))}
                      aria-label="Cantidad de huéspedes"
                    />
                  )}
                </div>
              </div>

              <div className="reserva-footer">
                <div>
                  <span>Total</span>
                  <strong>${(alojamientoActual.precio * Math.max(
                    1,
                    Math.ceil((Date.parse(stayDates.checkOut) - Date.parse(stayDates.checkIn)) / 86_400_000)
                  )).toLocaleString('es-CL')}</strong>
                </div>
                <button
                  type="button"
                  className="reserve-button"
                  onClick={handleCreateReservation}
                  disabled={isCreatingReservation || (API_SCOPE !== undefined && !isAuthenticated)}
                >
                  {isCreatingReservation
                    ? 'Guardando...'
                    : API_SCOPE !== undefined && !isAuthenticated
                      ? 'Inicia sesión para reservar'
                      : 'Reservar ahora'}
                </button>
                {reservaActual && (
                  <button type="button" className="payment-button" onClick={handleOpenPayment}>
                    Pagar reserva
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-copy">
            <span className="eyebrow">Soporte experto</span>
            <h2>¿Tienes dudas con tu próxima reserva?</h2>
            <p>
              Habla con un asesor de AndeStay para revisar fechas, ubicaciones,
              disponibilidad y la mejor opción según tus necesidades.
            </p>
          </div>

          <form className="contact-form">
            <label>
              Nombre
              <input type="text" placeholder="Tu nombre" />
            </label>

            <label>
              Email
              <input type="email" placeholder="tuemail@ejemplo.com" />
            </label>

            <label>
              Mensaje
              <textarea rows={4} placeholder="Cuéntanos en qué te podemos ayudar" />
            </label>

            <button type="button" className="contact-button">
              Hablar con un experto
            </button>
          </form>
        </section>
      </main>

      <Footer />

      {activeModal && (
        <AuthModal
          mode={activeModal}
          isClosing={isClosingModal}
          onClose={closeModal}
          onSwitchMode={setActiveModal}
          onLogin={handleLogin}
        />
      )}

      {paymentReservation && (
        <PaymentModal
          reservation={paymentReservation.reservation}
          alojamiento={paymentReservation.alojamiento}
          onClose={() => setPaymentReservation(null)}
        />
      )}

      {isReservationsModalOpen && (
        <ReservationsModal
          reservas={reservas}
          alojamientos={alojamientos}
          isCancelling={isCancellingReservation}
          onClose={() => setIsReservationsModalOpen(false)}
          onCancel={handleCancelReservation}
        />
      )}
    </div>
  );
}

export default App;