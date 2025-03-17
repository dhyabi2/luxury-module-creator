
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../modules/layout/MainLayout';
import { useCart } from '@/modules/cart/context/CartContext';
import ProductBreadcrumb from '@/modules/products/components/ProductBreadcrumb';
import ProductDetailImage from '@/modules/products/components/ProductDetailImage';
import ProductSpecifications from '@/modules/products/components/ProductSpecifications';
import QuantitySelector from '@/modules/products/components/QuantitySelector';
import ProductActions from '@/modules/products/components/ProductActions';
import { useProductDetail } from '@/modules/products/hooks/useProductDetail';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, loading, error } = useProductDetail(productId);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  // Fallback image if the product image fails to load
  const fallbackImage = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop&auto=format';

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      // Format product to match the expected type
      const formattedProduct = {
        id: product.id || productId || '',  // Use product.id first, fallback to route param
        name: product.name,
        price: product.price,
        image: imageError ? fallbackImage : product.imageUrl,
        brand: product.brand,
        currency: '$',
        category: product.category || '',
        discount: product.onSale ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : undefined
      };
      
      addItem(formattedProduct, quantity);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-24">
        {/* Breadcrumb */}
        {product && (
          <ProductBreadcrumb 
            productName={product.name} 
            productCategory={product.category} 
          />
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to="/"
              className="bg-brand text-white px-6 py-3 rounded-sm hover:bg-brand/90 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <ProductDetailImage 
              imageUrl={product.imageUrl} 
              productName={product.name} 
            />
            
            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.brand}</p>
              <div className="mb-6">
                <span className="text-xl font-medium">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.onSale && (
                  <span className="ml-3 bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded">Sale</span>
                )}
              </div>
              <p className="text-gray-700 mb-6">
                {product.description || 'Luxury timepiece crafted with precision and elegant design. The perfect accessory for any occasion.'}
              </p>
              
              <ProductSpecifications 
                brand={product.brand} 
                gender={product.gender} 
                caseSize={product.caseSize} 
              />
              
              <QuantitySelector 
                quantity={quantity} 
                onIncrement={incrementQuantity} 
                onDecrement={decrementQuantity} 
              />
              
              <ProductActions onAddToCart={handleAddToCart} />
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
