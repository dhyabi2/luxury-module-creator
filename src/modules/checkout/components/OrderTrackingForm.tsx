
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface OrderTrackingFormProps {
  onOrderFound: (order: any) => void;
}

const OrderTrackingForm: React.FC<OrderTrackingFormProps> = ({ onOrderFound }) => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      toast.error('Please enter your order ID');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    // Direct localStorage access to find order
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        const orders = JSON.parse(storedOrders);
        const order = orders.find((o: any) => o.id === orderId && o.billing.email === email);
        
        if (order) {
          setTimeout(() => {
            setIsLoading(false);
            onOrderFound(order);
          }, 1000); // Simulate API call
        } else {
          setTimeout(() => {
            setIsLoading(false);
            toast.error('No order found matching that order ID and email address.');
          }, 1000); // Simulate API call
        }
      } else {
        setTimeout(() => {
          setIsLoading(false);
          toast.error('No orders found in the system.');
        }, 1000); // Simulate API call
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Error tracking order');
      console.error('Error tracking order:', error);
    }
  };
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg border mb-8">
        <p className="mb-4 text-gray-600">
          To track your order please enter your Order ID and the email address you used for the order.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="order_id" className="block text-sm font-medium text-gray-700 mb-1">
              Order ID
            </label>
            <Input
              id="order_id"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Found in your order confirmation email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="billing_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email you used during checkout"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>
                Tracking...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Track Order
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OrderTrackingForm;
