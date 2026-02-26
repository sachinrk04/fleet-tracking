import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ routes }: { routes: { path: string; name: string }[] }) => {
  const location = useLocation();

  return (
    <aside className="hidden w-64 border-r bg-card border-var md:block">
      <nav className="p-2 space-y-2">
        {routes.map((route: { path: string; name: string }) => {
          const isActive =
            location.pathname === route.path ||
            (route.path !== "/" && location.pathname.startsWith(route.path));
          return (
            <Link
              key={route.path}
              to={route.path}
              className={`block px-3 py-2 m-0 text-sm rounded hover:bg-primary/20 dark:bg-gray-800 hover:dark:bg-primary/20 ${
                isActive
                  ? "bg-primary/20 text-primary font-semibold dark:bg-primary/30"
                  : "bg-gray-100"
              }`}
            >
              {route.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
