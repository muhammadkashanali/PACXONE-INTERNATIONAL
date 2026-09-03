import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { loginToAdmin } from '@/lib/catalog';
import { setStoredAdminUser } from '@/lib/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@pacxone.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginToAdmin(email, password);
      setStoredAdminUser(user);
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fb', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#2563eb', fontWeight: 700 }}>Admin</p>
        <h1 style={{ margin: '12px 0 24px', fontSize: 36, fontWeight: 800 }}>Login</h1>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ width: '100%', height: 44, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" style={{ width: '100%', height: 44, border: '1px solid #d1d5db', borderRadius: 10, padding: '0 12px' }} />
          </div>

          {error && <p style={{ color: '#dc2626', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ height: 46, border: 'none', borderRadius: 10, background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
