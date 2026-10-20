interface AuthModalProps {
  mode: 'login' | 'register';
  isClosing: boolean;
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onLogin: () => void;
}

export function AuthModal({ mode, isClosing, onClose, onSwitchMode, onLogin }: AuthModalProps) {
  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`auth-modal ${isClosing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          ×
        </button>

        {mode === 'login' ? (
          <>
            <span className="modal-eyebrow">Bienvenido de vuelta</span>
            <h2 id="auth-modal-title">Iniciar Sesión</h2>
            <p className="modal-description">Ingresa a tu cuenta para continuar con tu reserva.</p>
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onLogin();
              }}
            >
              <label>
                Nombre de usuario
                <input type="text" placeholder="Tu nombre de usuario" required />
              </label>
              <label>
                Contraseña
                <input type="password" placeholder="Tu contraseña" required />
              </label>
              <button type="button" className="forgot-password">¿Olvidaste tu contraseña?</button>
              <button type="submit" className="modal-submit">Ingresar a AndeStay</button>
            </form>
            <p className="modal-switch">
              ¿Aún no tienes una cuenta?{' '}
              <button type="button" onClick={() => onSwitchMode('register')}>Registrarse</button>
            </p>
          </>
        ) : (
          <>
            <span className="modal-eyebrow">Únete a AndeStay</span>
            <h2 id="auth-modal-title">Crear una cuenta</h2>
            <p className="modal-description">Regístrate para guardar tus alojamientos y reservas.</p>
            <form
              className="auth-form"
              onSubmit={(event) => {
                event.preventDefault();
                onClose();
              }}
            >
              <label>
                Nombre completo
                <input type="text" placeholder="Tu nombre completo" required />
              </label>
              <label>
                Correo electrónico
                <input type="email" placeholder="tuemail@ejemplo.com" required />
              </label>
              <label>
                Contraseña
                <input type="password" placeholder="Crea una contraseña" required />
              </label>
              <button type="submit" className="modal-submit">Crear mi cuenta</button>
            </form>
            <p className="modal-switch">
              ¿Ya tienes una cuenta?{' '}
              <button type="button" onClick={() => onSwitchMode('login')}>Iniciar sesión</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
