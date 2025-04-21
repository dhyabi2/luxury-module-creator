
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderProducts from './order-summary/OrderProducts';
import OrderTotals from './order-summary/OrderTotals';
import PaymentMethods from './order-summary/PaymentMethods';

interface OrderSummaryProps {
  cart: any;
  paymentMethod: string;
  handlePaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  paymentMethod,
  handlePaymentMethodChange,
  onSubmit
}) => {
  return (
    <div className="order-review">
      <h3 className="text-xl font-bold mb-6">Your Order</h3>

      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="space-y-4">
          <OrderProducts items={cart.items} />
          
          <OrderTotals 
            subtotal={cart.subtotal}
            discount={cart.discount}
            total={cart.total}
          />

          <PaymentMethods
            selectedMethod={paymentMethod}
            onMethodChange={handlePaymentMethodChange}
          />

          <Button 
            type="submit"
            className="w-full py-6 text-base mt-6"
            onClick={onSubmit}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
