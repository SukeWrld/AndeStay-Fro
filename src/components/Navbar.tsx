interface NavbarProps {
  isDarkMode: boolean;
  isAuthenticated: boolean;
  userName?: string;
  onToggleTheme: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
}

export function Navbar({
  isDarkMode,
  isAuthenticated,
  userName,
  onToggleTheme,
  onLogin,
  onRegister,
  onLogout
}: NavbarProps) {
  return (
    <nav className="navbar">
      <h2>AndeStay</h2>

      <div className="nav-links">
        <a href="#alojamientos">Alojamientos</a>
        <a href="#reservas">Reservas</a>
        <a href="#favoritos">Favoritos</a>
        <a href="#contacto">Contacto</a>
      </div>

      <div className="nav-actions">
        <button
          onClick={onToggleTheme}
          className="btn-theme"
          aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? '☼' : '☾'}
        </button>
        {isAuthenticated ? (
          <div className="authenticated-actions">
            <span>Hola, {userName || 'Usuario'}</span>
            <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
          </div>
        ) : (
          <div className="auth-actions">
            <button type="button" onClick={onLogin} className="btn-login">Iniciar Sesión</button>
            <button type="button" onClick={onRegister} className="btn-register">Registrarse</button>
          </div>
        )}
      </div>
    </nav>
  );
}
