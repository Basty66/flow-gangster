import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function AdminLogin({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(username, password);
    if (res.ok) {
      onClose();
      navigate('/admin');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
         onClick={onClose}>
      <div className="liquid-card w-full max-w-sm animate-scale-in overflow-hidden"
           onClick={(e) => e.stopPropagation()}
           style={{ animationDuration: '0.4s' }}>
        {/* Decorative top bar */}
        <div className="h-1 bg-gradient-to-r from-purple via-cyan to-purple bg-[length:200%_100%] animate-shimmer-slow" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center border border-purple/20">
                <LockIcon />
              </div>
              <div>
                <h2 className="font-display font-bold text-base text-[#fafafa] tracking-[-0.01em]">Acceso Admin</h2>
                <p className="text-[10px] text-[#525252] font-medium tracking-[0.1em] uppercase">Flow Gangster</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#525252] hover:text-[#fafafa] hover:bg-white/[0.04] transition-all duration-200">
              <CloseIcon />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#525252] block">Usuario</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Ingresa tu usuario"
                className="input-field text-sm h-11 px-4"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#525252] block">Contraseña</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  className="input-field text-sm h-11 px-4 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#a3a3a3] transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-orange/[0.06] border border-orange/20 rounded-xl px-4 py-3 animate-fade-in">
                <p className="text-orange text-xs font-bold text-center">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading || !username || !password}
                    className="btn-primary w-full text-center text-sm mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-deep/30 border-t-transparent rounded-full animate-spin" />
                  INGRESANDO
                </span>
              ) : 'INGRESAR'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center justify-center gap-2">
            <span className="w-1 h-1 rounded-full bg-purple/50" />
            <p className="text-[9px] text-[#525252] font-medium tracking-[0.15em] uppercase">Panel de Administracion</p>
            <span className="w-1 h-1 rounded-full bg-cyan/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
