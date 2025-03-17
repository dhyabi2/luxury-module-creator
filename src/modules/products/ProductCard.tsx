
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import ViewDetailsButton from './components/ViewDetailsButton';

export interface ProductProps {
  id: string;
  name: string;
  brand: string;
  category?: string;
  price: number;
  originalPrice?: number;
  onSale?: boolean;
  isNew?: boolean;
  imageUrl: string;
  gender?: string;
  caseSize?: number;
  description?: string;
}

const ProductCard: React.FC<ProductProps> = (product) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <article 
      className="product-card h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage 
          image={product.imageUrl} 
          name={product.name} 
          discount={product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : undefined}
          isHovered={isHovered} 
        />
      </Link>
      
      <ProductInfo
        brand={product.brand}
        name={product.name}
        price={product.price}
        currency="$"
        discount={product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : undefined}
      />
      
      <ViewDetailsButton isHovered={isHovered} productId={product.id} />
    </article>
  );
};

export default ProductCard;
