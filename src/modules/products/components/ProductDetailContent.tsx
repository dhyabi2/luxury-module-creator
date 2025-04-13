
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductDetailImage from './ProductDetailImage';
import ProductInfo from './ProductInfo';
import ProductSpecifications from './ProductSpecifications';
import ProductActions from './ProductActions';
import { formatProductData } from '../utils/formatProductData';

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  
  const formattedProduct = formatProductData(product);
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  // Create WhatsApp message with detailed product information
  const createWhatsAppMessage = () => {
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
    
    const message = `I'm interested in purchasing:\n${product.brand} ${product.name}\nPrice: ${product.currency} ${product.price}${
      formattedProduct.formattedDiscount ? ` (${formattedProduct.formattedDiscount} off)` : ''
    }${specDetails}\nProduct ID: ${product.id}`;
    
    return encodeURIComponent(message);
  };
  
  // Extract specifications from product
  const specifications = product.specifications || {};
  
  // Log product data for debugging
  console.log('Product data:', product);
  console.log('Formatted product data:', formattedProduct);
  console.log('Specifications:', specifications);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductBreadcrumb 
        category={product.category} 
        productName={product.name} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ProductDetailImage 
          image={product.image} 
          name={product.name} 
          brand={product.brand}
        />
        
        <div className="space-y-8">
          <ProductInfo 
            name={product.name}
            brand={product.brand}
            rating={product.rating}
            reviews={product.reviews}
            price={formattedProduct.formattedPrice}
            discountPercentage={formattedProduct.formattedDiscount}
            discountedPrice={formattedProduct.formattedDiscountedPrice}
            stockStatus={formattedProduct.stockStatusText}
            stockStatusClass={formattedProduct.stockStatusClass}
            description={product.description || ""}
          />
          
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
          
          {specifications && Object.keys(specifications).length > 0 && (
            <ProductSpecifications 
              caseMaterial={specifications.caseMaterial}
              caseSize={specifications.caseSize}
              dialColor={specifications.dialColor}
              movement={specifications.movement}
              waterResistance={specifications.waterResistance}
              strapMaterial={specifications.strapMaterial}
              strapColor={specifications.strapColor}
              brand={product.brand}
              gender={specifications.gender}
              type={specifications.type}
              notes={specifications.notes}
              volume={specifications.volume}
            />
          )}
          
          <ProductActions 
            isInStock={formattedProduct.isInStock}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContent;
