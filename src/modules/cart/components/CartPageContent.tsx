
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType, Cart } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2, Plus, Minus, RefreshCw, ShoppingCart } from 'lucide-react';
import CartItem from './CartItem';
import { toast } from 'sonner';

export const CartPageContent: React.FC = () => {
  // Direct state management, no hooks
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  
  // Direct API call, no service abstraction
  useEffect(() => {
    console.log('Loading cart from local storage');
    
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
  
  // Direct cart update functions, no abstraction
  const updateCart = (updatedCart: Cart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  
  const removeItem = (itemId: string) => {
    console.log('Removing item from cart:', itemId);
    
    const updatedItems = cart.items.filter(item => item.id !== itemId);
    const updatedCart = recalculateCart(updatedItems);
    
    updateCart(updatedCart);
    toast.success('Item removed from cart');
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    console.log('Updating quantity for item:', itemId, 'to', quantity);
    
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedItems = cart.items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    
    const updatedCart = recalculateCart(updatedItems);
    updateCart(updatedCart);
  };
  
  const recalculateCart = (items: CartItemType[]): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = items.reduce((sum, item) => {
      if (item.discount) {
        const itemDiscount = (item.price * item.discount / 100) * item.quantity;
        return sum + itemDiscount;
      }
      return sum;
    }, 0);
    
    return {
      items,
      totalItems,
      subtotal,
      discount,
      total: subtotal - discount,
      shipping: { method: 'Free shipping', cost: 0 }
    };
  };
  
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    // Direct API call to apply coupon would go here
    console.log('Applying coupon:', couponCode);
    toast('Coupon processing...', {
      description: 'This is a demonstration without backend integration'
    });
  };
  
  const updateCartItems = () => {
    // This would call an API to update the cart on the server
    console.log('Updating cart items');
    toast.success('Cart updated');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="woocommerce-page-header mb-8">
        <ul className="flex border-b">
          <li className="pb-2 px-4 border-b-2 border-brand font-medium">
            <Link to="/cart" className="text-brand">
              Shopping Cart <span className="cart-count">({cart.totalItems})</span>
            </Link>
          </li>
          <li className="pb-2 px-4">
            <Link to="/checkout" className="text-gray-600 hover:text-brand">Checkout</Link>
          </li>
          <li className="pb-2 px-4">
            <Link to="/tracking" className="text-gray-600 hover:text-brand">Order Tracking</Link>
          </li>
        </ul>
      </div>
      
      <div className="woocommerce-cart-page row flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cart.items.length > 0 ? (
            <div className="woocommerce-cart-form">
              <table className="shop_table w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-2 text-left text-sm font-semibold text-gray-700">Product</th>
                    <th className="py-4 px-2 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="py-4 px-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="py-4 px-2 text-left text-sm font-semibold text-gray-700">Subtotal</th>
                    <th className="py-4 px-2 text-left text-sm font-semibold text-gray-700">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0 mr-4">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=300&h=300&fit=crop';
                              }}
                            />
                          </Link>
                          <div className="product-name">
                            <Link to={`/product/${item.productId}`} className="font-medium text-gray-800 hover:text-brand">
                              {item.name}
                            </Link>
                            <div className="text-sm text-gray-500">{item.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-medium">OMR {item.price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex border border-gray-300 rounded w-28">
                          <button 
                            type="button" 
                            className="flex-1 px-2 py-1 text-gray-500 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4 mx-auto" />
                          </button>
                          <span className="flex-1 px-2 py-1 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            type="button" 
                            className="flex-1 px-2 py-1 text-gray-500 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4 mx-auto" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="font-medium">
                          OMR {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="py-6">
                      <div className="bottom-cart flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="coupon flex">
                          <input 
                            type="text" 
                            className="border border-gray-300 rounded-l px-4 py-2 w-48"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Coupon code" 
                          />
                          <Button 
                            onClick={applyCoupon}
                            className="rounded-l-none"
                          >
                            Apply coupon
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <Link to="/" className="text-brand hover:underline font-medium">
                            Continue Shopping
                          </Link>
                          <Button 
                            variant="outline"
                            onClick={updateCartItems}
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Update cart
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-gray-50">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/">
                <Button className="px-8">Browse Products</Button>
              </Link>
            </div>
          )}
        </div>
        
        {cart.items.length > 0 && (
          <div className="lg:w-1/3">
            <div className="cart-collaterals border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-bold mb-6">Cart totals</h2>
              
              <div className="space-y-4">
                <div className="cart-subtotal flex justify-between pb-4 border-b border-gray-200">
                  <div className="title font-medium">Subtotal</div>
                  <div className="font-medium">OMR {cart.subtotal.toFixed(2)}</div>
                </div>
                
                {cart.discount > 0 && (
                  <div className="cart-discount flex justify-between pb-4 border-b border-gray-200">
                    <div className="title font-medium">Discount</div>
                    <div className="font-medium text-red-500">-OMR {cart.discount.toFixed(2)}</div>
                  </div>
                )}
                
                <div className="shipping-section pb-4 border-b border-gray-200">
                  <h3 className="font-medium mb-2">Shipping</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div>Free shipping</div>
                    <div>OMR 0.00</div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Shipping options will be updated during checkout.
                  </p>
                  <button className="text-brand text-sm mt-2 hover:underline">
                    Calculate shipping
                  </button>
                </div>
                
                <div className="order-total flex justify-between pt-2">
                  <div className="title font-bold text-lg">Total</div>
                  <div className="font-bold text-lg">OMR {cart.total.toFixed(2)}</div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <Link to="/checkout">
                    <Button className="w-full py-6 text-base">
                      Proceed to checkout
                    </Button>
                  </Link>
                  
                  <div className="paypal-buttons-container border border-gray-200 p-2 rounded bg-white">
                    <div className="text-center text-sm text-gray-500 py-2">
                      PayPal / Card Payments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
