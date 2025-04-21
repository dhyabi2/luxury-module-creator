
import { describe, it, expect } from 'vitest';

// Test suite for filter functionality
describe('Product Filtering System', () => {
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  // Test single category filter
  it('should filter products by single category', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches')
    )).toBe(true);
  });

  // Test multiple category selection
  it('should filter products by multiple categories', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches,accessories');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches') || 
      product.category.toLowerCase().includes('accessories')
    )).toBe(true);
  });

  // Test price range filter
  it('should filter products by price range', async () => {
    const params = new URLSearchParams();
    params.append('minPrice', '100');
    params.append('maxPrice', '500');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.price >= 100 && product.price <= 500
    )).toBe(true);
  });

  // Test multiple brands selection
  it('should filter products by multiple brands', async () => {
    const params = new URLSearchParams();
    params.append('brand', 'Rolex,Omega');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      ['rolex', 'omega'].includes(product.brand.toLowerCase())
    )).toBe(true);
  });

  // Test combined filters (category + price + brand)
  it('should apply multiple filter criteria together', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('brand', 'Rolex');
    params.append('minPrice', '1000');
    params.append('maxPrice', '5000');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.category.toLowerCase().includes('watches') &&
      product.brand.toLowerCase() === 'rolex' &&
      product.price >= 1000 &&
      product.price <= 5000
    )).toBe(true);
  });

  // Test clearance filter
  it('should filter clearance products', async () => {
    const params = new URLSearchParams();
    params.append('clearance', 'true');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.discount > 0
    )).toBe(true);
  });

  // Test in-stock filter
  it('should filter in-stock products', async () => {
    const params = new URLSearchParams();
    params.append('instock', 'true');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.every((product: any) => 
      product.stock > 0
    )).toBe(true);
  });

  // Test watch-specific filters
  it('should filter watches by case size range', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('minCaseSize', '30');
    params.append('maxCaseSize', '40');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    data.products.forEach((product: any) => {
      if (product.specifications && product.specifications.caseSize) {
        const size = parseInt(product.specifications.caseSize);
        expect(size).toBeGreaterThanOrEqual(30);
        expect(size).toBeLessThanOrEqual(40);
      }
    });
  });

  // Test gender filter for watches
  it('should filter watches by gender', async () => {
    const params = new URLSearchParams();
    params.append('category', 'watches');
    params.append('genderSearch', 'men');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    data.products.forEach((product: any) => {
      if (product.specifications && product.specifications.gender) {
        expect(product.specifications.gender.toLowerCase()).toBe('men');
      }
    });
  });

  // Test pagination
  it('should return correct number of products per page', async () => {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('pageSize', '8');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    const data = await response.json();
    expect(data.products.length).toBeLessThanOrEqual(8);
    expect(data.pagination.currentPage).toBe(1);
  });
});
