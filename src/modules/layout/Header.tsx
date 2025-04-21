
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainNavigation from '../navigation/MainNavigation';
import MobileMenu from '../navigation/MobileMenu';
import SearchBar from '../navigation/SearchBar';
import CartIcon from '../cart/components/CartIcon';
import CurrencySelector from '../currency/CurrencySelector';
import { Menu, Settings, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<string>('/logo.svg');
  const location = useLocation();
  
  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch logo from settings
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('logo_url')
          .single();
          
        if (error) {
          console.error('Error fetching logo:', error);
          return;
        }
        
        if (data && data.logo_url) {
          setLogo(data.logo_url);
        }
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
    
    fetchLogo();
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                 ${scrolled ? 'shadow-md bg-white/90 backdrop-blur-sm' : 'bg-white'}`}
    >
      {/* Top bar */}
      <div className="hidden md:block border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-xs text-gray-600">
            Welcome to our luxury watch store
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about-us" className="text-xs text-gray-600 hover:text-brand">About Us</Link>
            <Link to="/contact-us" className="text-xs text-gray-600 hover:text-brand">Contact Us</Link>
            <Link to="/store-locator" className="text-xs text-gray-600 hover:text-brand">Store Locator</Link>
            <Link to="/admin" className="text-xs text-gray-600 hover:text-brand">Admin</Link>
            <Link to="/tester" className="text-xs text-gray-600 hover:text-brand flex items-center gap-1">
              <Bug className="h-3 w-3" />
              Tester
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="border-b">
        <div className="container mx-auto px-4 flex flex-col">
          {/* Upper section */}
          <div className="flex justify-between items-center py-4">
            <div className="block md:hidden">
              <Button 
                variant="ghost" 
                className="p-1" 
                aria-label="Toggle menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6 text-brand" />
              </Button>
            </div>
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logo} 
                alt="M&K Watches" 
                className="h-12 md:h-16 object-contain"
              />
            </Link>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>
              <CartIcon />
            </div>
          </div>
          
          {/* Lower section */}
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="hidden md:block w-3/4">
                <MainNavigation />
              </div>
              <div className="w-full md:w-1/4">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
