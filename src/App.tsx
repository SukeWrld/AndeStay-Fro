import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { LodgingCard } from './components/LodgingCard';
import { Navbar } from './components/Navbar';
import type { Alojamiento } from './types';

export function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [reservationIndex, setReservationIndex] = useState<number>(0);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 2]);
  const [activeModal, setActiveModal] = useState<'login' | 'register' | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

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
    instance.loginPopup(loginRequest).catch((e) => {
      console.warn('MSAL pendiente de credenciales reales:', e);
    });
  };

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.warn('Error en logout:', e);
    });
  };

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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReservationIndex((prev) => (prev + 1) % alojamientos.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [alojamientos.length]);

  const favoriteAlojamientos = alojamientos.filter((item) => favoriteIds.includes(item.id));
  const alojamientoActual = alojamientos[reservationIndex];

  return (
    <div className="app-container">
      <Navbar
        isDarkMode={isDarkMode}
        isAuthenticated={isAuthenticated}
        userName={accounts[0]?.name}
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
          </div>

          <div className="reserva-card" key={alojamientoActual.id}>
            <div className="reserva-imagen">
              <img src={alojamientoActual.imagen} alt={alojamientoActual.titulo} />
            </div>

            <div className="reserva-info">
              <span className="reserva-badge">Reserva sugerida</span>
              <h3>{alojamientoActual.titulo}</h3>
              <p>{alojamientoActual.ubicacion}</p>

              <div className="reserva-detalles">
                <div>
                  <span>Check-in</span>
                  <strong>15 nov</strong>
                </div>
                <div>
                  <span>Check-out</span>
                  <strong>18 nov</strong>
                </div>
                <div>
                  <span>Huéspedes</span>
                  <strong>2 personas</strong>
                </div>
              </div>

              <div className="reserva-footer">
                <div>
                  <span>Total</span>
                  <strong>${(alojamientoActual.precio * 3).toLocaleString('es-CL')}</strong>
                </div>
                <button type="button" className="reserve-button">Reservar ahora</button>
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
    </div>
  );
}

export default App;