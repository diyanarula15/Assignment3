
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './ui/button';
import { Menu, X, Home, UserCircle, Briefcase, Phone, Volume2, VolumeX } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: <Home size={20} /> },
  { path: '/about', label: 'About', icon: <UserCircle size={20} /> },
  { path: '/projects', label: 'Projects', icon: <Briefcase size={20} /> },
  { path: '/contact', label: 'Contact', icon: <Phone size={20} /> }
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { activePage, setActivePage, soundEnabled, toggleSound } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (path: string) => {
    setActivePage(path === '/' ? 'home' : path.substring(1));
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3" onClick={() => handleNavClick('/')}>
            <motion.div 
              className={`font-semibold text-xl ${scrolled ? 'text-foreground' : 'text-primary'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-bold">Diya</span> Narula
            </motion.div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-all
                  ${activePage === (link.path === '/' ? 'home' : link.path.substring(1)) 
                    ? 'bg-primary text-white' 
                    : 'text-foreground hover:bg-secondary'}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSound} 
              className="ml-2"
              title={soundEnabled ? "Mute sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="mr-2"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-background border-t border-border"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md mb-2
                    ${activePage === (link.path === '/' ? 'home' : link.path.substring(1)) 
                      ? 'bg-primary text-white' 
                      : 'text-foreground hover:bg-secondary'}`}
                  onClick={() => handleNavClick(link.path)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
