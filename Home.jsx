import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import StoreCard from '../components/StoreCard';

const TYPE_FILTERS = ['All', 'Pizzeria', 'Cloud Kitchen'];

export default function Home() {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores').then(({ data }) => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  const visible = filter === 'All' ? stores : stores.filter((s) => s.type === filter);

  return (
    <div>
      <section className="bg-char-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-diagonal-lines opacity-[0.08]" />
        <div className="max-w-6xl mx-auto px-5 py-16 relative">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display font-extrabold text-4xl sm:text-5xl text-crust-50 leading-[1.05] max-w-xl"
          >
            Hot, fresh, <span className="text-tomato-600">on its way.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-crust-100/70 mt-3 max-w-md"
          >
            Order from your favourite pizzerias, or build your own pie from scratch — base, sauce, cheese, toppings, your call.
          </motion.p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 -mt-6 relative">
        <div className="bg-white rounded-full shadow-md p-1.5 inline-flex gap-1">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === t ? 'bg-tomato-600 text-white' : 'text-char-800 hover:bg-crust-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-8">
        {loading ? (
          <p className="text-char-600">Loading stores…</p>
        ) : visible.length === 0 ? (
          <p className="text-char-600">No stores match this filter yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
