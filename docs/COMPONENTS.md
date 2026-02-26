# App Hierarchy

├── postcss.config.js
├── src/
    ├── components/
    │   ├── ui/
    │   │   ├── aspect-ratio.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── textarea.tsx 
    │   │   ├── label.tsx 
    │   │   ├── input.tsx 
    │   │   ├── separator.tsx 
    │   │   ├── progress.tsx 
    │   │   ├── toaster.tsx 
    │   │   ├── sonner.tsx 
    │   │   ├── slider.tsx 
    │   │   ├── checkbox.tsx 
    │   │   ├── switch.tsx 
    │   │   ├── badge.tsx 
    │   │   ├── hover-card.tsx 
    │   │   ├── tooltip.tsx 
    │   │   ├── popover.tsx 
    │   │   ├── radio-group.tsx 
    │   │   ├── avatar.tsx 
    │   │   ├── toggle.tsx 
    │   │   ├── scroll-area.tsx 
    │   │   ├── alert.tsx 
    │   │   ├── resizable.tsx 
    │   │   ├── toggle-group.tsx 
    │   │   ├── tabs.tsx 
    │   │   ├── button.tsx 
    │   │   ├── card.tsx 
    │   │   ├── accordion.tsx 
    │   │   ├── input-otp.tsx 
    │   │   ├── breadcrumb.tsx 
    │   │   ├── pagination.tsx 
    │   │   ├── table.tsx 
    │   │   ├── drawer.tsx 
    │   │   ├── dialog.tsx
    │   │   ├── sheet.tsx
    │   │   ├── form.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── toast.tsx
    │   │   ├── command.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── select.tsx
    │   │   ├── carousel.tsx
    │   │   └── context-menu.tsx
    │   ├── RecenterMap.tsx
    │   ├── DriversList.tsx
    │   ├── AllocationsList.tsx 
    │   ├── HubsTerminalsList.tsx 
    │   ├── ThemeToggle.tsx 
    │   ├── Sidebar.tsx 
    │   ├── SelectedDriver.tsx 
    │   ├── FleetMap.tsx 
    │   ├── Header.tsx 
    │   ├── VehiclesList.tsx 
    │   ├── OrdersList.tsx 
    │   ├── CreateProduct.tsx 
    │   ├── AddDriver.tsx 
    │   ├── VehicleAdd.tsx 
    │   ├── AllocationsCreate.tsx 
    │   ├── AddHub.tsx 
    │   └── OrdersCreate.tsx 
    ├── lib/
    │   └── utils.ts
    ├── constants/
    │   └── ordersConstants.ts
    ├── types/ 
    │   ├── productSchema.ts
    │   ├── allocationSchema.ts
    │   ├── driverSchema.ts
    │   ├── vehicleSchema.ts
    │   ├── orderSchema.ts
    │   ├── models.ts
    │   └── hubSchema.ts
    ├── api/ 
    │   ├── apiClient.ts
    │   └── api.ts
    ├── global.d.ts
    ├── app/
    │   └── store.ts
    ├── layouts/
    │   ├── AdminLayout.tsx
    │   └── DriverLayout.tsx
    ├── routes/
    │   ├── driverRoutes.tsx
    │   └── adminRoutes.tsx
    ├── pages/ 
    │   ├── OrdersPage.tsx
    │   ├── AllocationsPage.tsx
    │   ├── DriversPage.tsx
    │   ├── HubsPage.tsx
    │   ├── VehiclesPage.tsx
    │   ├── AdminDashboard.tsx
    │   ├── ProductsPage.tsx
    │   ├── InventoryPage.tsx
    │   ├── DriverShift.tsx 
    │   └── VehicleLocationPage.tsx 
    ├── main.tsx
    ├── hooks/ 
    │   ├── theme-provider.tsx
    │   └── use-toast.ts 
    ├── App.tsx
    ├── index.css
    └── assets/
    │   └── react.svg
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── index.html
├── components.json
├── tsconfig.node.json
├── eslint.config.js
├── tsconfig.app.json
├── public/
    └── vite.svg
├── tailwind.config.js
├── README.md
└── package.json



# Component Hierarchy and Responsibilities

This document describes the React component tree and the responsibility of each major part of the fleet-tracking app.

---

## 1. Root hierarchy

```
main.tsx
  └── Provider (Redux)
        └── Router
              └── ThemeProvider
                    └── App
                          ├── Toaster
                          ├── Header
                          └── main (Routes)
                                ├── AdminLayout  (when isAdmin)
                                │     ├── Sidebar (admin routes)
                                │     └── children (admin page)
                                └── DriverLayout (when !isAdmin)
                                      ├── Sidebar (driver routes)
                                      └── children (driver page)
```

- **`main.tsx`** — Mounts the app with Redux `Provider`, React Router `Router`, and `ThemeProvider`; imports global styles and Leaflet CSS.
- **`App`** — Top-level shell: holds role state (admin vs driver), renders global `Header` and `Toaster`, and switches between admin and driver route sets. Renders either `AdminLayout` or `DriverLayout` with the appropriate `Routes`.

---

## 2. Layout components

