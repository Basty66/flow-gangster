import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_PASSWORD = 'flowgangster';

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('fg_auth') === '1');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);

  const login = (pass) => {
    if (Date.now() < blockedUntil) {
      return { ok: false, error: 'Demasiados intentos. Espera 30 segundos.' };
    }
    if (pass === ADMIN_PASSWORD) {
      localStorage.setItem('fg_auth', '1');
      setIsAdmin(true);
      setLoginAttempts(0);
      return { ok: true };
    }
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    if (attempts >= 5) {
      setBlockedUntil(Date.now() + 30000);
      setLoginAttempts(0);
      return { ok: false, error: 'Demasiados intentos. Espera 30 segundos.' };
    }
    return { ok: false, error: `Contraseña incorrecta. ${5 - attempts} intentos restantes.` };
  };

  const logout = () => {
    localStorage.removeItem('fg_auth');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
