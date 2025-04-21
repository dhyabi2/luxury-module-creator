
import { describe, it, expect } from 'vitest';

// Test suite for watch-specific filters
describe('Watch-Specific Filters', () => {
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  const fetchFilteredProducts = async (params: URLSearchParams) => {
    console.log(`Testing watch filter: ${params.toString()}`);
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

  it('should filter watches by case size range', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('minCaseSize', '30');
    params.append('maxCaseSize', '45');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((product: any) => {
      if (product.specifications && product.specifications.caseSize) {
        const size = parseInt(product.specifications.caseSize);
        expect(size).toBeGreaterThanOrEqual(30);
        expect(size).toBeLessThanOrEqual(45);
      }
    });
  });

  it('should filter watches by gender', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('genderSearch', 'men');
    
    const data = await fetchFilteredProducts(params);
    
    expect(data.products.length).toBeGreaterThan(0);
    data.products.forEach((product: any) => {
      if (product.specifications && product.specifications.gender) {
        expect(product.specifications.gender.toLowerCase()).toBe('men');
      }
    });
  });
});
