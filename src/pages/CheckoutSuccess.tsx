
import React from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-green-100 p-4 inline-block mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been processed successfully.
            We'll send you an email with your order details shortly.
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <p className="text-sm text-gray-500">
              If you have any questions about your order, please contact our customer support.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutSuccess;
