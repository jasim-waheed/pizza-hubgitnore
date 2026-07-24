import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, storeName, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-5xl mb-4">🍕</p>
        <h2 className="font-display font-bold text-xl text-char-900">Your cart is empty</h2>
        <p className="text-char-600 mt-1">Find a store and add something delicious.</p>
        <Link to="/" className="inline-block mt-5 px-5 py-2.5 rounded-full bg-tomato-600 text-white font-semibold">
          Browse stores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <h1 className="font-display font-extrabold text-2xl text-char-900">Your cart</h1>
      <p className="text-char-600 mt-1">{storeName}</p>

      <div className="mt-6 space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.cartId}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-char-800/5 rounded-xl p-4 flex justify-between items-start gap-3"
            >
              <div>
                <p className="font-semibold text-char-900">{item.name}</p>
                {item.summary && <p className="text-xs text-char-600 mt-1">{item.summary}</p>}
                <p className="text-sm font-ticket text-tomato-600 mt-1">Rs. {item.unitPrice} × {item.qty}</p>
              </div>
              <button
                onClick={() => removeItem(item.cartId)}
                className="text-char-600 hover:text-tomato-600 text-sm shrink-0"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 border-t border-char-800/10 pt-4 flex items-center justify-between">
        <p className="font-semibold text-char-900">Total</p>
        <p className="font-ticket text-lg text-tomato-600 font-semibold">Rs. {total}</p>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-6 w-full py-3.5 rounded-full bg-tomato-600 text-white font-semibold hover:bg-tomato-700 transition-colors"
      >
        Continue to checkout
      </button>
    </div>
  );
}
