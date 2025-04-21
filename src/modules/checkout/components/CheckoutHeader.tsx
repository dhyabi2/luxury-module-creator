
import React from 'react';
import { Link } from 'react-router-dom';

interface CheckoutHeaderProps {
  activeStep: 'cart' | 'checkout' | 'tracking';
  cartItemCount?: number;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ activeStep, cartItemCount = 0 }) => {
  return (
    <div className="woocommerce-page-header mb-8">
      <ul className="flex border-b">
        <li className={`pb-2 px-4 ${activeStep === 'cart' ? 'border-b-2 border-brand font-medium' : ''}`}>
          <Link to="/cart" className={activeStep === 'cart' ? 'text-brand' : 'text-gray-600 hover:text-brand'}>
            Shopping Cart <span className="cart-count">({cartItemCount})</span>
          </Link>
        </li>
        <li className={`pb-2 px-4 ${activeStep === 'checkout' ? 'border-b-2 border-brand font-medium' : ''}`}>
          <Link to="/checkout" className={activeStep === 'checkout' ? 'text-brand' : 'text-gray-600 hover:text-brand'}>
            Checkout
          </Link>
        </li>
        <li className={`pb-2 px-4 ${activeStep === 'tracking' ? 'border-b-2 border-brand font-medium' : ''}`}>
          <Link to="/tracking" className={activeStep === 'tracking' ? 'text-brand' : 'text-gray-600 hover:text-brand'}>
            Order Tracking
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CheckoutHeader;
