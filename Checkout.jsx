import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { storeId, storeName, items, total, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center text-char-600">
        Nothing to check out — <Link to="/" className="text-tomato-600 underline">browse stores</Link> first.
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center">
        <p className="text-char-800">Log in to place your order.</p>
        <Link to="/login" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-tomato-600 text-white font-semibold">
          Log in
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!address.trim()) {
      setError('Add a delivery address to continue.');
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        storeId,
        address,
        notes,
        items: items.map(({ cartId, ...rest }) => rest)
      });
      clearCart();
      navigate('/orders', { state: { justPlaced: data.id } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place the order. Try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-8">
      <h1 className="font-display font-extrabold text-2xl text-char-900">Checkout</h1>
      <p className="text-char-600 mt-1">{storeName}</p>

      <div className="mt-6 bg-white rounded-xl border border-char-800/5 p-4">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm py-1 text-char-800">
            <span>{it.qty}× {it.name}</span>
            <span>Rs. {it.unitPrice * it.qty}</span>
          </div>
        ))}
        <div className="border-t border-char-800/10 mt-2 pt-2 flex justify-between font-semibold text-char-900">
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <label className="block mt-6 text-sm font-medium text-char-800">Delivery address</label>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        rows={3}
        placeholder="House / street / area / city"
        className="w-full mt-1.5 rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
      />

      <label className="block mt-4 text-sm font-medium text-char-800">Notes for the kitchen (optional)</label>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Extra napkins, ring the bell, etc."
        className="w-full mt-1.5 rounded-xl border border-char-800/15 p-3 text-sm focus:border-tomato-600 outline-none"
      />

      <div className="mt-5 bg-semolina-400/15 border border-semolina-500/30 rounded-xl p-3 text-sm text-char-800">
        💵 Paying by <strong>Cash on Delivery</strong>. Card and online payment are coming soon.
      </div>

      {error && <p className="text-tomato-600 text-sm mt-3">{error}</p>}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={placeOrder}
        disabled={placing}
        className="mt-5 w-full py-3.5 rounded-full bg-tomato-600 text-white font-semibold hover:bg-tomato-700 transition-colors disabled:opacity-50"
      >
        {placing ? 'Placing order…' : `Place order · Rs. ${total}`}
      </motion.button>
    </div>
  );
}
