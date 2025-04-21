
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { CreditCard, ShoppingCart } from 'lucide-react';

const CheckoutForm = () => {
  // Direct state management without custom hooks
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    country: 'OM', // Default to Oman
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
    country: 'OM', // Default to Oman
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Load cart data directly from localStorage
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
  
  // Handle form input changes for billing
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({
      ...prev,
      [name.replace('billing_', '')]: value
    }));
  };
  
  // Handle form input changes for shipping
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name.replace('shipping_', '')]: value
    }));
  };
  
  // Toggle ship to different address
  const handleShipToDifferentAddressChange = () => {
    setShipToDifferentAddress(!shipToDifferentAddress);
    
    // If turning off, reset shipping details to match billing
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
  
  // Handle payment method selection
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  
  // Basic form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required billing fields
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
    
    // If shipping to different address, validate shipping fields too
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
  
  // Handle form submission
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
    
    // For direct stripe checkout
    if (paymentMethod === 'card') {
      processDirectCheckout();
    } else {
      // For cash on delivery
      processCashOnDelivery();
    }
  };
  
  // Process direct checkout with Stripe
  const processDirectCheckout = () => {
    // Direct API call to our edge function
    fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cart.items,
        mode: 'payment',
        successUrl: window.location.origin + '/checkout/success',
        cancelUrl: window.location.origin + '/checkout/canceled',
        customerDetails: {
          name: `${billingDetails.firstName} ${billingDetails.lastName}`,
          email: billingDetails.email,
          phone: billingDetails.phone,
          address: {
            line1: billingDetails.address1,
            line2: billingDetails.address2,
            city: billingDetails.city,
            state: billingDetails.state,
            country: billingDetails.country,
            postal_code: billingDetails.postcode
          }
        }
      })
    })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then(data => {
      console.log('Checkout session created:', data);
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not redirect to checkout');
      }
    })
    .catch(error => {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to initialize checkout');
    });
  };
  
  // Process cash on delivery order
  const processCashOnDelivery = () => {
    console.log('Processing cash on delivery order...');
    
    // Store order in localStorage (in a real app, this would go to a database)
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
    
    // Store order
    const storedOrders = localStorage.getItem('orders');
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify({
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0
    }));
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Redirect to success page
    window.location.href = '/checkout/success';
  };
  
  // For countries select dropdown
  const countries = [
    { code: 'OM', name: 'Oman' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'QA', name: 'Qatar' },
    { code: 'BH', name: 'Bahrain' },
    { code: 'KW', name: 'Kuwait' },
    // Add more countries as needed
  ];
  
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
        <Link to="/cart">
          <Button>Return to Cart</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <form className="checkout woocommerce-checkout" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 md:order-1 order-2">
          <div className="customer-details space-y-8">
            <Link to="/cart" className="inline-flex items-center text-sm font-medium text-brand hover:text-brand/80 mb-4">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
            
            <div className="billing-fields">
              <h3 className="text-xl font-bold mb-4">Billing details</h3>
              
              <div className="billing-fields-wrapper space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billing_firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="billing_firstName"
                      name="billing_firstName"
                      value={billingDetails.firstName}
                      onChange={handleBillingChange}
                      className={formErrors.firstName ? "border-red-500" : ""}
                      aria-invalid={formErrors.firstName ? "true" : "false"}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="billing_lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="billing_lastName"
                      name="billing_lastName"
                      value={billingDetails.lastName}
                      onChange={handleBillingChange}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="billing_company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company name (optional)
                  </label>
                  <Input
                    type="text"
                    id="billing_company"
                    name="billing_company"
                    value={billingDetails.company}
                    onChange={handleBillingChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country / Region <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="billing_country"
                    name="billing_country"
                    value={billingDetails.country}
                    onChange={handleBillingChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a country / region…</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                </div>
                
                <div>
                  <label htmlFor="billing_address1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="billing_address1"
                    name="billing_address1"
                    placeholder="House number and street name"
                    value={billingDetails.address1}
                    onChange={handleBillingChange}
                    className={`mb-2 ${formErrors.address1 ? "border-red-500" : ""}`}
                  />
                  {formErrors.address1 && <p className="text-red-500 text-sm mt-1">{formErrors.address1}</p>}
                  
                  <Input
                    type="text"
                    id="billing_address2"
                    name="billing_address2"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    value={billingDetails.address2}
                    onChange={handleBillingChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 mb-1">
                    Town / City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="billing_city"
                    name="billing_city"
                    value={billingDetails.city}
                    onChange={handleBillingChange}
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="billing_state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / County <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="billing_state"
                    name="billing_state"
                    value={billingDetails.state}
                    onChange={handleBillingChange}
                    className={formErrors.state ? "border-red-500" : ""}
                  />
                  {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                </div>
                
                <div>
                  <label htmlFor="billing_postcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode / ZIP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="billing_postcode"
                    name="billing_postcode"
                    value={billingDetails.postcode}
                    onChange={handleBillingChange}
                    className={formErrors.postcode ? "border-red-500" : ""}
                  />
                  {formErrors.postcode && <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>}
                </div>
                
                <div>
                  <label htmlFor="billing_phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    id="billing_phone"
                    name="billing_phone"
                    value={billingDetails.phone}
                    onChange={handleBillingChange}
                    className={formErrors.phone ? "border-red-500" : ""}
                  />
                  {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="billing_email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="billing_email"
                    name="billing_email"
                    value={billingDetails.email}
                    onChange={handleBillingChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
              </div>
            </div>
            
            <div className="shipping-fields">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="ship_to_different_address"
                  checked={shipToDifferentAddress}
                  onCheckedChange={handleShipToDifferentAddressChange}
                />
                <label
                  htmlFor="ship_to_different_address"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ship to a different address?
                </label>
              </div>
              
              {shipToDifferentAddress && (
                <div className="shipping-fields-wrapper space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shipping_firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="shipping_firstName"
                        name="shipping_firstName"
                        value={shippingDetails.firstName}
                        onChange={handleShippingChange}
                        className={formErrors.shippingFirstName ? "border-red-500" : ""}
                      />
                      {formErrors.shippingFirstName && <p className="text-red-500 text-sm mt-1">{formErrors.shippingFirstName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="shipping_lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        id="shipping_lastName"
                        name="shipping_lastName"
                        value={shippingDetails.lastName}
                        onChange={handleShippingChange}
                        className={formErrors.shippingLastName ? "border-red-500" : ""}
                      />
                      {formErrors.shippingLastName && <p className="text-red-500 text-sm mt-1">{formErrors.shippingLastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company name (optional)
                    </label>
                    <Input
                      type="text"
                      id="shipping_company"
                      name="shipping_company"
                      value={shippingDetails.company}
                      onChange={handleShippingChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="shipping_country"
                      name="shipping_country"
                      value={shippingDetails.country}
                      onChange={handleShippingChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a country / region…</option>
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.shippingCountry && <p className="text-red-500 text-sm mt-1">{formErrors.shippingCountry}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_address1" className="block text-sm font-medium text-gray-700 mb-1">
                      Street address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="shipping_address1"
                      name="shipping_address1"
                      placeholder="House number and street name"
                      value={shippingDetails.address1}
                      onChange={handleShippingChange}
                      className={`mb-2 ${formErrors.shippingAddress1 ? "border-red-500" : ""}`}
                    />
                    {formErrors.shippingAddress1 && <p className="text-red-500 text-sm mt-1">{formErrors.shippingAddress1}</p>}
                    
                    <Input
                      type="text"
                      id="shipping_address2"
                      name="shipping_address2"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      value={shippingDetails.address2}
                      onChange={handleShippingChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 mb-1">
                      Town / City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="shipping_city"
                      name="shipping_city"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      className={formErrors.shippingCity ? "border-red-500" : ""}
                    />
                    {formErrors.shippingCity && <p className="text-red-500 text-sm mt-1">{formErrors.shippingCity}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 mb-1">
                      State / County <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="shipping_state"
                      name="shipping_state"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      className={formErrors.shippingState ? "border-red-500" : ""}
                    />
                    {formErrors.shippingState && <p className="text-red-500 text-sm mt-1">{formErrors.shippingState}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_postcode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode / ZIP <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      id="shipping_postcode"
                      name="shipping_postcode"
                      value={shippingDetails.postcode}
                      onChange={handleShippingChange}
                      className={formErrors.shippingPostcode ? "border-red-500" : ""}
                    />
                    {formErrors.shippingPostcode && <p className="text-red-500 text-sm mt-1">{formErrors.shippingPostcode}</p>}
                  </div>
                </div>
              )}
            </div>
            
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
                
                <div className="space-y-4 mt-6">
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
                  
                  <div className="bg-white p-4 border rounded">
                    <div className="flex items-center mb-2">
                      <input 
                        type="radio" 
                        id="payment_card" 
                        name="payment_method"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={handlePaymentMethodChange}
                        className="mr-2"
                      />
                      <label htmlFor="payment_card" className="font-medium">Credit Card / Debit Card</label>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">
                      Pay securely using your credit/debit card.
                    </p>
                  </div>
                  
                  <div className="pt-4 text-sm">
                    <p>Your personal data will be used to process your order, support your experience throughout this website.</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-base mt-6"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
