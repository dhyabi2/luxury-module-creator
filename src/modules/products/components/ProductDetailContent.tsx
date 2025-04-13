
import React, { useState } from 'react';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductDetailImage from './ProductDetailImage';
import ProductInfo from './ProductInfo';
import ProductSpecifications from './ProductSpecifications';
import ProductActions from './ProductActions';
import { formatProductData } from '../utils/formatProductData';
import QuantitySelector from './QuantitySelector';
import ProductWhatsAppButton from './ProductWhatsAppButton';
import ProductCurrencyConverter from './ProductCurrencyConverter';
import ProductCheckoutHandler from './ProductCheckoutHandler';
import { toast } from 'sonner';

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [convertedProduct, setConvertedProduct] = useState<Product>(product);
  
  const formattedProduct = formatProductData(convertedProduct, currency);
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem(convertedProduct, quantity);
  };
  
  const handleDirectCheckout = () => {
    ProductCheckoutHandler.handleDirectCheckout({
      product: convertedProduct,
      quantity: quantity
    });
  };
  
  const specifications = convertedProduct.specifications || {};
  
  console.log('Product data:', convertedProduct);
  console.log('Formatted product data:', formattedProduct);
  console.log('Specifications:', specifications);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductCurrencyConverter 
        product={product}
        currency={currency}
        onConversion={setConvertedProduct}
      />
      
      <ProductBreadcrumb 
        category={convertedProduct.category} 
        productName={convertedProduct.name} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ProductDetailImage 
          image={convertedProduct.image} 
          name={convertedProduct.name} 
          brand={convertedProduct.brand}
        />
        
        <div className="space-y-8">
          <ProductInfo 
            name={convertedProduct.name}
            brand={convertedProduct.brand}
            rating={convertedProduct.rating}
            reviews={convertedProduct.reviews}
            price={formattedProduct.formattedPrice}
            discountPercentage={formattedProduct.formattedDiscount}
            discountedPrice={formattedProduct.formattedDiscountedPrice}
            stockStatus={formattedProduct.stockStatusText}
            stockStatusClass={formattedProduct.stockStatusClass}
            description={convertedProduct.description || ""}
          />
          
          <ProductWhatsAppButton 
            product={convertedProduct}
            formattedDiscount={formattedProduct.formattedDiscount}
          />
          
          <QuantitySelector
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
          
          {specifications && Object.keys(specifications).length > 0 && (
            <ProductSpecifications 
              caseMaterial={specifications.caseMaterial}
              caseSize={specifications.caseSize}
              dialColor={specifications.dialColor}
              movement={specifications.movement}
              waterResistance={specifications.waterResistance}
              strapMaterial={specifications.strapMaterial}
              strapColor={specifications.strapColor}
              brand={convertedProduct.brand}
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
            onDirectCheckout={handleDirectCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContent;
