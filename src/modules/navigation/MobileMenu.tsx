
import React from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-y-0 left-0 w-full xs:w-80 max-w-full bg-white z-50 overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Menu</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="divide-y">
          {/* Main categories */}
          <div>
            <LinkItem to="/" onClick={onClose}>Home</LinkItem>
            <LinkItem to="/watches" onClick={onClose}>Watches</LinkItem>
            <LinkItem to="/bags" onClick={onClose}>Bags</LinkItem>
            <LinkItem to="/perfumes" onClick={onClose}>Perfumes</LinkItem>
            <LinkItem to="/jewellery" onClick={onClose}>Jewellery</LinkItem>
            <LinkItem to="/accessories" onClick={onClose}>Accessories</LinkItem>
          </div>
          
          {/* Collections */}
          <div>
            <LinkItem to="/new-in" onClick={onClose}>New In</LinkItem>
            <LinkItem to="/sale" onClick={onClose}>Sale</LinkItem>
            <LinkItem to="/brands" onClick={onClose}>Brands</LinkItem>
          </div>
          
          {/* Info pages */}
          <div>
            <LinkItem to="/about-us" onClick={onClose}>About Us</LinkItem>
            <LinkItem to="/contact-us" onClick={onClose}>Contact Us</LinkItem>
            <LinkItem to="/store-locator" onClick={onClose}>Store Locator</LinkItem>
          </div>
          
          {/* Legal pages */}
          <div>
            <LinkItem to="/privacy-policy" onClick={onClose}>Privacy Policy</LinkItem>
            <LinkItem to="/terms-conditions" onClick={onClose}>Terms & Conditions</LinkItem>
            <LinkItem to="/returns" onClick={onClose}>Returns</LinkItem>
            <LinkItem to="/shipping-delivery" onClick={onClose}>Shipping & Delivery</LinkItem>
          </div>
          
          {/* Admin & Developer */}
          <div>
            <LinkItem to="/admin" onClick={onClose}>Admin</LinkItem>
            <LinkItem to="/tester" onClick={onClose}>
              <span className="flex items-center gap-2">
                <Bug className="h-4 w-4" /> Tester
              </span>
            </LinkItem>
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkItem: React.FC<{
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ to, onClick, children }) => {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
    >
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
};

export default MobileMenu;
