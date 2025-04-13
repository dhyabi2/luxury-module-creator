
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import ViewDetailsButton from './ViewDetailsButton';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/types/api';

export interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Create WhatsApp message with product details including image URL
  const createWhatsAppMessage = () => {
    // Get the full absolute URL to the product image
    const imageUrl = product.image;
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${window.location.origin}${imageUrl}`;
    
    // Create message with product details and image URL
    const message = `I'm interested in: ${product.brand} ${product.name} (${product.currency} ${product.price})\n\nProduct image: ${absoluteImageUrl}\n\nProduct link: ${window.location.origin}/product/${product.id}`;
    
    return encodeURIComponent(message);
  };
  
  return (
    <Card 
      className="product-card h-full relative group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage 
          image={product.image} 
          name={product.name} 
          discount={product.discount || undefined}
          isHovered={isHovered} 
        />
      </Link>
      
      <CardContent className="px-4 py-3">
        <ProductInfo
          brand={product.brand}
          name={product.name}
          price={product.price}
          currency={product.currency || '$'}
          discount={product.discount}
        />
        
        <div className="mt-3 mb-1">
          <a 
            href={`https://wa.me/96899999999?text=${createWhatsAppMessage()}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 text-sm hover:text-green-700 transition-colors"
          >
            <Phone size={14} className="mr-1" />
            WhatsApp Call
          </a>
        </div>
      </CardContent>
      
      <ViewDetailsButton isHovered={isHovered} productId={product.id} />
      <WishlistButton productId={product.id} />
      <AddToCartButton productId={product.id} />
    </Card>
  );
};

export default ProductCard;
