
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '@/modules/navigation/MainNavigation';
import SecondaryNavigation from '@/modules/navigation/SecondaryNavigation';
import SearchBar from '@/modules/navigation/SearchBar';
import MobileMenu from '@/modules/navigation/MobileMenu';
import { CartIcon } from '@/modules/cart/components/CartIcon';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.svg');

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('logo_url')
          .single();
        
        if (error) {
          console.error('Error fetching logo URL:', error);
          return;
        }
        
        if (data && data.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch (err) {
        console.error('Failed to fetch logo URL:', err);
      }
    };
    
    fetchLogoUrl();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Left section: Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="h-8 sm:h-12 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/logo.svg'; // Fallback to default logo
                console.error('Error loading logo image:', logoUrl);
              }}
            />
          </Link>
          
          {/* Center section: Main nav (show on desktop) */}
          <div className="hidden lg:block">
            <MainNavigation />
          </div>
          
          {/* Right section: Search and mobile menu */}
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            {/* Add CartIcon component here */}
            <CartIcon />
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Open mobile menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="container mx-auto px-4">
          <SecondaryNavigation />
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </header>
  );
};

export default Header;
