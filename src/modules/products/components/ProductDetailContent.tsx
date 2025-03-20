
import React, { useState } from 'react';
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
  
  // Extract specifications for display
  const specifications = formattedProduct.specifications;
  
  // Convert caseSize from string to number if it exists
  let caseSizeNumber: number | undefined = undefined;
  
  if (specifications && specifications.caseSize) {
    // Make sure we convert the value to a number
    const caseSizeValue = specifications.caseSize;
    const parsedSize = typeof caseSizeValue === 'string' 
      ? parseFloat(caseSizeValue.replace(/[^\d.-]/g, '')) 
      : typeof caseSizeValue === 'number' 
        ? caseSizeValue 
        : undefined;
        
    // Only assign if it's a valid number
    if (parsedSize !== undefined && !isNaN(parsedSize)) {
      caseSizeNumber = parsedSize;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductBreadcrumb category={product.category} productName={product.name} />
      
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
          
          {specifications && Object.keys(specifications).length > 0 && (
            <ProductSpecifications 
              caseMaterial={specifications.caseMaterial}
              caseSize={caseSizeNumber}
              dialColor={specifications.dialColor}
              movement={specifications.movement}
              waterResistance={specifications.waterResistance}
              strapMaterial={specifications.strapMaterial}
              strapColor={specifications.strapColor}
              brand={product.brand}
              gender={specifications.gender as string | undefined}
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
