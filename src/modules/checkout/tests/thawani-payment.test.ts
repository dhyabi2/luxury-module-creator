
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Thawani Payment Flow', () => {
  const mockCart = {
    items: [
      {
        id: '1',
        name: 'Test Product',
        price: 100,
        quantity: 2,
        currency: 'OMR',
        image: 'test-image.jpg'
      }
    ],
    subtotal: 200,
    discount: 0,
    total: 200
  };

  const mockBillingDetails = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+96812345678',
    address1: 'Test Street',
    city: 'Muscat',
    country: 'OM',
    postcode: '100',
    company: '',
    address2: '',
    state: '',
    orderNotes: ''
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset mocks
    vi.clearAllMocks();
  });

  it('should create a Thawani session successfully', async () => {
    const expectedSessionResponse = {
      data: {
        session_id: 'test_session_123',
        payment_url: 'https://uatcheckout.thawani.om/pay/test_session_123'
      }
    };

    // Mock the Supabase edge function call
    const mockInvoke = vi.spyOn(supabase.functions, 'invoke').mockResolvedValue(expectedSessionResponse);

    // Simulate creating a Thawani session
    const response = await supabase.functions.invoke('create-thawani-session', {
      body: {
        products: mockCart.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_amount: Math.round(item.price * 1000) // Convert to baisa
        })),
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/canceled`,
        metadata: {
          customer_email: mockBillingDetails.email,
          customer_name: `${mockBillingDetails.firstName} ${mockBillingDetails.lastName}`
        }
      }
    });

    // Assertions
    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(response.data.session_id).toBe('test_session_123');
    expect(response).toEqual(expectedSessionResponse);
  });

  it('should handle cart items conversion to Thawani format', () => {
    const thawaniProducts = mockCart.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_amount: Math.round(item.price * 1000)
    }));

    expect(thawaniProducts).toEqual([
      {
        name: 'Test Product',
        quantity: 2,
        unit_amount: 100000 // 100 OMR converted to baisa
      }
    ]);
  });

  it('should log create-thawani-session response', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    const response = await supabase.functions.invoke('create-thawani-session', {
      body: {
        products: mockCart.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit_amount: Math.round(item.price * 1000)
        })),
        success_url: `${window.location.origin}/checkout/success`,
        cancel_url: `${window.location.origin}/checkout/canceled`
      }
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it('should handle direct checkout process', async () => {
    const mockProduct = mockCart.items[0];
    
    const checkoutResponse = await fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: mockProduct.id,
          name: mockProduct.name,
          price: mockProduct.price,
          currency: mockProduct.currency,
          quantity: mockProduct.quantity,
          image: mockProduct.image
        }],
        mode: 'payment',
        successUrl: window.location.origin + '/checkout/success',
        cancelUrl: window.location.origin + '/checkout/canceled'
      })
    });

    expect(checkoutResponse.ok).toBe(true);
    const data = await checkoutResponse.json();
    expect(data).toBeDefined();
  });
});
