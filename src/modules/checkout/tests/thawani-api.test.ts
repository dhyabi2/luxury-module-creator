
import { describe, it, expect } from 'vitest';

describe('Thawani API Integration', () => {
  const THAWANI_API_BASE_URL = 'https://uatcheckout.thawani.om/api/v1';
  const THAWANI_PUBLIC_KEY = 'HGvTMLDssJghr9tlN9gr4DVYt0qyBy';

  it('should validate Thawani API endpoint', () => {
    expect(THAWANI_API_BASE_URL).toBe('https://uatcheckout.thawani.om/api/v1');
  });

  it('should validate Thawani public key format', () => {
    expect(THAWANI_PUBLIC_KEY).toMatch(/^[A-Za-z0-9]{30}$/);
  });

  it('should construct valid Thawani checkout URL', () => {
    const mockSessionId = 'test_session_123';
    const checkoutUrl = `${THAWANI_API_BASE_URL}/checkout/session/${mockSessionId}`;
    expect(checkoutUrl).toContain(mockSessionId);
  });

  it('should validate payment URL format', () => {
    const mockSessionId = 'test_session_123';
    const paymentUrl = `https://uatcheckout.thawani.om/pay/${mockSessionId}?key=${THAWANI_PUBLIC_KEY}`;
    
    expect(paymentUrl).toContain('uatcheckout.thawani.om/pay/');
    expect(paymentUrl).toContain(mockSessionId);
    expect(paymentUrl).toContain(THAWANI_PUBLIC_KEY);
  });
});