| Component      | Path                 | Responsibility |
|----------------|----------------------|----------------|
| **Header**     | `components/Header`  | Fixed top bar: app branding (FleetTracking), role toggle (Switch to Admin/Driver), theme toggle. Scroll-based styling (blur, shadow). |
| **Sidebar**    | `components/Sidebar` | Left nav: receives a `routes` array, renders links with active state based on `useLocation()`. Used by both admin and driver layouts with different route configs. |
| **AdminLayout**| `layouts/AdminLayout`| Wraps all admin pages: flex layout with `Sidebar(adminRoutes)` and a main content area that renders the matched admin page. |
| **DriverLayout** | `layouts/DriverLayout` | Same structure for driver: `Sidebar(driverRoutes)` and main content for driver pages. |

---

## 3. Pages and their child components

### 3.1 Admin pages

| Page              | Route(s)     | Responsibility | Child components |
|-------------------|-------------|-----------------|------------------|
| **AdminDashboard**| `/`         | Admin home: fetches vehicles, shows refresh and fleet map. | `FleetMap` |
| **HubsPage**      | `/hubs`     | Hubs & terminals: list + add. | `HubsTerminalsList`, `AddHub` |
| **DriversPage**   | `/drivers`  | Drivers CRUD view. | `DriversList`, `AddDriver` |
| **VehiclesPage**  | `/vehicles` | Vehicles CRUD view. | `VehiclesList`, `VehicleAdd` |
| **ProductsPage**  | `/products` | Products list + create. | `CreateProduct` (inline list in page) |
| **OrdersPage**    | `/orders`   | Orders list + create. | `OrdersList`, `OrdersCreate` |
| **AllocationsPage** | `/allocations` | Vehicle allocations list + create. | `AllocationsList`, `AllocationsCreate` |
| **InventoryPage** | `/inventory` | Inventory dashboard per hub (product quantities, color-coded). | — (inline cards) |

### 3.2 Driver pages

| Page                  | Route(s)          | Responsibility | Child components |
|-----------------------|-------------------|----------------|------------------|
| **DriverDashboard**   | `/`               | Driver home: driver selector, current shift (allocation, vehicle, assigned orders), delivery actions (complete/fail), shift history. | `SelectedDriver` |
| **DriverShift**       | `/shift-history`  | Shift history view: driver selector, today’s allocations, assigned deliveries, complete/fail and GPS actions. | `SelectedDriver` |
| **VehicleLocationPage** | `/vehicle-location` | Live map: driver selector, driver/vehicle location, delivery destinations, polyline route, “Send GPS Update”. | `RecenterMap`, `SelectedDriver` |

---

## 4. Feature / reusable components

| Component         | Path                    | Responsibility |
|-------------------|-------------------------|----------------|
| **FleetMap**      | `components/FleetMap`   | Leaflet map: plots vehicle markers from `vehicles[]`; popups show registration, type, status. Centers on first vehicle or default coords. |
| **RecenterMap**   | `components/RecenterMap`| Leaflet hook component: uses `useMap()` to fly to `(lat, lng)` when props change. Renders nothing. |
| **SelectedDriver**| `components/SelectedDriver` | Driver dropdown: fetches drivers via API, controlled `Select`; `selectedDriverId` + `handleDriverChange`. Used on DriverDashboard, DriverShift, VehicleLocationPage. |
| **DriversList**   | `components/DriversList`   | Read-only list of drivers (name, license, phone) from API. |
| **HubsTerminalsList** | `components/HubsTerminalsList` | List/display of hubs and terminals (implementation may include edit/delete). |
| **AddHub**        | `components/AddHub`    | Form to create a new hub/terminal. |
| **AddDriver**     | `components/AddDriver` | Form to add a driver. |
| **VehicleAdd**    | `components/VehicleAdd`| Form to add a vehicle. |
| **VehiclesList**   | `components/VehiclesList` | List of vehicles. |
| **CreateProduct** | `components/CreateProduct` | Form to create a product. |
| **OrdersList**    | `components/OrdersList`   | List of orders (with filters/actions as implemented). |
| **OrdersCreate**  | `components/OrdersCreate` | Form to create an order. |
| **AllocationsList**  | `components/AllocationsList` | List of vehicle allocations. |
| **AllocationsCreate**| `components/AllocationsCreate` | Form to create an allocation. |
| **ThemeToggle**   | `components/ThemeToggle` | Toggle light/dark theme (consumes theme context). |

---

## 5. UI primitives

Under **`components/ui/`** live shared primitives (e.g. `button`, `card`, `dialog`, `tabs`, `select`, `input`, `toast`, etc.). These are building blocks used by the feature components and pages above. They do not contain business logic; they handle presentation and accessibility.

---

## 6. Data and routing

- **State:** Redux store and RTK Query hooks (`@/api/api`) for servers state; `localStorage` for role and selected driver id.
- **Routes:** `adminRoutes` and `driverRoutes` define path, element (page), and sidebar name; layouts receive the corresponding route array for the sidebar.
- **Theme:** `ThemeProvider` and `useTheme` in `hooks/theme-provider.tsx`; `ThemeToggle` in the header switches theme.

---

## 7. Summary diagram

```
App
├── Header (role toggle, theme)
├── Toaster
└── Routes
    ├── AdminLayout
    │   ├── Sidebar(adminRoutes)
    │   └── AdminDashboard | HubsPage | DriversPage | VehiclesPage | ProductsPage | OrdersPage | AllocationsPage | InventoryPage
    │         └── (per page: FleetMap, *List, *Create/Add, etc.)
    └── DriverLayout
          ├── Sidebar(driverRoutes)
          └── DriverDashboard | DriverShift | VehicleLocationPage
                └── SelectedDriver, RecenterMap, Cards, Dialogs, etc.
```
