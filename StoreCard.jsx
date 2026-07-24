import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function StoreCard({ store, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/stores/${store.id}`}
        className="block bg-white rounded-2xl overflow-hidden border border-char-800/5 shadow-sm hover:shadow-lg transition-shadow group"
      >
        <div
          className="h-32 relative bg-diagonal-lines flex items-end p-4"
          style={{ backgroundColor: store.coverColor }}
        >
          <span className="absolute top-3 right-3 bg-white/90 text-char-900 text-xs font-semibold px-2 py-1 rounded-full">
            {store.type}
          </span>
          <span className="text-4xl drop-shadow group-hover:scale-110 transition-transform origin-bottom-left">
            🍕
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-lg text-char-900 leading-tight">{store.name}</h3>
          <p className="text-sm text-char-600 mt-1">{store.city}</p>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="flex items-center gap-1 font-semibold text-basil-700">
              ★ {store.rating}
            </span>
            <span className="text-char-600 font-ticket">{store.etaMins} min</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {store.categories.map((c) => (
              <span key={c} className="text-[11px] bg-crust-100 text-char-800 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
