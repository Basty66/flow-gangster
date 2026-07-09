import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const TOKEN_KEY = 'fg_jwt';
const USER_KEY = 'fg_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(USER_KEY)); }
    catch { return null; }
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);

  const isAdmin = !!token;

  const login = async (username, password) => {
    if (Date.now() < blockedUntil) {
      return { ok: false, error: 'Demasiados intentos. Espera 30 segundos.' };
    }
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify({ username, role: 'admin' }));
        setToken(data.token);
        setUser({ username, role: 'admin' });
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
      return { ok: false, error: `Credenciales incorrectas. ${5 - attempts} intentos restantes.` };
    } catch {
      return { ok: false, error: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    const t = sessionStorage.getItem(TOKEN_KEY);
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, user, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
