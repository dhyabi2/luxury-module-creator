
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import BillingDetailsForm from './BillingDetailsForm';
import ShippingDetailsForm from './ShippingDetailsForm';
import OrderSummary from './OrderSummary';

const CheckoutForm = () => {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'OM',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
    email: '',
    orderNotes: ''
  });
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'OM',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('thawani');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const countries = [
    { code: 'OM', name: 'Oman' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'KW', name: 'Kuwait' }
  ];

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      setIsLoading(false);
    }
  }, []);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name.replace('billing_', '')]: value
    }));
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name.replace('shipping_', '')]: value
    }));
  };

  const handleShipToDifferentAddressChange = () => {
    setShipToDifferentAddress(!shipToDifferentAddress);

    if (shipToDifferentAddress) {
      setShippingDetails({
        firstName: billingDetails.firstName,
        lastName: billingDetails.lastName,
        company: billingDetails.company,
        country: billingDetails.country,
        address1: billingDetails.address1,
        address2: billingDetails.address2,
        city: billingDetails.city,
        state: billingDetails.state,
        postcode: billingDetails.postcode,
      });
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!billingDetails.firstName) errors.firstName = "First name is required";
    if (!billingDetails.lastName) errors.lastName = "Last name is required";
    if (!billingDetails.country) errors.country = "Country is required";
    if (!billingDetails.address1) errors.address1 = "Street address is required";
    if (!billingDetails.city) errors.city = "Town/City is required";
    if (!billingDetails.state) errors.state = "State/County is required";
    if (!billingDetails.postcode) errors.postcode = "Postcode/ZIP is required";
    if (!billingDetails.phone) errors.phone = "Phone is required";
    if (!billingDetails.email) errors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(billingDetails.email)) errors.email = "Email address is invalid";

    if (shipToDifferentAddress) {
      if (!shippingDetails.firstName) errors.shippingFirstName = "First name is required";
      if (!shippingDetails.lastName) errors.shippingLastName = "Last name is required";
      if (!shippingDetails.country) errors.shippingCountry = "Country is required";
      if (!shippingDetails.address1) errors.shippingAddress1 = "Street address is required";
      if (!shippingDetails.city) errors.shippingCity = "Town/City is required";
      if (!shippingDetails.state) errors.shippingState = "State/County is required";
      if (!shippingDetails.postcode) errors.shippingPostcode = "Postcode/ZIP is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing checkout...');

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (paymentMethod === 'thawani') {
      processDirectCheckout();
    } else {
      processCashOnDelivery();
    }
  };

  const processDirectCheckout = () => {
    const thawaniRequestData = {
      products: cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_amount: Math.round(item.price * 1000) // Convert to baisa
      })),
      success_url: window.location.origin + '/checkout/success',
      cancel_url: window.location.origin + '/checkout/canceled',
      metadata: {
        customer_email: billingDetails.email,
        customer_name: `${billingDetails.firstName} ${billingDetails.lastName}`,
        order_id: `ORD-${Date.now()}`
      }
    };
    
    console.log('Initializing Thawani checkout process with data:', JSON.stringify(thawaniRequestData));

    fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-thawani-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thawaniRequestData)
    })
    .then(response => {
      console.log('Thawani API Response status:', response.status);
      if (!response.ok) {
        console.error('Thawani API Response not OK:', response.status);
      }
      return response.text().then(text => {
        try {
          console.log('Raw response text:', text);
          return text ? JSON.parse(text) : {};
        } catch (e) {
          console.error('Error parsing JSON response:', e);
          throw new Error('Invalid JSON response from Thawani API');
        }
      });
    })
    .then(data => {
      console.log('Thawani session created, full response:', JSON.stringify(data));
      if (data?.data?.session_id) {
        const redirectUrl = `https://uatcheckout.thawani.om/pay/${data.data.session_id}?key=HGvTMLDssJghr9tlN9gr4DVYt0qyBy`;
        console.log('Redirecting to Thawani URL:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.error('No session ID in response:', JSON.stringify(data));
        throw new Error('Failed to create Thawani session: No session ID returned');
      }
    })
    .catch(error => {
      console.error('Error creating Thawani checkout:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    });
  };

  const processCashOnDelivery = () => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          You need to add some products to your cart before proceeding to checkout.
        </p>
        <Link to="/cart" className="text-brand hover:text-brand/80">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 md:order-1 order-2">
          <div className="customer-details space-y-8">
            <Link to="/cart" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand/80 mb-4">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>

            <BillingDetailsForm 
              billingDetails={billingDetails}
              handleBillingChange={handleBillingChange}
              formErrors={formErrors}
              countries={countries}
            />

            <ShippingDetailsForm
              shipToDifferentAddress={shipToDifferentAddress}
              handleShipToDifferentAddressChange={handleShipToDifferentAddressChange}
              shippingDetails={shippingDetails}
              handleShippingChange={handleShippingChange}
              formErrors={formErrors}
              countries={countries}
            />

            <div className="additional-fields">
              <div>
                <label htmlFor="order_notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order notes (optional)
                </label>
                <Textarea
                  id="order_notes"
                  name="order_notes"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={billingDetails.orderNotes}
                  onChange={handleBillingChange}
                  className="h-24"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 md:order-2 order-1">
          <OrderSummary 
            cart={cart}
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
