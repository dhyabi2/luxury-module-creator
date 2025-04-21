
import React from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { CartPageContent } from '@/modules/cart/components/CartPageContent';

const Cart = () => {
  console.log('Cart page loaded');
  
  return (
    <MainLayout>
      <div className="page-title bg-gray-100 py-8 mb-6">
        <div className="container">
          <div className="content-title-heading">
            <span className="text-sm font-medium text-gray-500">Shop</span>
            <h1 className="text-3xl font-bold mt-1">
              Cart
            </h1>
          </div>
          <div className="breadcrumb text-sm text-gray-500 mt-2">
            <a href="/" className="hover:text-brand">Home</a> 
            <span className="mx-2">/</span> 
            <span className="text-gray-700">Cart</span>
          </div>
        </div>
      </div>
      
      <CartPageContent />
    </MainLayout>
  );
};

export default Cart;
