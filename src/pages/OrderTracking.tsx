
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import CheckoutHeader from '@/modules/checkout/components/CheckoutHeader';
import OrderTrackingForm from '@/modules/checkout/components/OrderTrackingForm';
import OrderDetails from '@/modules/checkout/components/OrderDetails';

const OrderTracking = () => {
  const [foundOrder, setFoundOrder] = useState<any>(null);
  
  const handleOrderFound = (order: any) => {
    setFoundOrder(order);
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
        <CheckoutHeader activeStep="tracking" />
        
        {!foundOrder ? (
          <OrderTrackingForm onOrderFound={handleOrderFound} />
        ) : (
          <OrderDetails order={foundOrder} />
        )}
      </div>
    </MainLayout>
  );
};

export default OrderTracking;
