import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { useCart } from '../context/CartContext';

const STEPS = [
  { key: 'base', label: 'Choose a base', group: 'bases', multi: false },
  { key: 'sauce', label: 'Choose a sauce', group: 'sauces', multi: false },
  { key: 'cheese', label: 'Choose your cheese', group: 'cheeses', multi: false },
  { key: 'vegetables', label: 'Pick your toppings', group: 'vegetables', multi: true }
];

const BASE_PRICE = 649;

export default function PizzaBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [store, setStore] = useState(null);
  const [options, setOptions] = useState(null);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState({ base: null, sauce: null, cheese: null, vegetables: [] });

  useEffect(() => {
    api.get(`/stores/${id}`).then(({ data }) => setStore(data));
    api.get(`/stores/${id}/builder-options`).then(({ data }) => setOptions(data));
  }, [id]);

  if (!options || !store) {
    return <p className="max-w-3xl mx-auto px-5 py-10 text-char-600">Loading builder…</p>;
  }

  const current = STEPS[step];
  const list = options[current.group];

  const isSelected = (item) =>
    current.multi ? choice.vegetables.some((v) => v.id === item.id) : choice[current.key]?.id === item.id;

  const select = (item) => {
    if (current.multi) {
      setChoice((c) => ({
        ...c,
        vegetables: c.vegetables.some((v) => v.id === item.id)
          ? c.vegetables.filter((v) => v.id !== item.id)
          : [...c.vegetables, item]
      }));
    } else {
      setChoice((c) => ({ ...c, [current.key]: item }));
    }
  };

  const canProceed = current.multi ? true : Boolean(choice[current.key]);

  const extras = () =>
    (choice.base?.extraPrice || 0) +
    (choice.sauce?.extraPrice || 0) +
    (choice.cheese?.extraPrice || 0) +
    choice.vegetables.reduce((s, v) => s + v.extraPrice, 0);

  const total = BASE_PRICE + extras();

  const finish = () => {
    addItem(
      {
        name: `Custom Pizza (${choice.base.name})`,
        unitPrice: total,
        qty: 1,
        isCustom: true,
        baseId: choice.base.id,
        sauceId: choice.sauce.id,
        cheeseId: choice.cheese.id,
        vegIds: choice.vegetables.map((v) => v.id),
        summary: `${choice.base.name} · ${choice.sauce.name} · ${choice.cheese.name} · ${
          choice.vegetables.map((v) => v.name).join(', ') || 'no extra toppings'
        }`
      },
      store.id,
      store.name
    );
    navigate('/cart');
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-char-900">Build your own pizza</h1>
      <p className="text-char-600 mt-1">{store.name}</p>

      {/* Progress */}
      <div className="flex items-center gap-2 mt-6">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex-1">
            <div className={`h-1.5 rounded-full ${i <= step ? 'bg-tomato-600' : 'bg-char-800/10'}`} />
            <p className={`text-xs mt-1.5 ${i === step ? 'text-tomato-600 font-semibold' : 'text-char-600'}`}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {list.map((item) => (
            <button
              key={item.id}
              disabled={!item.inStock}
              onClick={() => select(item)}
              className={`text-left rounded-xl border p-4 transition-all ${
                isSelected(item)
                  ? 'border-tomato-600 bg-tomato-100 ring-2 ring-tomato-600'
                  : 'border-char-800/10 bg-white hover:border-tomato-600/50'
              } ${!item.inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <p className="font-semibold text-char-900">{item.name}</p>
              <p className="text-xs text-char-600 mt-1">
                {item.extraPrice > 0 ? `+ Rs. ${item.extraPrice}` : 'Included'}
              </p>
              {!item.inStock && <p className="text-[10px] text-tomato-600 mt-1">Out of stock</p>}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-full text-char-800 disabled:opacity-30"
        >
          ← Back
        </button>
        <p className="font-ticket text-char-800">Running total: Rs. {total}</p>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
            className="px-5 py-2.5 rounded-full bg-tomato-600 text-white font-semibold disabled:opacity-30"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={finish}
            disabled={!canProceed}
            className="px-5 py-2.5 rounded-full bg-basil-600 text-white font-semibold disabled:opacity-30"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}
