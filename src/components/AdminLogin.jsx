import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function AdminLogin({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
         onClick={onClose}>
      <div className="bg-surface border border-purple/30 p-8 w-full max-w-sm animate-scale-in"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-purple"><LockIcon /></div>
            <h2 className="font-display font-bold text-lg">Admin</h2>
          </div>
          <button onClick={onClose} className="text-[#525252] hover:text-[#fafafa] transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Usuario"
            className="input-field text-center"
            autoFocus
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
            className="input-field text-center tracking-widest"
          />
          {error && (
            <p className="text-orange text-xs font-bold text-center">{error}</p>
          )}
          <button type="submit" disabled={loading || !username || !password}
                  className="btn-primary w-full text-center">
            {loading ? '...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
