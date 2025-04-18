
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import SecondaryNavigation from './SecondaryNavigation';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Prevent scrolling when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={(e) => {
        // Close menu when clicking overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="fixed right-0 top-0 h-full w-[90%] max-w-sm bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex-shrink-0" onClick={onClose}>
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <SearchBar />
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <MainNavigation />
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <SecondaryNavigation />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/sale" 
                  className="block p-2 hover:bg-gray-100 rounded-md"
                  onClick={onClose}
                >
                  Sale
                </Link>
              </li>
              <li>
                <Link 
                  to="/new-in" 
                  className="block p-2 hover:bg-gray-100 rounded-md"
                  onClick={onClose}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link 
                  to="/brands" 
                  className="block p-2 hover:bg-gray-100 rounded-md"
                  onClick={onClose}
                >
                  All Brands
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
