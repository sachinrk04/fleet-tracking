import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import DriverLayout from "./layouts/DriverLayout";
import { driverRoutes } from "./routes/driverRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "./components/ui/toaster";

function App() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });

  const toggleRole = () => {
    const newIsAdmin = !isAdmin;
    setIsAdmin(newIsAdmin);

    localStorage.setItem("isAdmin", newIsAdmin.toString());

    navigate("/", { replace: true });
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen">
        <Header onToggleRole={toggleRole} isAdmin={isAdmin} />
        <main className="mx-auto mt-16">
          {isAdmin ? (
            <Routes>
              {adminRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element as React.ReactNode}
                    </AdminLayout>
                  }
                />
              ))}
            </Routes>
          ) : (
            <Routes>
              {driverRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <DriverLayout>
                      {route.element as React.ReactNode}
                    </DriverLayout>
                  }
                />
              ))}
            </Routes>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
