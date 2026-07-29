# FastAPI + SQLite MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal FastAPI + SQLite service and switch the React MVP from Mock/LocalStorage order data to API-backed persistence.

**Architecture:** Keep the backend in four files only: database connection, SQLAlchemy models, FastAPI routes, and dependency declarations. The React app calls `http://127.0.0.1:8000` directly; its existing presentation data remains local only for avatars, map coordinates, and service descriptions.

**Tech Stack:** Python, FastAPI, SQLAlchemy, SQLite, React, Vite, fetch API.

## Global Constraints

- Backend files are limited to `backend/main.py`, `backend/database.py`, `backend/models.py`, and `backend/requirements.txt`.
- Database tables are limited to `technicians` and `orders`.
- API surface is limited to `GET /technicians`, `POST /orders`, `GET /orders`, and `PUT /orders/{id}/status`.
- The frontend calls `http://127.0.0.1:8000` directly; FastAPI enables CORS for the Vite development origin.
- Do not add login, payment, permissions, a backend management UI, or a testing framework.
- Do not use LocalStorage as an order fallback; SQLite is the only order data source after this change.

---

### Task 1: Create the minimal database and API service

**Files:**
- Create: `backend/database.py`
- Create: `backend/models.py`
- Create: `backend/main.py`
- Create: `backend/requirements.txt`
- Modify: `.gitignore`

**Interfaces:**
- Produces: a FastAPI app exposed as `main:app` on port 8000.
- Produces: `GET /technicians` response records with `id`, `name`, `rating`, `distance`, and `price`.
- Produces: `POST /orders`, `GET /orders`, and `PUT /orders/{id}/status` endpoints.
- Consumes: JSON order creation body `{technician_id, service_name, price, date, time}`.

- [ ] **Step 1: Add backend dependencies and ignore the SQLite file**

Create `backend/requirements.txt`:

```text
fastapi
uvicorn
sqlalchemy
```

Add this line to `.gitignore`:

```text
backend/luohan.db
```

- [ ] **Step 2: Add database session setup**

Create `backend/database.py` with a SQLite URL pointing to `backend/luohan.db`, a `SessionLocal` session factory, and `Base = declarative_base()`.

- [ ] **Step 3: Add the two SQLAlchemy models**

Create `backend/models.py` with:

```python
class Technician(Base):
    __tablename__ = "technicians"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    distance = Column(Float, nullable=False)
    price = Column(Integer, nullable=False)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    technician_id = Column(Integer, ForeignKey("technicians.id"), nullable=False)
    service_name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    status = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
```

- [ ] **Step 4: Implement database initialization and four routes**

In `backend/main.py`:

1. Create tables on FastAPI startup.
2. Insert the three existing technicians only when `technicians` is empty.
3. Enable CORS for `http://localhost:5173` and `http://127.0.0.1:5173`.
4. Implement the four API routes.

`GET /orders` joins `Order` with `Technician` and returns `technician_name` so the frontend can render history and details without another endpoint.

`PUT /orders/{id}/status` rejects status outside `0` through `3` with HTTP 400 and unknown IDs with HTTP 404.

- [ ] **Step 5: Run manual API verification**

Run the backend:

```powershell
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --port 8000
```

In another terminal, verify the live API:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/technicians
Invoke-RestMethod http://127.0.0.1:8000/orders
```

Create one order with `Invoke-RestMethod -Method Post`, then call the status route with `-Method Put`. Verify the order remains in `GET /orders` after restarting the backend.

- [ ] **Step 6: Commit backend service**

```bash
git add backend .gitignore
git commit -m "feat: add FastAPI SQLite backend"
```

### Task 2: Replace frontend technician loading with the API

**Files:**
- Create: `src/services/api.js`
- Modify: `src/pages/TechnicianList.jsx`
- Modify: `src/components/TechnicianMap.jsx`
- Modify: `src/style.css`

**Interfaces:**
- Produces: `api.getTechnicians()` returning the API technician array.
- Consumes: `GET http://127.0.0.1:8000/technicians`.
- Produces: a technician list that merges API business fields with existing local visual fields by `id`.

- [ ] **Step 1: Add the failing UI expectation manually**

With the backend stopped, open the homepage and confirm the page displays a short load-error notice while preserving the existing page shell. This establishes that the new data source must be visible to the user when unavailable.

- [ ] **Step 2: Add the API request helper**

Create `src/services/api.js` with `const API_BASE_URL = 'http://127.0.0.1:8000'`, a response checker that throws on non-2xx responses, and `getTechnicians()`.

- [ ] **Step 3: Implement async technician loading**

