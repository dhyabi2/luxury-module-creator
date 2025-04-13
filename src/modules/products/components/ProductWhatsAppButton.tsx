
import React from 'react';
import { Phone } from 'lucide-react';
import { Product } from '@/types/api';

interface ProductWhatsAppButtonProps {
  product: Product;
  formattedDiscount?: string | null;
}

const ProductWhatsAppButton: React.FC<ProductWhatsAppButtonProps> = ({ 
  product, 
  formattedDiscount 
}) => {
  const createWhatsAppMessage = () => {
    // Get the full absolute URL to the product image
    const imageUrl = product.image;
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${window.location.origin}${imageUrl}`;
    
    // Create message with product details and image URL
    const message = `I'm interested in purchasing:\n${product.brand} ${product.name}\nPrice: ${product.currency} ${product.price}${
      formattedDiscount ? ` (${formattedDiscount} off)` : ''
    }\nProduct image: ${absoluteImageUrl}\nProduct link: ${window.location.origin}/product/${product.id}`;
    
    let specDetails = '';
    if (product.specifications) {
      const specs = product.specifications;
      specDetails = '\n\nSpecifications:';
      if (specs.caseMaterial) specDetails += `\n- Case: ${specs.caseMaterial}`;
      if (specs.caseSize) specDetails += `\n- Size: ${specs.caseSize}`;
      if (specs.movement) specDetails += `\n- Movement: ${specs.movement}`;
      if (specs.waterResistance) specDetails += `\n- Water Resistance: ${specs.waterResistance}`;
      if (specs.gender) specDetails += `\n- Gender: ${specs.gender}`;
      if (specs.type) specDetails += `\n- Type: ${specs.type}`;
      if (specs.volume) specDetails += `\n- Volume: ${specs.volume}`;
    }
    
    return encodeURIComponent(message + specDetails);
  };

  return (
    <div className="mt-4 mb-6">
      <a 
        href={`https://wa.me/96899999999?text=${createWhatsAppMessage()}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
      >
        <Phone size={18} className="mr-2" />
        Contact us on WhatsApp
      </a>
    </div>
  );
};

export default ProductWhatsAppButton;
