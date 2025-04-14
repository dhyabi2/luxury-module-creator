
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface ViewDetailsButtonProps {
  isHovered: boolean;
  productId: string;
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ isHovered, productId }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleViewDetails = () => {
    navigate(`/product/${productId}`);
  };
  
  return (
    <>
      {/* Mobile-friendly view details button - always visible on small screens */}
      {isMobile ? (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-2.5 text-sm font-medium cursor-pointer"
          onClick={handleViewDetails}
        >
          View Details
        </div>
      ) : (
        <>
          {/* Desktop view details button */}
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-brand text-white text-center py-3 text-sm font-medium transform translate-y-full transition-transform duration-300 ${
              isHovered ? 'translate-y-0' : ''
            } cursor-pointer`}
            onClick={handleViewDetails}
          >
            View Details
          </div>
        </>
      )}
    </>
  );
};

export default ViewDetailsButton;
