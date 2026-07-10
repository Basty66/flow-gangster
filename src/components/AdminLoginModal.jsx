import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginModal() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-admin-login', handler);
    return () => window.removeEventListener('open-admin-login', handler);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    const res = await login(username, password);
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setUsername('');
      setPassword('');
      navigate('/admin');
    } else {
      setError(res.error);
    }
  };

  if (!open || isAdmin) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90"
         onClick={() => setOpen(false)}
         style={{ animation: 'fadeUp 0.2s ease-out' }}>
      <div className="border border-[#333] p-8 w-full max-w-sm"
           onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <img src="/logo-mark.svg" alt="FG" className="w-8 h-8 brightness-0 invert mx-auto mb-3" />
          <p className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase">Admin Access</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)}
                 placeholder="Usuario" className="input text-xs" autoFocus />
          <input value={password} onChange={(e) => setPassword(e.target.value)}
                 type="password" placeholder="Contraseña" className="input text-xs" />
          {error && <p className="text-[#666] text-xs">{error}</p>}
          <button type="submit" disabled={loading}
                  className={`btn btn-primary w-full justify-center text-xs ${loading ? 'opacity-30' : ''}`}>
            {loading ? '...' : 'INGRESAR'}
          </button>
        </form>
        <p className="text-[#444] text-[9px] text-center mt-4 font-mono tracking-[0.1em]">5 clicks en el logo para acceder</p>
      </div>
    </div>
  );
}
