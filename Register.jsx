import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-extrabold text-2xl text-char-900">Create your account</h1>
        <p className="text-char-600 mt-1 text-sm">Takes less than a minute.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={update('name')}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          <input
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={update('phone')}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={update('password')}
            className="w-full rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          {error && <p className="text-tomato-600 text-sm">{error}</p>}
          <button
            disabled={busy}
            className="w-full py-3 rounded-full bg-tomato-600 text-white font-semibold hover:bg-tomato-700 transition-colors disabled:opacity-50"
          >
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-char-600 mt-5 text-center">
          Already have an account? <Link to="/login" className="text-tomato-600 font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
