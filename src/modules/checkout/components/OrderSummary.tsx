import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThawaniPayment from './ThawaniPayment';

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
          <div className="flex justify-between pb-2 border-b text-sm font-medium">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          {cart.items.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div className="flex items-start">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover mr-3 rounded"
                />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {item.currency} {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="flex justify-between py-2 border-b">
            <span>Subtotal</span>
            <span>OMR {cart.subtotal.toFixed(2)}</span>
          </div>

          {cart.discount > 0 && (
            <div className="flex justify-between py-2 border-b">
              <span>Discount</span>
              <span className="text-red-500">-OMR {cart.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b">
            <span>Shipping</span>
            <span>Free shipping</span>
          </div>

          <div className="flex justify-between py-2 font-bold">
            <span>Total</span>
            <span>OMR {cart.total.toFixed(2)}</span>
          </div>

          <div className="payment-methods space-y-4">
            <div className="bg-white p-4 border rounded">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="payment_thawani" 
                  name="payment_method"
                  value="thawani"
                  checked={paymentMethod === 'thawani'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="payment_thawani" className="font-medium">Thawani Pay</label>
              </div>
              <p className="text-sm text-gray-600 pl-6">
                Pay securely using Thawani payment gateway.
              </p>
            </div>

            <div className="bg-white p-4 border rounded">
              <div className="flex items-center mb-2">
                <input 
                  type="radio" 
                  id="payment_cash" 
                  name="payment_method"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={handlePaymentMethodChange}
                  className="mr-2"
                />
                <label htmlFor="payment_cash" className="font-medium">Cash on Delivery</label>
              </div>
              <p className="text-sm text-gray-600 pl-6">
                Pay with cash upon delivery.
              </p>
            </div>
          </div>

          <ThawaniPayment cart={cart} />

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
