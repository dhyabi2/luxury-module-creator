
import React from 'react';

export interface ProductSpecificationsProps {
  caseMaterial?: string;
  caseSize?: string;
  dialColor?: string;
  movement?: string;
  waterResistance?: string;
  strapMaterial?: string;
  strapColor?: string;
  brand?: string;
  gender?: string;
  // Perfume-specific specifications
  type?: string;
  notes?: string;
  volume?: string;
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
  strapColor,
  // Perfume-specific specifications
  type,
  notes,
  volume
}) => {
  return (
    <div className="border-t border-gray-200 pt-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Specifications</h3>
      
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
      
      {/* Perfume-specific specifications */}
      {type && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Type</span>
          <span className="font-medium">{type}</span>
        </div>
      )}
      
      {notes && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Notes</span>
          <span className="font-medium">{notes}</span>
        </div>
      )}
      
      {volume && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Volume</span>
          <span className="font-medium">{volume}</span>
        </div>
      )}
      
      {/* Watch-specific specifications */}
      {caseSize && (
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Case Size</span>
          <span className="font-medium">{caseSize}</span>
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
