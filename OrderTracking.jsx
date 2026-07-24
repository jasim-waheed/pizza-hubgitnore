import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import OrderTicket from '../components/OrderTicket';

const POLL_MS = 5000;

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const fetchOrders = () => {
      api.get('/orders/mine').then(({ data }) => {
        if (!cancelled) {
          setOrders(data);
          setLoading(false);
        }
      });
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16 text-center text-char-600">
        <Link to="/login" className="text-tomato-600 underline">Log in</Link> to see your orders.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-extrabold text-2xl text-char-900">My orders</h1>
        <span className="text-xs text-char-600">Live · updates every {POLL_MS / 1000}s</span>
      </div>

      {loading ? (
        <p className="text-char-600 mt-6">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-char-600">No orders yet.</p>
          <Link to="/" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-tomato-600 text-white font-semibold">
            Order something
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => <OrderTicket key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
