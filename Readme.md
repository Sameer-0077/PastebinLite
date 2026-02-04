# Pastebin-Lite (Backend)

A lightweight Pastebin-like backend service where users can create text pastes and share them via a unique URL.
Each paste can optionally expire based on time (TTL) or view count, after which it becomes unavailable.

This project is built as part of a take-home assignment and is designed to be testable via automated graders.

---

## 🚀 Live Deployment

Backend deployed on **Render**:

```
https://pastebinlite-wdmy.onrender.com
```

Example endpoints:

- Health check: `/api/healthz`
- Create paste: `/api/pastes`
- Fetch paste: `/api/pastes/:id`
- View paste (HTML): `/p/:id`

---

## 🧠 Core Features

- Create a paste with arbitrary text
- Generate a shareable URL for each paste
- Fetch paste content via API
- View paste in browser (HTML)
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic expiry testing via request headers
- Safe rendering (no script execution)

---

## 🛠 Tech Stack (Backend)

- Node.js
- Express.js
- Upstash Redis (persistence)
- nanoid (unique paste IDs)
- Render (deployment)

---

## 📦 Persistence Layer

Upstash Redis is used as the persistence layer.

Why Redis:

- Persists data across requests and restarts
- Supports atomic operations (important for view limits)
- Fast and simple key-value access
- Works well with Render deployments

Paste data includes:

- content
- created timestamp
- optional expiry timestamp
- remaining view count

---

## 🔌 API Endpoints

### Health Check

```
GET /api/healthz
```

Response:

```json
{ "ok": true }
```

---

### Create a Paste

```
POST /api/pastes
```

Request body:

```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Rules:

- content is required and must be a non-empty string
- ttl_seconds (optional) must be an integer ≥ 1
- max_views (optional) must be an integer ≥ 1

Response:

```json
{
  "id": "abc123",
  "url": "https://<domain>/p/abc123"
}
```

---

### Fetch a Paste (API)

```
GET /api/pastes/:id
```

Response:

```json
{
  "content": "Hello world",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

Each successful fetch counts as a view.
Unavailable pastes return HTTP 404.

---

### View a Paste (HTML)

```
GET /p/:id
```

- Returns HTML containing the paste content
- Returns HTTP 404 if the paste is unavailable
- Content is rendered safely (no scripts executed)

---

## ⏱ Deterministic Time Testing

If the environment variable is set:

```
TEST_MODE=1
```

Then the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

is used as the current time for expiry checks only.

---

## 🧪 Running Locally

### Prerequisites

- Node.js (v18+ recommended)
- Upstash Redis credentials

### Environment Variables

Create a `.env` file inside the backend directory:

```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NODE_ENV=development
```

### Install dependencies

```bash
cd backend
npm install
```

### Start the server

```bash
npm run dev
```

Server runs at:

```
http://localhost:8000
```

---

## ☁️ Deployment (Render)

- Platform: Render
- Service type: Web Service
- Runtime: Node
- Root directory: backend

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Render automatically provides the PORT environment variable.

---

## 📁 Backend Project Structure

```
backend/
 ├── src/
 │   ├── app.js
 │   ├── server.js
 │   ├── routes/
 │   ├── controllers/
 │   └── utils/
 ├── package.json
 └── README.md
```

---

## 📝 Notes & Design Decisions

- Redis is used instead of in-memory storage to ensure persistence.
- View counts never go negative.
- URLs are generated dynamically from the request host.
- Backend is deployed independently of the frontend for simplicity.
