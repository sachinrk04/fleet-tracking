# Fleet Tracking

A fleet tracking application built with React, TypeScript, and Vite. Track drivers and vehicles on a map with separate admin and driver dashboards.

## Prerequisites

- **Node.js** 18+ (recommend 20 LTS)
- **npm** 9+ (or yarn/pnpm)

## Setup

### 1. Clone and install

```bash
# From the project root
npm install
```

### 2. Run the app

Start the Vite dev server and the mock API (json-server) together:

```bash
npm run dev
```

This runs:

- **Vite** – frontend at [http://localhost:5173](http://localhost:5173)
- **json-server** – mock API at [http://localhost:4000](http://localhost:4000)

### 3. Optional: run services separately

```bash
# Terminal 1 – frontend only
npm run dev
# (Stop the dev script with Ctrl+C, then run Vite alone: npx vite)

# Or use the dedicated mock server script:
npm run mock:server   # API at http://localhost:4000
```

Then in another terminal:

```bash
npx vite   # Frontend at http://localhost:5173
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite + json-server (recommended for development) |
| `npm run mock:server` | Start only json-server (port 4000) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

- `src/` – React app (pages, components, layouts, routes)
- `mock/db.json` – Mock API data for json-server
- `@/` – Path alias for `src/` (e.g. `@/components/...`)

## Roles

- **Admin** – Admin dashboard and fleet overview.
- **Driver** – Driver dashboard and shift view.

Use the header toggle to switch between Admin and Driver; the choice is stored in `localStorage`.
