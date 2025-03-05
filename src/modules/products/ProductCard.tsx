
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import ViewDetailsButton from './components/ViewDetailsButton';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  discount?: number;
  category: string;
  brand: string;
}

const ProductCard: React.FC<ProductProps> = (product) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={`/product/${product.id}`} className="block h-full w-full">
      <div 
        className="product-card group h-full flex flex-col relative overflow-hidden rounded-md shadow-sm hover:shadow-md transition-shadow duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ProductImage 
          image={product.image} 
          name={product.name} 
          discount={product.discount} 
          isHovered={isHovered} 
        />
        
        <ProductInfo 
          brand={product.brand}
          name={product.name}
          price={product.price}
          currency={product.currency}
          discount={product.discount}
        />
        
        <ViewDetailsButton isHovered={isHovered} />
      </div>
    </Link>
  );
};

export default ProductCard;
