# Application State Management

This app uses a **hybrid** approach: **Redux (RTK Query)** for server state, **React Context** for theme, and **local component state** for UI and page-specific data.

---

## 1. Redux + RTK Query (server/API state)

**Location:** `src/app/store.ts`, `src/api/api.ts`

- **Redux Toolkit** store is created in `src/app/store.ts` and wraps the app via `<Provider store={store}>` in `main.tsx`.
- **RTK Query** is the only reducer: it holds cache for all API data and handles loading/error state.
- **Tag-based cache invalidation:** endpoints use `providesTags` and mutations use `invalidatesTags` so related queries refetch after creates/updates.

**State held in Redux:**

| Data        | Endpoints / hooks |
|------------|--------------------|
| Hubs       | `useGetHubsQuery`, create/update hub mutations |
| Drivers    | `useGetDriversQuery`, `useCreateDriverMutation` |
| Vehicles   | `useGetVehiclesQuery`, create/update vehicle mutations |
| Products   | `useGetProductsQuery`, `useCreateProductMutation` |
| Orders     | `useGetOrdersQuery`, `useCreateOrderMutation`, `useUpdateOrderMutation` |
| Allocations| `useGetAllocationsQuery`, `useCreateAllocationMutation` |

**Usage:** Components use the generated hooks (e.g. `useGetDriversQuery()`, `useCreateOrderMutation()`) to read and mutate data. No `useSelector`/`useDispatch` for app logic; RTK Query hooks are the primary interface.

---

## 2. React Context (theme)

**Location:** `src/hooks/theme-provider.tsx`

- **ThemeProvider** holds `theme` (`"light"` | `"dark"`) in React state and syncs it to `document.documentElement` and `localStorage`.
- **useTheme()** exposes `{ theme, setTheme }` to any component inside the provider.

Theme is the only app-wide UI state managed via Context.

---

## 3. Local component state (UI & page state)

**Location:** various components and pages

- **App.tsx:** `isAdmin` (and persistence in `localStorage`) to switch between driver vs admin routes and header.
- **Header:** `isScrolled` for scroll-dependent styling.
- **DriverDashboard, DriverShift, VehicleLocationPage:** `selectedDriverId` (often initialized from `localStorage`) for which driver is active; DriverDashboard also uses `shiftStarted`, `failedOrderId`, `failedReason`.
- **FleetMap:** Receives `vehicles` as props; no internal state for list (center is derived from `vehicles`).
- **SelectedDriver:** Controlled component; `selectedDriverId` and `handleDriverChange` are passed as props from the parent page.

**Pattern:** Page-level state (e.g. selected driver, shift status) lives in the page component and is passed down as props. No global store or context for “selected driver.”

---

## 4. Toasts (external pattern)

**Location:** `src/hooks/use-toast.ts`

Toasts use a module-level state + setter pattern (not Redux, not Context in the usual sense). `useToast()` exposes methods to show/dismiss toasts; state is held in a shared module variable and updated via a setter, with components subscribing to that state.

---

## Summary

| Kind of state     | Where it lives              | How to access / update                    |
|-------------------|-----------------------------|-------------------------------------------|
| API / server data | Redux (RTK Query cache)     | `useGetXQuery()`, `useCreateXMutation()`   |
| Theme             | ThemeProvider context      | `useTheme()`                              |
| Role (admin/driver)| App `useState` + localStorage | Props + `toggleRole` in App              |
| Selected driver   | Page `useState` (per page)  | Props into `SelectedDriver`, FleetMap, etc. |
| Form/UI feedback  | Local `useState`            | In-component state                        |

For **new server-backed data**, add endpoints and tags in `src/api/api.ts` and use the generated hooks. For **new app-wide UI state**, prefer local state or props first; add Context only when many components need the same value without prop drilling.
