
import React from 'react';

interface OrderTotalsProps {
  subtotal: number;
  discount: number;
  total: number;
}

const OrderTotals: React.FC<OrderTotalsProps> = ({ subtotal, discount, total }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between py-2 border-b">
        <span>Subtotal</span>
        <span>OMR {subtotal.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between py-2 border-b">
          <span>Discount</span>
          <span className="text-red-500">-OMR {discount.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between py-2 border-b">
        <span>Shipping</span>
        <span>Free shipping</span>
      </div>

      <div className="flex justify-between py-2 font-bold">
        <span>Total</span>
        <span>OMR {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderTotals;
