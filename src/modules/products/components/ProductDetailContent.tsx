
import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductDetailImage from './ProductDetailImage';
import ProductInfo from './ProductInfo';
import ProductSpecifications from './ProductSpecifications';
import ProductActions from './ProductActions';
import { formatProductData } from '../utils/formatProductData';
import QuantitySelector from './QuantitySelector';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductDetailContentProps {
  product: Product;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  const { currency } = useCurrency();
  const [convertedProduct, setConvertedProduct] = useState<Product>(product);
  
  useEffect(() => {
    const convertCurrency = async () => {
      if (currency === 'OMR') {
        setConvertedProduct(product);
        return;
      }
      
      console.log(`Converting prices from OMR to ${currency}`);
      
      try {
        const response = await fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/convert-currency', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo'
          },
          body: JSON.stringify({
            product: product,
            targetCurrency: currency
          })
        });
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Converted product data:', data);
        setConvertedProduct(data.convertedProduct);
      } catch (err) {
        console.error('Error converting currency:', err);
        setConvertedProduct(product);
      }
    };
    
    convertCurrency();
  }, [currency, product]);
  
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
    console.log('Processing direct checkout for:', convertedProduct, 'Quantity:', quantity);
    
    fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo'
      },
      body: JSON.stringify({
        items: [{
          id: convertedProduct.id,
          name: convertedProduct.name,
          brand: convertedProduct.brand,
          price: convertedProduct.price,
          currency: convertedProduct.currency,
          quantity: quantity,
          image: convertedProduct.image
        }],
        mode: 'payment',
        successUrl: window.location.origin + '/checkout/success',
        cancelUrl: window.location.origin + '/checkout/canceled'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Checkout session created:', data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not redirect to checkout');
      }
    })
    .catch(error => {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to initialize checkout');
    });
  };
  
  const createWhatsAppMessage = () => {
    // Get the full absolute URL to the product image
    const imageUrl = convertedProduct.image;
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${window.location.origin}${imageUrl}`;
    
    // Create message with product details and image URL
    const message = `I'm interested in purchasing:\n${convertedProduct.brand} ${convertedProduct.name}\nPrice: ${convertedProduct.currency} ${convertedProduct.price}${
      formattedProduct.formattedDiscount ? ` (${formattedProduct.formattedDiscount} off)` : ''
    }\nProduct image: ${absoluteImageUrl}\nProduct link: ${window.location.origin}/product/${convertedProduct.id}`;
    
    let specDetails = '';
    if (convertedProduct.specifications) {
      const specs = convertedProduct.specifications;
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
  
  const specifications = convertedProduct.specifications || {};
  
  console.log('Product data:', convertedProduct);
  console.log('Formatted product data:', formattedProduct);
  console.log('Specifications:', specifications);
  
  return (
    <div className="container mx-auto px-4 py-8">
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
