import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useCart } from '@/modules/cart/context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
const MainNavigation = () => {
  // Static navigation data
  const [mainCategories] = useState([{
    id: 'women',
    name: 'WOMEN',
    active: true
  }, {
    id: 'men',
    name: 'MEN',
    active: false
  }, {
    id: 'new-in',
    name: 'NEW IN',
    active: false
  }, {
    id: 'sale',
    name: 'SALE',
    active: false
  }]);
  const isMobile = useIsMobile();
  const {
    cart
  } = useCart();
  return <div className="flex items-center justify-between w-full">
      {isMobile ?
    // Mobile view
    <div className="flex flex-col w-full space-y-2">
          {mainCategories.map(category => <Link key={category.id} to={`/${category.id}`} className={`py-2 px-3 text-sm font-medium rounded-md w-full ${category.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              {category.name}
            </Link>)}
          
          <Link to="/admin" className="py-2 px-3 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </Link>
          
          {isMobile && <Button variant="ghost" size="icon" className="self-start">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>}
        </div> :
    // Desktop view
    <div className="flex-1 flex items-center justify-between md:px-2">
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="font-medium text-base flex items-center">
              <Link to="/" className="hidden md:flex items-center">
                
                <span className="text-lg font-bold text-primary mr-6">MKWatches</span>
              </Link>
              
              <nav className="flex items-center space-x-2 md:space-x-4">
                {mainCategories.map(category => <Link key={category.id} to={`/${category.id}`} className={`py-2 px-3 text-sm font-medium rounded-md ${category.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                    {category.name}
                  </Link>)}
                
                <Link to="/admin" className="py-2 px-3 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </div>}
    </div>;
};
export default MainNavigation;