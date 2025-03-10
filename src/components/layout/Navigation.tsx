
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { WalletConnect } from "@/components/hive/WalletConnect";
import { Menu, X, Rocket } from "lucide-react";
import { CreateProjectForm } from "@/components/project/CreateProjectForm";
import { getConnectedUsername } from "@/utils/hive";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // If we're on the homepage, scroll to the section
    if (window.location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're not on the homepage, navigate to homepage and then scroll
      navigate("/");
      // Need to wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setIsMobileMenuOpen(false);
  };

  const handleStartProject = () => {
    const username = getConnectedUsername();
    
    // If not connected, we can either redirect to connect page or show the modal
    // (which will show a connect wallet message)
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-background/80 backdrop-blur-md shadow-md' : 'py-4 bg-transparent'}`}>
        <div className="container px-4 mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold gradient-text mr-8">
              <Link to="/">CrowdHive</Link>
            </h1>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                How It Works
              </button>
              <Link
                to="/projects"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Projects
              </Link>
              <button 
                onClick={() => scrollToSection('why-choose-us')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Why Choose Us
              </button>
              <Link
                to="/my-projects"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                My Projects
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeSwitch />
            <div className="hidden md:block">
              <WalletConnect />
            </div>
            <Button 
              className="hidden md:inline-flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              onClick={handleStartProject}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Start a Project
            </Button>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card shadow-lg px-4 py-5 border-t border-border animate-in slide-in-from-top">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
              >
                How It Works
              </button>
              <Link
                to="/projects"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <button 
                onClick={() => scrollToSection('why-choose-us')}
                className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
              >
                Why Choose Us
              </button>
              <Link
                to="/my-projects"
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Projects
              </Link>
              <div className="py-2">
                <WalletConnect />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleStartProject();
                }}
              >
                <Rocket className="mr-2 h-4 w-4" />
                Start a Project
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Create Project Modal */}
      <CreateProjectForm 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};
