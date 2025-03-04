
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Phone, User } from 'lucide-react';
import MainNavigation from '../navigation/MainNavigation';
import SecondaryNavigation from '../navigation/SecondaryNavigation';
import SearchBar from '../navigation/SearchBar';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-md' : 'bg-black'}`}>
      {/* Top Bar */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-medium tracking-wider">OMAN</span>
            <span className="text-xs opacity-70">عمان</span>
          </div>
          
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-1 flex items-center justify-center bg-black rounded-full border-2 border-white/20 shadow-lg">
              <img src="/logo.svg" alt="MNK Watches" className="w-12 h-12 md:w-14 md:h-14" />
            </div>
            <span className="font-serif tracking-widest text-base md:text-lg whitespace-nowrap">MNK Watches</span>
          </Link>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="hidden md:flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              <span className="whitespace-nowrap tracking-wide">9 AM TO 9 PM | +968 9291120</span>
            </div>
            <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
              <User className="w-4 h-4 mr-1" />
              <span className="hidden md:inline whitespace-nowrap tracking-wide">LOGIN / REGISTER</span>
              <span className="md:hidden">LOGIN</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <MainNavigation />
      
      {/* Secondary Navigation */}
      <div className="bg-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full overflow-x-auto py-2 no-scrollbar">
            <SecondaryNavigation />
          </div>
          <SearchBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
