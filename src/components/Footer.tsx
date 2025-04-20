
import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const { visitorCount, timeOfDay } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aurora-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <h3 className="text-xl font-bold mb-4">Diya Narula</h3>
            <p className="text-gray-300 mb-4">
              A passionate developer and designer creating elegant solutions at the intersection of technology and creativity.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/diya-narula-54087b2a5/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/diyanarula15"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://instagram.com/narula.diyaaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:diyanarula41@gmail.com"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <p className="text-gray-300 mb-2">Email: diyanarula41@gmail.com</p>
            <p className="text-gray-300 mb-2">Location: New Delhi, India</p>
            <p className="text-gray-300 mb-2">Student at: IIITD</p>
            <p className="text-gray-300 italic text-sm">
              Good {timeOfDay}! {visitorCount > 1 
                ? `You're one of ${visitorCount} visitors to explore my portfolio.` 
                : "You're the first visitor to my portfolio!"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Diya Narula. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
