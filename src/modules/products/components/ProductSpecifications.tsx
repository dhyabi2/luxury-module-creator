
import React from 'react';

export interface ProductSpecificationsProps {
  caseMaterial?: string;
  caseSize?: number | undefined;
  dialColor?: string;
  movement?: string;
  waterResistance?: string;
  strapMaterial?: string;
  strapColor?: string;
  brand?: string;
  gender?: string;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ 
  brand,
  gender,
  caseSize,
  caseMaterial,
  dialColor,
  movement,
  waterResistance,
  strapMaterial,
  strapColor
}) => {
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      {brand && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Brand</span>
          <span className="font-medium">{brand}</span>
        </div>
      )}
      {gender && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Gender</span>
          <span className="font-medium">{gender}</span>
        </div>
      )}
      {caseSize !== undefined && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Case Size</span>
          <span className="font-medium">{caseSize}mm</span>
        </div>
      )}
      {caseMaterial && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Case Material</span>
          <span className="font-medium">{caseMaterial}</span>
        </div>
      )}
      {dialColor && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Dial Color</span>
          <span className="font-medium">{dialColor}</span>
        </div>
      )}
      {movement && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Movement</span>
          <span className="font-medium">{movement}</span>
        </div>
      )}
      {waterResistance && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Water Resistance</span>
          <span className="font-medium">{waterResistance}</span>
        </div>
      )}
      {strapMaterial && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Strap Material</span>
          <span className="font-medium">{strapMaterial}</span>
        </div>
      )}
      {strapColor && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Strap Color</span>
          <span className="font-medium">{strapColor}</span>
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;
