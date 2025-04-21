
import React, { useState, useEffect } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, CreditCard } from 'lucide-react';

const Checkout = () => {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleCheckout = () => {
    // Direct API call to process checkout
    console.log('Processing checkout with cart:', cart);
    
    // Redirect to success page (in a real implementation, this would happen after payment)
    window.location.href = '/checkout/success';
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              You need to add some products to your cart before proceeding to checkout.
            </p>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="page-title bg-gray-100 py-8 mb-6">
        <div className="container">
          <div className="content-title-heading">
            <span className="text-sm font-medium text-gray-500">Shop</span>
            <h1 className="text-3xl font-bold mt-1">
              Checkout
            </h1>
          </div>
          <div className="breadcrumb text-sm text-gray-500 mt-2">
            <a href="/" className="hover:text-brand">Home</a> 
            <span className="mx-2">/</span>
            <a href="/cart" className="hover:text-brand">Cart</a>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Checkout</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="woocommerce-page-header mb-8">
          <ul className="flex border-b">
            <li className="pb-2 px-4">
              <Link to="/cart" className="text-gray-600 hover:text-brand">
                Shopping Cart <span className="cart-count">({cart.totalItems})</span>
              </Link>
            </li>
            <li className="pb-2 px-4 border-b-2 border-brand font-medium">
              <Link to="/checkout" className="text-brand">Checkout</Link>
            </li>
            <li className="pb-2 px-4">
              <Link to="/tracking" className="text-gray-600 hover:text-brand">Order Tracking</Link>
            </li>
          </ul>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="billing-details">
            <h2 className="text-xl font-bold mb-6">Billing Details</h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (optional)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country / Region *</label>
                <select 
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Select a country</option>
                  <option value="OM">Oman</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input 
                  type="text" 
                  required
                  placeholder="House number and street name"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
                <input 
                  type="text" 
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town / City *</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode / ZIP *</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input 
                  type="tel" 
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                <textarea 
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                ></textarea>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h2 className="text-xl font-bold mb-6">Your Order</h2>
            
            <div className="border rounded-lg p-6 bg-gray-50">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-4">Product</th>
                    <th className="text-right pb-4">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">
                        {item.name} <strong>× {item.quantity}</strong>
                      </td>
                      <td className="py-3 text-right">
                        OMR {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-b">
                    <th className="text-left py-3">Subtotal</th>
                    <td className="text-right py-3">OMR {cart.subtotal.toFixed(2)}</td>
                  </tr>
                  {cart.discount > 0 && (
                    <tr className="border-b">
                      <th className="text-left py-3">Discount</th>
                      <td className="text-right py-3 text-red-500">-OMR {cart.discount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <th className="text-left py-3">Shipping</th>
                    <td className="text-right py-3">Free shipping</td>
                  </tr>
                  <tr>
                    <th className="text-left py-3">Total</th>
                    <td className="text-right py-3 font-bold">OMR {cart.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="mt-6 space-y-4">
                <div className="bg-white p-4 border rounded">
                  <div className="flex items-center mb-2">
                    <input type="radio" id="payment_cash" name="payment_method" checked readOnly />
                    <label htmlFor="payment_cash" className="ml-2 font-medium">Cash on Delivery</label>
                  </div>
                  <p className="text-sm text-gray-600 pl-6">
                    Pay with cash upon delivery.
                  </p>
                </div>
                
                <div className="bg-white p-4 border rounded">
                  <div className="flex items-center mb-2">
                    <input type="radio" id="payment_card" name="payment_method" disabled />
                    <label htmlFor="payment_card" className="ml-2 font-medium text-gray-500">Credit Card / Debit Card</label>
                  </div>
                  <p className="text-sm text-gray-400 pl-6">
                    This payment method is currently unavailable.
                  </p>
                </div>
                
                <Button 
                  className="w-full py-6 text-base mt-6"
                  onClick={handleCheckout}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
