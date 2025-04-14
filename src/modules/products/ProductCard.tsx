import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import ViewDetailsButton from './components/ViewDetailsButton';
import { Product } from '@/types/api';
import { useCurrency } from '@/contexts/CurrencyContext';
export interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    currency
  } = useCurrency();
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
  const createWhatsAppMessage = () => {
    // Get the full absolute URL to the product image
    const imageUrl = convertedProduct.image;
    const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;

    // Create message with product details and image URL
    const message = `I'm interested in: ${convertedProduct.brand} ${convertedProduct.name} (${convertedProduct.currency} ${convertedProduct.price})\n\nProduct image: ${absoluteImageUrl}\n\nProduct link: ${window.location.origin}/product/${convertedProduct.id}`;
    return encodeURIComponent(message);
  };
  return <article onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="product-card h-full my-0 py-[10px]">
      <Link to={`/product/${convertedProduct.id}`} className="block">
        <ProductImage image={convertedProduct.image} name={convertedProduct.name} discount={convertedProduct.discount || undefined} isHovered={isHovered} />
      </Link>
      
      <ProductInfo brand={convertedProduct.brand} name={convertedProduct.name} price={convertedProduct.price} currency={convertedProduct.currency || '$'} discount={convertedProduct.discount} />
      
      <div className="mt-2">
        <a href={`https://wa.me/96899999999?text=${createWhatsAppMessage()}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-green-600 text-sm hover:text-green-700">
          <Phone size={14} className="mr-1" />
          WhatsApp Call
        </a>
      </div>
      
      <ViewDetailsButton isHovered={isHovered} productId={convertedProduct.id} />
    </article>;
};
export default ProductCard;