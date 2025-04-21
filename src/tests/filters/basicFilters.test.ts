
import { describe, it, expect } from 'vitest';

// Test suite for basic filter functionality
describe('Basic Product Filters', () => {
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  const fetchFilteredProducts = async (params: URLSearchParams) => {
    console.log(`Testing filter: ${params.toString()}`);
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

  it('should filter products by single category', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches')
    )).toBe(true);
  });

  it('should filter products by multiple categories', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches,accessories');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches') || 
      product.category.toLowerCase().includes('accessories')
    )).toBe(true);
  });

  it('should filter products by price range', async () => {
    const params = new URLSearchParams();
    params.append('minPrice', '100');
    params.append('maxPrice', '500');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.price >= 100 && product.price <= 500
    )).toBe(true);
  });

  it('should filter products by multiple brands', async () => {
    const params = new URLSearchParams();
    params.append('brand', 'Rolex,Omega');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      ['rolex', 'omega'].includes(product.brand.toLowerCase())
    )).toBe(true);
  });
});
