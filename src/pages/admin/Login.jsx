import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCafe } from '../../store/CafeStore';

export default function AdminLogin() {
  const { login, isAdmin } = useCafe();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (login(username, password)) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Try admin / admin123');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-4">☕</div>
          <h1 className="font-display text-3xl text-brand-cream">
            Astor <span className="text-gold-gradient">Admin</span>
          </h1>
          <p className="text-brand-cream/40 text-sm mt-2">Management Portal</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleSubmit} className="glass-card p-6 animate-fade-in-up">
          <h2 className="font-display text-lg text-brand-cream mb-6">Sign In</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-brand-cream/50 text-xs mb-1.5 font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-brand-cream/50 text-xs mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-6 py-3.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-brand-black/30 border-t-brand-black rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-brand-cream/25 text-xs mt-4">
            Demo: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}