In `TechnicianList.jsx`, use `useEffect` to call `getTechnicians()`. Merge each returned item into the matching record from `src/data/technicians.js` so local `avatar`, `color`, `latitude`, `longitude`, `services`, `title`, `intro`, `tags`, and `completed` are retained while `name`, `rating`, `distance`, and `price` come from SQLite.

Render a compact loading state while waiting and an inline error card if the request fails. Pass the loaded list to both `TechnicianMap` and `TechnicianCard`.

- [ ] **Step 4: Verify the homepage manually**

Start both servers and refresh the homepage. Confirm the three API-seeded technicians, their map markers, sorting by API distance, search, and detail links still work.

- [ ] **Step 5: Commit API-backed technician list**

```bash
git add src/services/api.js src/pages/TechnicianList.jsx src/components/TechnicianMap.jsx src/style.css
git commit -m "feat: load technicians from API"
```

### Task 3: Replace LocalStorage orders with API-backed orders

**Files:**
- Modify: `src/services/orderService.js`
- Modify: `src/pages/Booking.jsx`
- Modify: `src/pages/OrderStatusPage.jsx`
- Modify: `src/pages/OrderDetail.jsx`
- Modify: `src/pages/OrderList.jsx`
- Modify: `src/style.css`

**Interfaces:**
- Produces: async `orderService.createOrder`, `getOrders`, `getOrderById`, and `updateOrderStatus` methods.
- Consumes: `POST /orders`, `GET /orders`, and `PUT /orders/{id}/status`.
- Produces: frontend order records normalized to `{id, technician, service, appointment, status, createdAt}`.

- [ ] **Step 1: Establish LocalStorage removal expectation manually**

In browser devtools, note the current `luohan_orders` key. After this task, creating a new order must work while changes to or deletion of that key do not alter the order list.

- [ ] **Step 2: Implement API order methods**

Replace LocalStorage reads and writes in `orderService.js` with async calls to `api.js`.

Normalize each backend order into the existing UI shape:

```javascript
{
  id: String(order.id),
  technician: { id: order.technician_id, name: order.technician_name, avatar: '' },
  service: { name: order.service_name, price: order.price, duration: '' },
  appointment: { date: order.date, time: order.time },
  status: order.status,
  createdAt: order.created_at,
}
```

`getOrderById(id)` awaits `getOrders()` and finds the matching string ID.

- [ ] **Step 3: Await all page-level service calls**

Update Booking to await order creation before navigating to `/order-status/:id`. Update task, detail, and list pages to fetch asynchronously in effects. Update status advancement to await the PUT response before updating UI state. Display an inline request error on affected pages rather than silently falling back to LocalStorage.

- [ ] **Step 4: Verify end-to-end persistence manually**

1. Select a technician and submit an appointment.
2. Confirm the returned numeric order ID is used in the task and detail routes.
3. Refresh order detail and history pages; confirm the order remains.
4. Advance status, refresh, and confirm it remains changed.
5. Create two additional orders and confirm `/orders` shows newest first.
6. Delete `luohan_orders` in browser storage and confirm API-backed history is unchanged.

- [ ] **Step 5: Build the frontend**

```bash
pnpm run build
```

Expected: Vite completes successfully.

- [ ] **Step 6: Commit API-backed orders**

```bash
git add src/services/orderService.js src/pages/Booking.jsx src/pages/OrderStatusPage.jsx src/pages/OrderDetail.jsx src/pages/OrderList.jsx src/style.css
git commit -m "feat: persist orders through API"
```

### Task 4: Update developer documentation

**Files:**
- Modify: `README.md`
- Modify: `项目说明.md`

**Interfaces:**
- Produces: accurate startup and architecture documentation for both services.

- [ ] **Step 1: Document dual-service startup**

Add the backend commands and the frontend `pnpm run dev` command. State that both processes must run during development.

- [ ] **Step 2: Document data ownership**

State that `backend/luohan.db` stores technicians and orders, while frontend mock data only supplements the visual presentation and map/service details.

- [ ] **Step 3: Verify documentation commands**

Run the documented backend and frontend commands from a fresh terminal in the stated directories.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md 项目说明.md
git commit -m "docs: describe backend startup"
```

## Plan Self-Review

- Spec coverage: Tasks 1 through 4 cover the required two tables, four APIs, frontend replacement, persistence, status update, startup instructions, and out-of-scope restrictions.
- No-placeholder check: this plan contains no incomplete implementation placeholders.
- Interface consistency: all order pages use the async order service; all order service calls map to the specified four endpoints.
