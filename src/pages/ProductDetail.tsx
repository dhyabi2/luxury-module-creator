
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '@/utils/apiUtils';
import { Product } from '@/types/api';
import { useCart } from '@/contexts/CartContext';
import ProductBreadcrumb from '@/modules/products/components/ProductBreadcrumb';
import ProductDetailImage from '@/modules/products/components/ProductDetailImage';
import ProductInfo from '@/modules/products/components/ProductInfo';
import ProductSpecifications from '@/modules/products/components/ProductSpecifications';
import ProductActions from '@/modules/products/components/ProductActions';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  
  // Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!productId) {
          throw new Error('Product ID is required');
        }
        
        const productData = await fetchProductById(productId);
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load product details. Please try again later.');
        }
        toast.error('Failed to load product', {
          description: 'Please try again later.',
          duration: 3000
        });
      } finally {
        setLoading(false);
      }
    };
    
    getProduct();
  }, [productId]);
  
  // Format product data for display
  const formatProductData = () => {
    if (!product) {
      return {
        formattedPrice: '$0.00',
        formattedDiscount: null,
        discountedPrice: null,
        formattedDiscountedPrice: null,
        specifications: {},
        isInStock: false,
        stockStatusText: 'Out of Stock',
        stockStatusClass: 'text-red-500'
      };
    }
    
    // Format price
    const formattedPrice = `$${product.price.toFixed(2)}`;
    
    // Calculate discounted price if applicable
    let discountedPrice = null;
    let formattedDiscountedPrice = null;
    let formattedDiscount = null;
    
    if (product.discount && product.discount > 0) {
      discountedPrice = product.price - (product.price * (product.discount / 100));
      formattedDiscountedPrice = `$${discountedPrice.toFixed(2)}`;
      formattedDiscount = `${product.discount}% Off`;
    }
    
    // Extract specifications from product
    const specifications = product.specifications || {};
    
    // Check if product is in stock
    const isInStock = product.stock ? product.stock > 0 : false;
    
    // Format stock status text and class
    let stockStatusText = 'Out of Stock';
    let stockStatusClass = 'text-red-500';
    
    if (isInStock && product.stock) {
      if (product.stock < 5) {
        stockStatusText = `Only ${product.stock} left in stock`;
        stockStatusClass = 'text-amber-500';
      } else {
        stockStatusText = 'In Stock';
        stockStatusClass = 'text-green-500';
      }
    }
    
    return {
      formattedPrice,
      formattedDiscount,
      discountedPrice,
      formattedDiscountedPrice,
      specifications,
      isInStock,
      stockStatusText,
      stockStatusClass
    };
  };
  
  const formattedProduct = formatProductData();
  
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };
  
  // Extract specifications for display
  const specifications = formattedProduct.specifications;
  
  // Show loading or error states
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 mb-6 rounded w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl text-red-500 mb-4">Error Loading Product</h1>
        <p className="mb-6">{error}</p>
      </div>
    );
  }
  
  if (!product) return null;
  
  // Get caseSize as a number if it exists
  const caseSize = specifications && specifications.caseSize ? 
    typeof specifications.caseSize === 'string' ? 
      parseFloat(specifications.caseSize) : 
      specifications.caseSize 
    : undefined;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductBreadcrumb category={product.category} productName={product.name} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <ProductDetailImage 
          image={product.image} 
          name={product.name} 
          brand={product.brand}
        />
        
        <div className="space-y-8">
          <ProductInfo 
            name={product.name}
            brand={product.brand}
            rating={product.rating}
            reviews={product.reviews}
            price={formattedProduct.formattedPrice}
            discountPercentage={formattedProduct.formattedDiscount}
            discountedPrice={formattedProduct.formattedDiscountedPrice}
            stockStatus={formattedProduct.stockStatusText}
            stockStatusClass={formattedProduct.stockStatusClass}
            description={product.description || ""}
          />
          
          {specifications && Object.keys(specifications).length > 0 && (
            <ProductSpecifications 
              caseMaterial={specifications.caseMaterial}
              caseSize={caseSize}
              dialColor={specifications.dialColor}
              movement={specifications.movement}
              waterResistance={specifications.waterResistance}
              strapMaterial={specifications.strapMaterial}
              strapColor={specifications.strapColor}
            />
          )}
          
          <ProductActions 
            isInStock={formattedProduct.isInStock}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
