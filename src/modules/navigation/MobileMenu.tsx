
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import SecondaryNavigation from './SecondaryNavigation';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex-shrink-0" onClick={onClose}>
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </Link>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
