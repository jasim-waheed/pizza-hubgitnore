import { motion } from 'framer-motion';

const STEPS = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];

export default function OrderTicket({ order }) {
  const activeIndex = STEPS.indexOf(order.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ticket-edge bg-white rounded-b-xl shadow-md pt-5 pb-4 px-5 font-ticket text-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-char-600 text-xs uppercase tracking-wider">Order</p>
          <p className="font-semibold text-char-900">#{order.id.slice(0, 8)}</p>
        </div>
        <div className="text-right">
          <p className="text-char-600 text-xs uppercase tracking-wider">Total</p>
          <p className="font-semibold text-tomato-600">Rs. {order.total}</p>
        </div>
      </div>

      <p className="text-char-800 mt-2">{order.storeName}</p>
      <div className="perforation my-3" />

      <ul className="space-y-2">
        {order.items.map((it, i) => (
          <li key={i} className="flex justify-between text-char-800">
            <span>{it.qty}× {it.name}</span>
            <span>Rs. {it.unitPrice * it.qty}</span>
          </li>
        ))}
      </ul>

      <div className="perforation my-3" />

      <div className="flex justify-between">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-2.5 right-1/2 w-full h-0.5 -z-10 ${
                  i <= activeIndex ? 'bg-basil-600' : 'bg-char-800/10'
                }`}
              />
            )}
            <motion.div
              animate={{
                scale: i === activeIndex ? [1, 1.25, 1] : 1,
                backgroundColor: i <= activeIndex ? '#3C6E47' : '#e7e0d0'
              }}
              transition={{ duration: 0.6 }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] z-10"
            >
              {i < activeIndex ? '✓' : ''}
            </motion.div>
            <span
              className={`mt-1.5 text-[10px] text-center leading-tight ${
                i <= activeIndex ? 'text-basil-700 font-semibold' : 'text-char-600'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-[10px] text-char-600 mt-4 tracking-widest">
        {order.paymentMethod.toUpperCase()} · PLACED {new Date(order.createdAt).toLocaleTimeString()}
      </p>
    </motion.div>
  );
}
