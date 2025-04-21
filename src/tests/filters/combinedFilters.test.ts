
import { describe, it, expect } from 'vitest';

// Test suite for combined filters
describe('Combined Filters', () => {
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  const fetchFilteredProducts = async (params: URLSearchParams) => {
    console.log(`Testing combined filters: ${params.toString()}`);
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

  it('should apply multiple filter criteria together', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('brand', 'Rolex');
    params.append('minPrice', '1000');
    params.append('maxPrice', '20000');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches') &&
      product.brand.toLowerCase() === 'rolex' &&
      product.price >= 1000 &&
      product.price <= 20000
    )).toBe(true);
  });

  it('should handle pagination with filters', async () => {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('pageSize', '8');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeLessThanOrEqual(8);
    expect(data.pagination.currentPage).toBe(1);
  });

  it('should combine special filters with basic filters', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('clearance', 'true');
    params.append('instock', 'true');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches') &&
      product.discount > 0 &&
      product.stock > 0
    )).toBe(true);
  });
});
