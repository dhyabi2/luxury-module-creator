
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../modules/layout/MainLayout';
import { useCart } from '@/modules/cart/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingBag, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
        image: product.imageUrl,
        brand: product.brand,
        currency: '$',
        category: product.category || '',
        discount: product.onSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : undefined
      };
      
      addItem(formattedProduct, quantity);
      // No navigation here, stays on product page
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 mt-24">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 tracking-wider overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link> / 
          {product?.category && (
            <>
              <Link to={`/${product.category.toLowerCase()}`} className="hover:text-black transition-colors">
                {product.category.toUpperCase()}
              </Link> / 
            </>
          )}
          <span className="font-medium text-gray-900">{product?.name || 'Product Details'}</span>
        </div>

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
            <div className="rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            
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
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                {product.gender && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gender</span>
                    <span className="font-medium">{product.gender}</span>
                  </div>
                )}
                {product.caseSize && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Case Size</span>
                    <span className="font-medium">{product.caseSize}mm</span>
                  </div>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Quantity</p>
                <div className="flex items-center border border-gray-200 rounded-sm inline-block">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 text-sm font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  className="w-full bg-brand text-white py-3 rounded-sm hover:bg-brand/90 transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="border border-gray-300 p-3 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
