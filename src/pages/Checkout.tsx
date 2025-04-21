
import React, { useEffect, useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import CheckoutForm from '@/modules/checkout/components/CheckoutForm';
import CheckoutHeader from '@/modules/checkout/components/CheckoutHeader';

const Checkout = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Direct access to localStorage without hooks
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const cart = JSON.parse(storedCart);
          setCartItemCount(cart.totalItems || 0);
        }
      } catch (error) {
        console.error('Error reading cart data:', error);
      }
    };
    
    // Initial count
    updateCartCount();
    
    // Update count when storage changes
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  return (
    <MainLayout>
      <div className="page-title bg-gray-100 py-8 mb-6">
        <div className="container">
          <div className="content-title-heading">
            <span className="text-sm font-medium text-gray-500">Shop</span>
            <h1 className="text-3xl font-bold mt-1">
              Checkout
            </h1>
          </div>
          <div className="breadcrumb text-sm text-gray-500 mt-2">
            <a href="/" className="hover:text-brand">Home</a> 
            <span className="mx-2">/</span>
            <a href="/cart" className="hover:text-brand">Cart</a>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Checkout</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <CheckoutHeader activeStep="checkout" cartItemCount={cartItemCount} />
        <CheckoutForm />
      </div>
    </MainLayout>
  );
};

export default Checkout;
