import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";

function Header({
  onToggleRole,
  isAdmin,
}: {
  onToggleRole: () => void;
  isAdmin: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 ${
        isScrolled
          ? "backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-800/50"
          : "backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
      }`}
    >
      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-lg font-semibold text-primary">
            FleetTracking
          </Link>
        </div>

        <div className="flex-1 hidden max-w-md mx-4 md:block">
          <Button variant="secondary" onClick={onToggleRole}>
            {isAdmin ? "Switch to Driver" : "Switch to Admin"}
          </Button>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
