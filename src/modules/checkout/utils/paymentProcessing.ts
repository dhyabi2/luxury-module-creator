
import { toast } from "sonner";
import { BillingDetails, ShippingDetails } from "../types/checkout";

interface ThawaniRequestData {
  products: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  success_url: string;
  cancel_url: string;
  metadata: {
    customer_email: string;
    customer_name: string;
    order_id: string;
  };
}

export const processThawaniPayment = async (cart: any, billingDetails: BillingDetails) => {
  console.log('Processing Thawani payment...');
  console.log('Cart data:', cart);
  console.log('Billing details:', billingDetails);

  const thawaniRequestData: ThawaniRequestData = {
    products: cart.items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: Math.round(item.price * 1000)
    })),
    success_url: window.location.origin + '/checkout/success',
    cancel_url: window.location.origin + '/checkout/canceled',
    metadata: {
      customer_email: billingDetails.email,
      customer_name: `${billingDetails.firstName} ${billingDetails.lastName}`,
      order_id: `ORD-${Date.now()}`
    }
  };

  console.log('Thawani request data:', JSON.stringify(thawaniRequestData));

  const response = await fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-thawani-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(thawaniRequestData)
  });

  console.log('Thawani API Response status:', response.status);
  
  if (!response.ok) {
    console.error('Thawani API Response not OK:', response.status);
  }

  const data = await response.text();
  console.log('Raw response text:', data);
  const jsonData = data ? JSON.parse(data) : {};
  console.log('Parsed response:', jsonData);

  if (jsonData?.data?.session_id) {
    const redirectUrl = `https://uatcheckout.thawani.om/pay/${jsonData.data.session_id}?key=HGvTMLDssJghr9tlN9gr4DVYt0qyBy`;
    console.log('Redirecting to Thawani URL:', redirectUrl);
    window.location.href = redirectUrl;
  } else {
    console.error('No session ID in response:', JSON.stringify(jsonData));
    throw new Error('Failed to create Thawani session: No session ID returned');
  }
};

export const processCashOnDelivery = (cart: any, billingDetails: BillingDetails, shippingDetails: ShippingDetails, shipToDifferentAddress: boolean) => {
  console.log('Processing cash on delivery order...');

  const order = {
    id: `ORD-${Date.now()}`,
    items: cart.items,
    billing: billingDetails,
    shipping: shipToDifferentAddress ? shippingDetails : billingDetails,
    total: cart.total,
    subtotal: cart.subtotal,
    payment_method: 'cash',
    status: 'processing',
    date: new Date().toISOString()
  };

  const storedOrders = localStorage.getItem('orders');
  const orders = storedOrders ? JSON.parse(storedOrders) : [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  localStorage.setItem('cart', JSON.stringify({
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0
  }));

  window.dispatchEvent(new Event('cartUpdated'));
  window.location.href = '/checkout/success';
};
