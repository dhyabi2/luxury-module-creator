
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import BillingDetailsForm from './BillingDetailsForm';
import ShippingDetailsForm from './ShippingDetailsForm';
import OrderSummary from './OrderSummary';
import { validateCheckoutForm } from '../utils/formValidation';
import { processThawaniPayment, processCashOnDelivery } from '../utils/paymentProcessing';
import { BillingDetails, ShippingDetails, Country } from '../types/checkout';

const CheckoutForm = () => {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
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
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
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

  const countries: Country[] = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing checkout...');

    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const errors = validateCheckoutForm(billingDetails, shipToDifferentAddress, shippingDetails);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (paymentMethod === 'thawani') {
      await processThawaniPayment(cart, billingDetails);
    } else {
      processCashOnDelivery(cart, billingDetails, shippingDetails, shipToDifferentAddress);
    }
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
