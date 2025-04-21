
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Cart } from '@/types/cart';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import CheckoutHeader from '@/modules/checkout/components/CheckoutHeader';

export const CartPageContent: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  
  // Load cart data directly from localStorage
  useEffect(() => {
    loadCartData();
  }, []);
  
  const loadCartData = () => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart({
          items: [],
          totalItems: 0,
          subtotal: 0,
          discount: 0,
          total: 0
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cart data:', error);
      setIsLoading(false);
    }
  };
  
  // Update quantity of an item
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (!cart) return;
    
    try {
      console.log(`Updating quantity for item ${itemId} to ${newQuantity}`);
      
      if (newQuantity <= 0) {
        removeItem(itemId);
        return;
      }
      
      const updatedItems = cart.items.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      // Recalculate totals
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = updatedItems.reduce((sum, item) => {
        if (item.discount) {
          return sum + ((item.price * item.discount / 100) * item.quantity);
        }
        return sum;
      }, 0);
      const total = subtotal - discount;
      
      const updatedCart = {
        ...cart,
        items: updatedItems,
        totalItems,
        subtotal,
        discount,
        total
      };
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };
  
  // Remove an item from cart
  const removeItem = (itemId: string) => {
    if (!cart) return;
    
    try {
      console.log(`Removing item ${itemId} from cart`);
      
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      
      // Recalculate totals
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = updatedItems.reduce((sum, item) => {
        if (item.discount) {
          return sum + ((item.price * item.discount / 100) * item.quantity);
        }
        return sum;
      }, 0);
      const total = subtotal - discount;
      
      const updatedCart = {
        ...cart,
        items: updatedItems,
        totalItems,
        subtotal,
        discount,
        total
      };
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };
  
  // Apply coupon code
  const applyCoupon = () => {
    // This is just a placeholder implementation
    // In a real application, this would validate the coupon code with the backend
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    // Example implementation - apply 10% discount for any coupon code
    if (cart) {
      const discount = cart.subtotal * 0.1; // 10% discount
      const updatedCart = {
        ...cart,
        discount: cart.discount + discount,
        total: cart.subtotal - cart.discount - discount
      };
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success(`Coupon ${couponCode} applied successfully!`);
      setCouponCode('');
    }
  };
  
  // Update cart
  const updateCart = () => {
    toast.success('Cart updated');
  };
  
  // Clear cart
  const clearCart = () => {
    const emptyCart = {
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0
    };
    
    localStorage.setItem('cart', JSON.stringify(emptyCart));
    setCart(emptyCart);
    
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success('Cart cleared');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CheckoutHeader activeStep="cart" cartItemCount={0} />
        
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            You haven't added any products to your cart yet. Start shopping to fill it up!
          </p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutHeader activeStep="cart" cartItemCount={cart.totalItems} />
      
      <div className="woocommerce-cart-page grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700 text-sm">
                <tr>
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-4 text-center">Price</th>
                  <th className="py-4 px-4 text-center">Quantity</th>
                  <th className="py-4 px-4 text-right">Subtotal</th>
                  <th className="py-4 px-4 text-center">Remove</th>
                </tr>
              </thead>
              
              <tbody>
                {cart.items.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded mr-4" 
                        />
                        <div>
                          <Link to={`/product/${item.productId}`} className="font-medium hover:text-brand">
                            {item.brand} - {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-700">
                        {item.currency} {item.price.toFixed(2)}
                      </span>
                      {item.discount && (
                        <div className="text-red-500 text-xs mt-1">
                          -{item.discount}% OFF
                        </div>
                      )}
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          min="1"
                          className="w-12 h-8 text-center border-t border-b"
                        />
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4 text-right">
                      <span className="font-medium">
                        {item.currency} {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex space-x-2 mb-4 md:mb-0">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border rounded px-4 py-2 text-sm w-40"
                  />
                  <Button 
                    onClick={applyCoupon}
                    variant="outline" 
                    size="sm"
                  >
                    Apply coupon
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Link to="/">
                    <Button variant="outline">
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button onClick={updateCart}>
                    Update cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h2 className="text-xl font-bold mb-4">Cart totals</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span>Subtotal</span>
                <span>{cart.items[0]?.currency || 'OMR'} {cart.subtotal.toFixed(2)}</span>
              </div>
              
              {cart.discount > 0 && (
                <div className="flex justify-between py-3 border-b">
                  <span>Discount</span>
                  <span className="text-red-500">-{cart.items[0]?.currency || 'OMR'} {cart.discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-3 border-b">
                <span>Shipping</span>
                <span>Free shipping</span>
              </div>
              
              <div className="flex justify-between py-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  {cart.items[0]?.currency || 'OMR'} {cart.total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <Link to="/checkout">
                <Button className="w-full text-base py-6">
                  Proceed to checkout
                </Button>
              </Link>
              
              <Button onClick={clearCart} variant="outline" className="w-full">
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageContent;
