# Technical decisions

This document records **why** certain libraries, patterns, and tools were chosen for the fleet-tracking app. For *what* we use (state layout, components), see [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) and [COMPONENTS.md](./COMPONENTS.md).

---

## Build and dev tooling

### Vite

- **Why:** Fast dev server and HMR, native ESM, minimal config. Replaces Create React App–style tooling without eject or heavy abstractions.
- **Trade-off:** No built-in SSR; this app is a client-side SPA, so that’s acceptable. Path alias `@/` is configured in `vite.config.ts` and `tsconfig` for clean imports.

### TypeScript

- **Why:** Shared types for API models, form schemas, and components; fewer runtime bugs and better editor support.
- **Where:** Types live in `src/types/` (e.g. `models.ts`, `*Schema.ts`). Zod schemas double as runtime validators and type sources.

---

## UI and styling

### shadcn/ui (Radix + Tailwind)

- **Why:** Accessible primitives (Radix), design system via Tailwind and CSS variables, and **copy-paste ownership** of components under `src/components/ui/` (no black-box dependency). `components.json` uses the **new-york** style and **neutral** base.
- **Pattern:** Radix handles behavior and a11y; Tailwind + `tailwind-merge` + `class-variance-authority` handle styling. No design-system npm dependency that can change under our feet.

### Tailwind CSS

- **Why:** Utility-first styling, consistent spacing/colors via config and CSS variables, good fit with shadcn. `tailwindcss-animate` used for transitions/animations.

### Lucide React

- **Why:** Icon set chosen by shadcn (see `components.json`). Single dependency, tree-shakeable, consistent look.

### Theme (next-themes–style pattern)

- **Why:** Theme is the only app-wide UI state that many components need. A small `ThemeProvider` (in `src/hooks/theme-provider.tsx`) keeps `theme` in React state, syncs to `document.documentElement` and `localStorage`, and exposes `useTheme()`. Avoids pulling in full next-themes in a non-Next app while keeping the same mental model.

---

## State management

### Redux Toolkit + RTK Query (server state only)

- **Why:** RTK Query gives request caching, loading/error state, and tag-based invalidation out of the box. All API access goes through one slice in `src/api/api.ts`; components use generated hooks (`useGetXQuery`, `useCreateXMutation`) instead of manual `fetch`/`useEffect`. No need for a separate client cache (e.g. React Query) when RTK Query covers server state.
- **Pattern:** Redux store holds **only** the RTK Query reducer. We do **not** use `useSelector`/`useDispatch` for app logic; hooks from `api.ts` are the primary interface. See [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md).

### React Context only for theme

- **Why:** Theme is the only truly global UI state. Role (admin/driver) and “selected driver” stay in page-level state (and `localStorage` where persistence is needed) to avoid unnecessary context and re-renders.

### Local state for UI and page scope

- **Why:** Scroll state, selected driver, shift status, modals, etc. are scoped to a page or component. Keeping them in `useState` (and props where shared with children) keeps the data flow clear and avoids a single giant store.

---

## Forms

### react-hook-form + Zod + @hookform/resolvers

- **Why:** Uncontrolled inputs and minimal re-renders; Zod gives a single schema for validation and TypeScript types; `@hookform/resolvers/zod` wires them so validation runs on submit and optionally on blur/change. All create/edit forms (AddDriver, VehicleAdd, OrdersCreate, AllocationsCreate, AddHub, CreateProduct) use this pattern.
- **Pattern:** Each entity has a schema in `src/types/*Schema.ts`; forms use `useForm<FormValues>({ resolver: zodResolver(schema) })` and shadcn `Form`, `FormField`, `FormItem` for consistent layout and error display.

---

## Maps

### Leaflet + react-leaflet

- **Why:** Mature, open-source mapping library; `react-leaflet` provides React-friendly components (`MapContainer`, `TileLayer`, `Marker`, `Popup`). Fits fleet use cases: markers for vehicles, popups for details, and optional polylines (e.g. on VehicleLocationPage). Tiles are OpenStreetMap via URL in `FleetMap.tsx`.
- **Trade-off:** Not a full GIS stack; sufficient for vehicle locations and simple routes. For heavy GIS or alternative tile providers, the same React components can be adapted.

---

## Routing

### React Router v7

- **Why:** Standard SPA routing: declarative routes, `useNavigate`, `useLocation`. Route config lives in `adminRoutes` and `driverRoutes`; layouts (`AdminLayout`, `DriverLayout`) receive the appropriate list and render `Sidebar` + children. Role switch (admin/driver) in `App` swaps which route set is mounted; no need for route-level auth in this mock setup.

---

## API and mocking

### json-server (mock backend)

- **Why:** REST API from a single JSON file (`mock/db.json`) with no custom server code. Run alongside Vite via `concurrently` in `npm run dev`. Easy to add entities and relationships; real backend can replace it by changing `baseUrl` in `src/api/api.ts` and adjusting payload shapes if needed.

### Axios not used; fetch via RTK Query

- **Why:** RTK Query uses `fetchBaseQuery` (fetch) by default. No need for Axios in the app; all requests are defined as endpoints and go through the RTK Query cache and tags.

---

## Toasts and feedback

### Sonner (via shadcn toaster)

- **Why:** Lightweight toast API; single `<Toaster />` at root in `App.tsx`. `useToast()` (or direct sonner API) used for success/error feedback after mutations. Keeps feedback pattern consistent without a heavy notification system.

---

## Summary table

| Area           | Choice                    | Main reason                                      |
|----------------|---------------------------|--------------------------------------------------|
| Build          | Vite                      | Fast ESM dev, simple config, path alias          |
| UI components  | shadcn/ui (Radix+Tailwind)| Accessible, ownable, design tokens               |
| Server state   | Redux Toolkit + RTK Query | Cache, loading/error, tags, one API slice        |
| Forms          | react-hook-form + Zod     | Uncontrolled, less re-renders, one schema/type   |
| Maps           | Leaflet + react-leaflet   | Mature, React bindings, OSM tiles                |
| Routing        | React Router v7           | SPA standard, layout + route config              |
| Mock API       | json-server               | Zero-code REST from JSON                         |
| Theme          | Custom ThemeProvider      | One global UI state, localStorage, no framework  |
| Toasts         | Sonner                    | Lightweight, used via shadcn toaster             |

When adding features: prefer existing patterns (RTK Query for server data, react-hook-form + Zod for forms, local state for page UI). Introduce a new library only when the current stack cannot cover the requirement.
