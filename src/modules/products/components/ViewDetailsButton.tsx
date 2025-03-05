
import React from 'react';

interface ViewDetailsButtonProps {
  isHovered: boolean;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ isHovered }) => {
  return (
    <>
      {/* Mobile-friendly view details button - always visible on touch devices */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-2 sm:py-3 text-xs sm:text-sm font-medium transform translate-y-full transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : ''
        } md:hidden`}
      >
        View Details
      </div>
      
      {/* Desktop view details button */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-3 text-sm font-medium transform translate-y-full transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : ''
        } hidden md:block`}
      >
        View Details
      </div>
    </>
  );
};

export default ViewDetailsButton;
