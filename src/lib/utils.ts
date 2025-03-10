
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a timestamp to a readable date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Apply theme based on user preference
export function applyTheme(theme: 'dark' | 'light'): void {
  if (theme === 'dark') {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.classList.remove("light-theme");
  } else {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
  }
}

// Get current theme
export function getCurrentTheme(): 'dark' | 'light' {
  return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
}
