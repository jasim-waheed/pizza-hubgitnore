import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_FLOW = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];
const TABS = ['Orders', 'Inventory', 'Alerts'];
const GROUP_LABELS = { bases: 'Pizza bases', sauces: 'Sauces', cheeses: 'Cheeses', vegetables: 'Vegetables' };

export default function AdminDashboard() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState('all');

  const load = useCallback(() => {
    api.get('/orders').then(({ data }) => setOrders(data));
    api.get('/inventory').then(({ data }) => setInventory(data));
    api.get('/notifications').then(({ data }) => setAlerts(data));
    api.get('/stores').then(({ data }) => setStores(data));
  }, []);

  useEffect(() => {
    if (!admin) { navigate('/admin/login'); return; }
    load();
    const interval = setInterval(load, 6000);
    return () => clearInterval(interval);
  }, [admin, navigate, load]);

  if (!admin) return null;

  const updateStatus = async (orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    await api.patch(`/orders/${orderId}/status`, { status });
  };

  const updateStock = async (itemId, stock) => {
    setInventory((prev) => prev.map((i) => (i.id === itemId ? { ...i, stock } : i)));
    await api.patch(`/inventory/${itemId}`, { stock });
  };

  const visibleInventory = storeFilter === 'all' ? inventory : inventory.filter((i) => i.storeId === storeFilter);
  const grouped = ['bases', 'sauces', 'cheeses', 'vegetables'].map((g) => ({
    group: g,
    items: visibleInventory.filter((i) => i.group === g)
  }));

  return (
    <div className="min-h-screen bg-crust-50">
      <div className="bg-char-950 border-b border-char-800">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧑‍🍳</span>
            <span className="font-display font-extrabold text-crust-50">Admin console</span>
          </div>
          <button
            onClick={() => { adminLogout(); navigate('/'); }}
            className="text-sm px-3 py-1.5 rounded-full border border-char-800 text-crust-100/80 hover:text-crust-50"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-6">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                tab === t ? 'bg-tomato-600 text-white' : 'bg-white text-char-800 hover:bg-crust-100'
              }`}
            >
              {t}
              {t === 'Alerts' && alerts.length > 0 && (
                <span className="ml-1.5 bg-white text-tomato-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'Orders' && (
          <div className="mt-6 space-y-3">
            {orders.length === 0 && <p className="text-char-600">No orders yet.</p>}
            {orders.map((order) => (
              <motion.div
                layout
                key={order.id}
                className="bg-white rounded-xl border border-char-800/5 p-4 flex flex-wrap items-center gap-4 justify-between"
              >
                <div>
                  <p className="font-semibold text-char-900">#{order.id.slice(0, 8)} · {order.storeName}</p>
                  <p className="text-sm text-char-600">{order.userName} · Rs. {order.total} · {order.paymentMethod}</p>
                  <p className="text-xs text-char-600 mt-1">{order.address}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="rounded-full border border-char-800/15 px-3 py-2 text-sm font-medium text-char-900"
                >
                  {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'Inventory' && (
          <div className="mt-6">
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="rounded-full border border-char-800/15 px-3 py-2 text-sm mb-5"
            >
              <option value="all">All stores</option>
              {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            {grouped.map(({ group, items }) => (
              items.length > 0 && (
                <div key={group} className="mb-6">
                  <h3 className="font-display font-bold text-char-900 mb-2">{GROUP_LABELS[group]}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 ${
                          item.stock < item.threshold ? 'border-tomato-600 bg-tomato-100' : 'border-char-800/10 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-char-900 text-sm">{item.name}</p>
                          {item.stock < item.threshold && (
                            <span className="text-[10px] font-bold text-tomato-700">LOW</span>
                          )}
                        </div>
                        <p className="text-xs text-char-600 mt-0.5">Threshold: {item.threshold}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateStock(item.id, Math.max(0, item.stock - 1))}
                            className="w-7 h-7 rounded-full bg-crust-100 text-char-900 font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.stock}
                            onChange={(e) => updateStock(item.id, Number(e.target.value))}
                            className="w-16 text-center rounded-lg border border-char-800/15 py-1 text-sm"
                          />
                          <button
                            onClick={() => updateStock(item.id, item.stock + 1)}
                            className="w-7 h-7 rounded-full bg-crust-100 text-char-900 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {tab === 'Alerts' && (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-char-600 mb-3">
              Raised automatically by the scheduled low-stock job (every 15 min). Wire up nodemailer in
              <code className="mx-1 bg-white px-1.5 py-0.5 rounded">utils/lowStockJob.js</code> to also email these.
            </p>
            {alerts.length === 0 && <p className="text-char-600">No alerts right now.</p>}
            {alerts.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-tomato-600/30 p-3 text-sm text-char-800">
                <p>{a.message}</p>
                <p className="text-[11px] text-char-600 mt-1">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
