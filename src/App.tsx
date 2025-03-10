
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import BookmarkedProjects from "./pages/BookmarkedProjects";
import Membership from "./pages/Membership";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { applyTheme, getCurrentTheme } from "@/lib/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => {
  // Apply theme on app initialization
  useEffect(() => {
    const theme = getCurrentTheme();
    applyTheme(theme);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <div className="pt-16"> {/* Added padding to prevent content from being hidden under navbar */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/bookmarks" element={<BookmarkedProjects />} />
              <Route path="/membership" element={<Membership />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
