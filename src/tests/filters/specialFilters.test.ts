
import { describe, it, expect } from 'vitest';

// Test suite for special filters (clearance, in-stock, etc.)
describe('Special Filters', () => {
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  const fetchFilteredProducts = async (params: URLSearchParams) => {
    console.log(`Testing special filter: ${params.toString()}`);
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };

  it('should filter clearance products', async () => {
    const params = new URLSearchParams();
    params.append('clearance', 'true');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.discount > 0
    )).toBe(true);
  });

  it('should filter in-stock products', async () => {
    const params = new URLSearchParams();
    params.append('instock', 'true');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.stock > 0
    )).toBe(true);
  });
});
