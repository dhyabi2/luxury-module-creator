
import React from 'react';

interface ProductSpecificationsProps {
  brand: string;
  gender?: string;
  caseSize?: number;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ 
  brand, 
  gender, 
  caseSize 
}) => {
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600">Brand</span>
        <span className="font-medium">{brand}</span>
      </div>
      {gender && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Gender</span>
          <span className="font-medium">{gender}</span>
        </div>
      )}
      {caseSize && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Case Size</span>
          <span className="font-medium">{caseSize}mm</span>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
