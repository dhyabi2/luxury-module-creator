
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { PackageCheck, Truck, Check, Clock } from 'lucide-react';

interface OrderDetailsProps {
  order: any;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-500" size={24} />;
      case 'processing':
        return <Clock className="text-amber-500" size={24} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={24} />;
      default:
        return <PackageCheck className="text-gray-500" size={24} />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
            {getStatusIcon(order.status)}
            <span className="ml-2 font-medium capitalize">{order.status}</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
            <Separator className="mb-3" />
            <dl className="space-y-1">
              <div className="flex justify-between">
                <dt className="text-gray-500">Date</dt>
                <dd>{formatDate(order.date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Total</dt>
                <dd className="font-medium">{order.items[0]?.currency || 'OMR'} {order.total.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Payment method</dt>
                <dd className="capitalize">{order.payment_method}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
            <Separator className="mb-3" />
            <dl className="space-y-1">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name</dt>
                <dd>{order.billing.firstName} {order.billing.lastName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email</dt>
                <dd>{order.billing.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone</dt>
                <dd>{order.billing.phone}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
            <Separator className="mb-3" />
            <address className="not-italic">
              {order.billing.firstName} {order.billing.lastName}<br />
              {order.billing.address1}<br />
              {order.billing.address2 && <>{order.billing.address2}<br /></>}
              {order.billing.city}, {order.billing.state} {order.billing.postcode}<br />
              {order.billing.country}
            </address>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
            <Separator className="mb-3" />
            <address className="not-italic">
              {order.shipping.firstName} {order.shipping.lastName}<br />
              {order.shipping.address1}<br />
              {order.shipping.address2 && <>{order.shipping.address2}<br /></>}
              {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}<br />
              {order.shipping.country}
            </address>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
          <Separator className="mb-3" />
          
          <table className="w-full">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded mr-3" 
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.currency} {item.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-4 text-right font-medium">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200">
              <tr>
                <th colSpan={3} className="py-3 px-4 text-right">Subtotal</th>
                <td className="py-3 px-4 text-right">
                  {order.items[0]?.currency || 'OMR'} {order.subtotal.toFixed(2)}
                </td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <th colSpan={3} className="py-3 px-4 text-right">Discount</th>
                  <td className="py-3 px-4 text-right text-red-500">
                    -{order.items[0]?.currency || 'OMR'} {order.discount.toFixed(2)}
                  </td>
                </tr>
              )}
              <tr>
                <th colSpan={3} className="py-3 px-4 text-right">Shipping</th>
                <td className="py-3 px-4 text-right">Free</td>
              </tr>
              <tr>
                <th colSpan={3} className="py-3 px-4 text-right font-bold">Total</th>
                <td className="py-3 px-4 text-right font-bold">
                  {order.items[0]?.currency || 'OMR'} {order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
