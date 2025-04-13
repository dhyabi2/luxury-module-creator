
import React from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CheckoutCanceled = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="rounded-full bg-red-100 p-4 inline-block mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Checkout Canceled</h1>
          <p className="text-gray-600 mb-8">
            Your payment was canceled and you have not been charged.
            If you encountered any issues during checkout, please try again or contact our support team.
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">Return to Shopping</Button>
            </Link>
            <p className="text-sm text-gray-500">
              Need assistance? Reach out to our customer service team for help.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutCanceled;
