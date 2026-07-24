import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-char-950/95 backdrop-blur border-b border-char-800">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.span
            whileHover={{ rotate: -18 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-2xl"
          >
            🍕
          </motion.span>
          <span className="font-display font-extrabold text-xl text-crust-50 tracking-tight">
            Pizza<span className="text-tomato-600">Hub</span>
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-crust-100/80 hover:text-crust-50 transition-colors hidden sm:inline">
            Stores
          </Link>
          {user && (
            <Link to="/orders" className="text-crust-100/80 hover:text-crust-50 transition-colors hidden sm:inline">
              My orders
            </Link>
          )}
          <Link to="/cart" className="relative text-crust-100/80 hover:text-crust-50 transition-colors">
            Cart
            {items.length > 0 && (
              <motion.span
                key={items.length}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-4 bg-tomato-600 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {items.length}
              </motion.span>
            )}
          </Link>

          {user ? (
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-3 py-1.5 rounded-full border border-char-600 text-crust-100/80 hover:text-crust-50 hover:border-crust-100/40 transition-colors"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-full bg-tomato-600 text-white font-medium hover:bg-tomato-700 transition-colors"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
