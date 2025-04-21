
import React from 'react';

interface OrderProductsProps {
  items: any[];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between pb-2 border-b text-sm font-medium">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {items.map((item) => (
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
    </div>
  );
};

export default OrderProducts;
