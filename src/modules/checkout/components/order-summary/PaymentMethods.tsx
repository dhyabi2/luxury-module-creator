
import React from 'react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="payment-methods space-y-4">
      <div className="bg-white p-4 border rounded">
        <div className="flex items-center mb-2">
          <input 
            type="radio" 
            id="payment_thawani" 
            name="payment_method"
            value="thawani"
            checked={selectedMethod === 'thawani'}
            onChange={onMethodChange}
            className="mr-2"
          />
          <label htmlFor="payment_thawani" className="font-medium">Thawani Pay</label>
        </div>
        <p className="text-sm text-gray-600 pl-6">
          Pay securely using Thawani payment gateway.
          <br />
          Payment Methods Accepted: VisaCard/Master Card and Credit Card/Debit Card
        </p>
      </div>

      <div className="bg-white p-4 border rounded">
        <div className="flex items-center mb-2">
          <input 
            type="radio" 
            id="payment_cash" 
            name="payment_method"
            value="cash"
            checked={selectedMethod === 'cash'}
            onChange={onMethodChange}
            className="mr-2"
          />
          <label htmlFor="payment_cash" className="font-medium">Cash on Delivery</label>
        </div>
        <p className="text-sm text-gray-600 pl-6">
          Pay with cash upon delivery.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;
