import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { useCart } from '../context/CartContext';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [justAdded, setJustAdded] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/stores/${id}`).then(({ data }) => setStore(data));
  }, [id]);

  if (!store) return <p className="max-w-6xl mx-auto px-5 py-10 text-char-600">Loading menu…</p>;

  const categories = [...new Set(store.menu.map((m) => m.category))];

  const handleAdd = (item) => {
    addItem(
      { name: item.name, unitPrice: item.price, qty: 1, isCustom: false },
      store.id,
      store.name
    );
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 900);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div
        className="rounded-2xl p-6 bg-diagonal-lines flex items-center justify-between flex-wrap gap-4"
        style={{ backgroundColor: store.coverColor }}
      >
        <div>
          <h1 className="font-display font-extrabold text-3xl text-white">{store.name}</h1>
          <p className="text-white/80 mt-1">{store.type} · {store.city} · ★ {store.rating} · {store.etaMins} min</p>
        </div>
        {store.categories.includes('Pizza') && (
          <Link
            to={`/stores/${store.id}/build`}
            className="bg-white text-char-900 font-semibold px-5 py-3 rounded-full shadow hover:scale-105 transition-transform"
          >
            🧑‍🍳 Build your own pizza
          </Link>
        )}
      </div>

      {categories.map((cat) => (
        <section key={cat} className="mt-8">
          <h2 className="font-display font-bold text-xl text-char-900 mb-3">{cat}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {store.menu.filter((m) => m.category === cat).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-char-800/5 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-semibold text-char-900">{item.name}</p>
                  <p className="text-sm text-char-600 mt-0.5">{item.desc}</p>
                  <p className="text-sm font-ticket text-tomato-600 mt-1">Rs. {item.price}</p>
                </div>
                <button
                  onClick={() => handleAdd(item)}
                  className="relative shrink-0 w-10 h-10 rounded-full bg-crust-100 hover:bg-tomato-600 hover:text-white text-char-900 font-bold text-lg transition-colors flex items-center justify-center"
                >
                  <AnimatePresence>
                    {justAdded === item.id ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <span key="plus">+</span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
