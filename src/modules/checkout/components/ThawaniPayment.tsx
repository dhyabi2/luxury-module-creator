
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

const THAWANI_CHECKOUT_URL = 'https://uatcheckout.thawani.om/pay/';
const THAWANI_PUBLIC_KEY = 'HGvTMLDssJghr9tlN9gr4DVYt0qyBy';

const ThawaniPayment = ({ cart }) => {
  const handleThawaniPayment = async () => {
    const products = cart.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: Math.round(item.price * 1000) // Convert to baisa
    }));

    const { data, error } = await supabase.functions.invoke('create-thawani-session', {
      body: {
        products,
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/canceled`,
        metadata: {
          cart_id: cart.id
        }
      }
    });

    if (data?.data?.session_id) {
      window.location.href = `${THAWANI_CHECKOUT_URL}${data.data.session_id}?key=${THAWANI_PUBLIC_KEY}`;
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center mb-4">
        <input 
          type="radio" 
          id="payment_thawani" 
          name="payment_method" 
          value="thawani"
          className="mr-2"
        />
        <label htmlFor="payment_thawani" className="font-medium">
          Thawani Pay
        </label>
      </div>
      <p className="text-sm text-gray-600 pl-6 mb-4">
        Payment Methods Accepted:
        <br />
        VisaCard/Master Card and Credit Card/Debit Card
      </p>
      <button
        onClick={handleThawaniPayment}
        className="w-full py-2 bg-brand text-white rounded-lg hover:bg-brand/90"
      >
        Pay with Thawani
      </button>
    </div>
  );
};

export default ThawaniPayment;
