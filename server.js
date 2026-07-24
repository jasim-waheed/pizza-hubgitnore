require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const orderRoutes = require('./routes/orders');
const inventoryRoutes = require('./routes/inventory');
const notificationRoutes = require('./routes/notifications');
const { startLowStockJob } = require('./utils/lowStockJob');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'pizza-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Pizza backend running on http://localhost:${PORT}`);
  startLowStockJob();
});
