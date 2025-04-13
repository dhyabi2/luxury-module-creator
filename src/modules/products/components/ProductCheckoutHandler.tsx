
import { toast } from 'sonner';
import { Product } from '@/types/api';

interface CheckoutHandlerProps {
  product: Product;
  quantity: number;
}

const ProductCheckoutHandler = {
  handleDirectCheckout: ({ product, quantity }: CheckoutHandlerProps) => {
    console.log('Processing direct checkout for:', product, 'Quantity:', quantity);
    
    fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo'
      },
      body: JSON.stringify({
        items: [{
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          currency: product.currency,
          quantity: quantity,
          image: product.image
        }],
        mode: 'payment',
        successUrl: window.location.origin + '/checkout/success',
        cancelUrl: window.location.origin + '/checkout/canceled'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
  }
};

export default ProductCheckoutHandler;
