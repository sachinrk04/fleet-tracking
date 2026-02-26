import React from "react";
import { Button } from "./ui/button";
import { MoonIcon } from "lucide-react";
import { SunIcon } from "lucide-react";
import { useTheme } from "../hooks/theme-provider";

const ThemeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1 border rounded h-7 w-7"
      aria-label="Toggle theme"
      title="Toggle theme"
      type="button"
      variant="secondary"
    >
      {theme === "dark" ? (
        <MoonIcon className="size-4 text-primary-foreground" />
      ) : (
        <SunIcon className="size-4 text-primary" />
      )}
    </Button>
  );
};

export default ThemeToggle;
