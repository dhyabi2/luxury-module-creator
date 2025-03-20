
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import ViewDetailsButton from './components/ViewDetailsButton';
import { Product } from '@/types/api';

export interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <article 
      className="product-card h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <ProductImage 
          image={product.image} 
          name={product.name} 
          discount={product.discount}
          isHovered={isHovered} 
        />
      </Link>
      
      <ProductInfo
        brand={product.brand}
        name={product.name}
        price={product.price}
        currency={product.currency}
        discount={product.discount}
      />
      
      <ViewDetailsButton isHovered={isHovered} productId={product.id} />
    </article>
  );
};

export default ProductCard;
