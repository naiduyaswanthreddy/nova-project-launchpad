
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { WalletConnect } from "@/components/hive/WalletConnect";
import { JoinMovementSection } from "@/components/landing/JoinMovementSection";
import { CreateProjectForm } from "@/components/project/CreateProjectForm";
import { getConnectedUsername } from "@/utils/hive";
import { 
  Menu, 
  X, 
  Bookmark, 
  Home, 
  UserCircle, 
  Crown
} from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is connected
  useEffect(() => {
    const connectedUser = getConnectedUsername();
    setUsername(connectedUser);
  }, []);
  
  // Update username when window gets focus (in case user connects/disconnects in another tab)
  useEffect(() => {
    const handleFocus = () => {
      const connectedUser = getConnectedUsername();
      setUsername(connectedUser);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const openCreateProjectModal = () => {
    if (username) {
      setIsModalOpen(true);
    } else {
      // If not logged in, scroll to join section
      const joinSection = document.getElementById('join-section');
      if (joinSection) {
        joinSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If not on homepage, go to homepage and scroll to join section
        navigate('/#join-section');
      }
    }
  };
  
  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    // Projects link removed as requested
    { name: "My Projects", path: "/my-projects", icon: <UserCircle className="mr-2 h-4 w-4" /> },
    { name: "Bookmarks", path: "/bookmarks", icon: <Bookmark className="mr-2 h-4 w-4" /> },
    { name: "Membership", path: "/membership", icon: <Crown className="mr-2 h-4 w-4" /> },
  ];
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky ? 'bg-background/80 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold gradient-text">CrowdHive</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    location.pathname === link.path
                      ? 'text-white bg-primary/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={closeMenu}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Button 
                id="create-project-btn"
                onClick={openCreateProjectModal}
                className="ml-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Create Project
              </Button>
            </nav>
            
            {/* Right side items */}
            <div className="flex items-center">
              <ThemeSwitch />
              <div className="hidden md:block ml-2">
                <WalletConnect />
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
            ? 'max-h-screen opacity-100 visible glass-card border-t border-gray-800' 
            : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === link.path
                    ? 'text-white bg-primary/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={closeMenu}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Button 
              onClick={() => {
                openCreateProjectModal();
                closeMenu();
              }}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Create Project
            </Button>
            
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="px-3">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Create Project Modal */}
      <CreateProjectForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
