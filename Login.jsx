import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-extrabold text-2xl text-char-900">Welcome back</h1>
        <p className="text-char-600 mt-1 text-sm">Log in to order and track your pizza.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          {error && <p className="text-tomato-600 text-sm">{error}</p>}
          <button
            disabled={busy}
            className="w-full py-3 rounded-full bg-tomato-600 text-white font-semibold hover:bg-tomato-700 transition-colors disabled:opacity-50"
          >
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-char-600 mt-5 text-center">
          New here? <Link to="/register" className="text-tomato-600 font-medium">Create an account</Link>
        </p>
        <p className="text-xs text-char-600 mt-2 text-center">
          Restaurant staff? <Link to="/admin/login" className="text-basil-700 font-medium">Admin log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
