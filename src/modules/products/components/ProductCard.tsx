
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
        
        <div className="mt-2">
          <a 
            href="https://wa.me/96899999999" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-600 text-sm hover:text-green-700"
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
