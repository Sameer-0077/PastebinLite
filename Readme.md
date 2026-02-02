# Pastebin Lite

A lightweight Pastebin-like application where users can create text pastes and share a link to view them.
Pastes can optionally expire based on time (TTL) or number of views.

## Features

- Create a paste with arbitrary text
- Optional time-based expiry (TTL)
- Optional view-count limit
- Shareable URL to view paste
- Safe HTML rendering (XSS protected)
- Deterministic time support for automated testing

## Tech Stack

- Backend: Node.js, Express
- Frontend: React (Vite) + Tailwind CSS
- Persistence: Upstash Redis (serverless-safe)

## Running Locally

### Prerequisites

- Node.js >= 18
- Redis (Upstash or compatible)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `backend/`:

```env
PORT=8000
BASE_URL=http://localhost:5000
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Open the app at:

```
http://localhost:5173
```

## API Endpoints

### Health Check

```
GET /api/healthz
```

### Create Paste

```
POST /api/pastes
```

### Fetch Paste (API)

```
GET /api/pastes/:id
```

### View Paste (HTML)

```
GET /p/:id
```

## Persistence Layer

This application uses **Upstash Redis** as a persistence layer.
Upstash Redis is serverless-friendly and ensures data survives across requests in serverless environments such as Vercel.

## Notes

- API fetches increment view count
- HTML view does not increment views
- Expired or exhausted pastes return HTTP 404
- No secrets are committed to the repository
