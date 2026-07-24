import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { adminLogin } = useAuth();
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
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-char-950 flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-char-900 rounded-2xl p-7 border border-char-800"
      >
        <h1 className="font-display font-extrabold text-2xl text-crust-50">Admin console</h1>
        <p className="text-crust-100/60 mt-1 text-sm">Inventory & order management.</p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-char-950 border border-char-800 text-crust-50 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-char-950 border border-char-800 text-crust-50 p-3 text-sm focus:border-tomato-600 outline-none"
          />
          {error && <p className="text-tomato-600 text-sm">{error}</p>}
          <button
            disabled={busy}
            className="w-full py-3 rounded-full bg-tomato-600 text-white font-semibold hover:bg-tomato-700 transition-colors disabled:opacity-50"
          >
            {busy ? 'Logging in…' : 'Enter console'}
          </button>
        </form>
        <p className="text-[11px] text-crust-100/40 mt-4 text-center">
          Demo credentials: admin@pizzahub.test / Admin@123
        </p>
      </motion.div>
    </div>
  );
}
