# PizzaHub — Multi-Store Pizza Ordering Platform

A full-stack pizza ordering & inventory management app: a multi-vendor
marketplace (several stores, each its own type — Pizzeria / Cloud Kitchen),
a 4-step custom pizza builder, cash-on-delivery checkout, live order
tracking, and an admin console for inventory + order management with
automated low-stock alerts.

## What's implemented right now

**User side**
- Register / login (JWT)
- Store marketplace with type filter (multi-vendor "store type" support)
- Store menu by category (Pizza, Sides, Drinks, Desserts)
- Custom pizza builder: base → sauce → cheese → vegetables (multi-select)
- Cart → checkout → **Cash on Delivery** order placement
- Order tracking dashboard, polling every 5s, kitchen-ticket styled UI

**Admin side**
- Separate admin login (`/admin/login`, not reachable from user signup)
- Inventory dashboard per store (bases, sauces, cheeses, vegetables)
- Stock auto-decrements when a custom pizza order is placed
- Manual stock +/- and direct-entry update per item
- Scheduled low-stock check (`node-cron`, every 15 min) that logs an alert
  and writes it to an admin-visible Alerts tab
- Order management: view all orders, change status
  (Order Received → In Kitchen → Sent to Delivery → Delivered), which the
  user's dashboard picks up on its next poll

## What's intentionally deferred (per current scope)

These were in the original brief but explicitly pushed to "later" in this
round, per your instructions:

- **Payment gateway (Razorpay)** — checkout is Cash on Delivery only for
  now. `backend/routes/orders.js` has a comment marking where to add a
  `/api/payments/create-order` + verification flow when you're ready.
- **Email verification on signup** — accounts are created and usable
  immediately. See the comment in `backend/routes/auth.js`.
- **Forgot-password email flow** — not built yet.
- **Real email for low-stock alerts** — currently logged to the console
  and saved to an in-app Alerts tab instead of emailed. See
  `backend/utils/lowStockJob.js` for the exact spot to plug in nodemailer.
- **Real-time via WebSockets** — order status updates use polling (every
  5s on the user side, every 6s on the admin side) rather than sockets.
  Works fine for typical order volumes; swap for `socket.io` later if you
  want push-based updates.

## Database note

This ships with a **file-based JSON database** (`backend/data/db.json`,
via lowdb) instead of a live MongoDB connection, since no MongoDB instance
is available in this environment. The document shapes match what your
Mongoose schemas would look like, so swapping in real MongoDB later is a
matter of:
1. `npm install mongoose`
2. Writing `models/*.js` schemas matching the shapes in `backend/data/db.js`
3. Replacing the `db.get(...).value()` calls in each route with the
   equivalent Mongoose model calls

## Running it locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env      # fill in JWT_SECRET at minimum
npm run seed               # populates demo stores, inventory, admin account
npm run dev                 # http://localhost:5000
```

**Frontend** (separate terminal)
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The frontend dev server proxies `/api` to `http://localhost:5000`, so run
the backend first.

### Demo accounts
- **Admin:** `admin@pizzahub.test` / `Admin@123` — log in at `/admin/login`
- **User:** register a new account from the app, or use the "Register" page

## Project structure

```
backend/
  data/         db.js (file-based DB), db.json (data), seed.js
  middleware/   auth.js (JWT verify + role guard)
  routes/       auth, stores, orders, inventory, notifications
  utils/        lowStockJob.js (node-cron)
  server.js

frontend/
  src/
    api.js               axios client w/ auto token attach
    context/              AuthContext (user + admin sessions), CartContext
    components/          Navbar, Layout, StoreCard, OrderTicket
    pages/                Home, StoreDetail, PizzaBuilder, Cart, Checkout,
                          OrderTracking, Login, Register, AdminLogin,
                          AdminDashboard
```

## Design notes

The visual identity leans into the subject: a kitchen order-ticket motif
(torn-paper edge, perforated dividers, monospace "receipt" type) drives the
order tracking screen, tying the UI back to how a real pizzeria's kitchen
tickets look and animate. Palette is charcoal / tomato-red / basil-green /
semolina-yellow rather than a generic template look.

## Suggested next steps
1. Wire up Razorpay test-mode checkout (their Node.js quickstart docs are
   the fastest path)
2. Add nodemailer + SMTP creds to turn low-stock alerts and email
   verification into real emails
3. Swap file-based DB for MongoDB + Mongoose once you have a connection
   string
4. Swap polling for `socket.io` if you want true real-time order status
