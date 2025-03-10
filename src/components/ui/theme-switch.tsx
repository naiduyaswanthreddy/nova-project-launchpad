
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const ThemeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();

  // On mount, check if the user has a preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      applyLightMode();
    } else {
      setIsDarkMode(true);
      applyDarkMode();
    }
  }, []);

  // Apply dark mode styles
  const applyDarkMode = () => {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.classList.remove("light-theme");
    
    // Apply CSS variables for dark mode
    document.documentElement.style.setProperty("--background", "240 10% 3.9%");
    document.documentElement.style.setProperty("--foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--card", "240 10% 3.9%");
    document.documentElement.style.setProperty("--card-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--popover", "240 10% 3.9%");
    document.documentElement.style.setProperty("--popover-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--primary", "272 76% 53%");
    document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--secondary", "240 3.7% 15.9%");
    document.documentElement.style.setProperty("--secondary-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--muted", "240 3.7% 15.9%");
    document.documentElement.style.setProperty("--muted-foreground", "240 5% 64.9%");
    document.documentElement.style.setProperty("--accent", "240 3.7% 15.9%");
    document.documentElement.style.setProperty("--accent-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--destructive", "0 62.8% 30.6%");
    document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--border", "240 3.7% 15.9%");
    document.documentElement.style.setProperty("--input", "240 3.7% 15.9%");
    document.documentElement.style.setProperty("--ring", "240 4.9% 83.9%");
  };
  
  // Apply light mode styles
  const applyLightMode = () => {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
    
    // Apply CSS variables for light mode
    document.documentElement.style.setProperty("--background", "0 0% 100%");
    document.documentElement.style.setProperty("--foreground", "240 10% 3.9%");
    document.documentElement.style.setProperty("--card", "0 0% 100%");
    document.documentElement.style.setProperty("--card-foreground", "240 10% 3.9%");
    document.documentElement.style.setProperty("--popover", "0 0% 100%");
    document.documentElement.style.setProperty("--popover-foreground", "240 10% 3.9%");
    document.documentElement.style.setProperty("--primary", "272 76% 53%");
    document.documentElement.style.setProperty("--primary-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--secondary", "240 4.8% 95.9%");
    document.documentElement.style.setProperty("--secondary-foreground", "240 5.9% 10%");
    document.documentElement.style.setProperty("--muted", "240 4.8% 95.9%");
    document.documentElement.style.setProperty("--muted-foreground", "240 3.8% 46.1%");
    document.documentElement.style.setProperty("--accent", "240 4.8% 95.9%");
    document.documentElement.style.setProperty("--accent-foreground", "240 5.9% 10%");
    document.documentElement.style.setProperty("--destructive", "0 84.2% 60.2%");
    document.documentElement.style.setProperty("--destructive-foreground", "0 0% 98%");
    document.documentElement.style.setProperty("--border", "240 5.9% 90%");
    document.documentElement.style.setProperty("--input", "240 5.9% 90%");
    document.documentElement.style.setProperty("--ring", "240 5.9% 10%");
  };

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      // Switch to dark mode
      applyDarkMode();
      localStorage.setItem("theme", "dark");
      toast({
        title: "Dark mode activated",
        description: "The application is now in dark mode",
      });
    } else {
      // Switch to light mode
      applyLightMode();
      localStorage.setItem("theme", "light");
      toast({
        title: "Light mode activated",
        description: "The application is now in light mode",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full w-10 h-10 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};
