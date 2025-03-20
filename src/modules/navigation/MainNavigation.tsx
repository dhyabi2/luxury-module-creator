import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { fetchNavigationData } from '@/utils/apiUtils';
import { NavigationResponse, MainCategory } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Search, Menu, ShoppingCart } from 'lucide-react';
import { useCart } from '@/modules/cart/CartContext';

const MainNavigation = () => {
  const [navigationData, setNavigationData] = useState<NavigationResponse | null>(null);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  
  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const data = await fetchNavigationData();
        setNavigationData(data);
        setMainCategories(data.mainCategories || []);
      } catch (error) {
        console.error('Failed to load navigation data:', error);
      }
    };
    
    loadNavigationData();
  }, []);

  return (
    <div className="flex-1 flex items-center justify-between md:px-2">
      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="font-medium text-base flex items-center">
          {/* Keep existing logo and brand */}
          <Link to="/" className="hidden md:flex items-center">
            <img src="/logo.svg" alt="Brand Logo" className="h-6 w-auto mr-2" />
            <span className="text-lg font-bold text-primary mr-6">Luxury Watches</span>
          </Link>
          
          {/* Main navigation links */}
          <nav className="flex items-center space-x-2 md:space-x-4">
            {/* Existing navigation links will remain here */}
            {mainCategories.map(category => (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className={`py-2 px-3 text-sm font-medium rounded-md ${
                  category.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                {category.name}
              </Link>
            ))}
            
            {/* Admin link - new addition */}
            <Link 
              to="/admin" 
              className="py-2 px-3 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        
        <Link to="/cart" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default MainNavigation;
