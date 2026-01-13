import React, { useState, useEffect } from 'react';
import { Scale, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed w-full z-40 transition-all duration-300 ${
    isScrolled ? 'bg-navy-900/95 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
  }`;

  const linkClasses = `text-sm font-medium tracking-widest uppercase transition-colors duration-200 ${
    isScrolled ? 'text-gray-200 hover:text-gold-400' : 'text-white hover:text-gold-400'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scale className="w-8 h-8 text-gold-400" />
          <span className={`font-serif text-2xl font-bold tracking-tight ${isScrolled ? 'text-white' : 'text-white'}`}>
            HAL LEGAL
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#home" className={linkClasses}>Home</a>
          <a href="#about" className={linkClasses}>Firm</a>
          <a href="#practice" className={linkClasses}>Practice Areas</a>
          <a href="#contact" className={linkClasses}>Contact</a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-navy-900 text-white p-6 shadow-xl border-t border-gray-800">
          <div className="flex flex-col space-y-4 items-center">
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>Firm</a>
            <a href="#practice" onClick={() => setMobileMenuOpen(false)}>Practice Areas</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;