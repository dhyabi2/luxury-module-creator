
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !email) {
      setErrorMessage('Please enter both order number and email');
      return;
    }
    
    setIsSearching(true);
    setErrorMessage('');
    
    // Direct API call would go here
    console.log('Tracking order:', { orderNumber, email });
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setErrorMessage('No order found with this information. This is a demonstration page.');
    }, 1500);
  };
  
  return (
    <MainLayout>
      <div className="page-title bg-gray-100 py-8 mb-6">
        <div className="container">
          <div className="content-title-heading">
            <span className="text-sm font-medium text-gray-500">Shop</span>
            <h1 className="text-3xl font-bold mt-1">
              Order Tracking
            </h1>
          </div>
          <div className="breadcrumb text-sm text-gray-500 mt-2">
            <a href="/" className="hover:text-brand">Home</a> 
            <span className="mx-2">/</span> 
            <span className="text-gray-700">Order Tracking</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="woocommerce-page-header mb-8">
          <ul className="flex border-b">
            <li className="pb-2 px-4">
              <a href="/cart" className="text-gray-600 hover:text-brand">
                Shopping Cart
              </a>
            </li>
            <li className="pb-2 px-4">
              <a href="/checkout" className="text-gray-600 hover:text-brand">Checkout</a>
            </li>
            <li className="pb-2 px-4 border-b-2 border-brand font-medium">
              <a href="/tracking" className="text-brand">Order Tracking</a>
            </li>
          </ul>
        </div>
        
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-50 p-6 border rounded-lg">
            <p className="text-gray-600 mb-6">
              To track your order, please enter your Order ID and the email address you used for the order. 
              The Order ID was provided in your order confirmation email.
            </p>
            
            {errorMessage && (
              <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleTracking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number *
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Found in your order confirmation email"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Email you used during checkout"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2"></div>
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTracking;
