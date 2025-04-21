
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TestResultDisplay from './TestResultDisplay';
import { CheckIcon, XIcon } from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

const FilterTests: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";

  const runBasicFilterTests = async () => {
    const testResults: TestResult[] = [];
    setRunning(true);
    
    // Test filter by category
    try {
      const start = performance.now();
      console.log('Running test: filter products by category');
      
      const params = new URLSearchParams();
      params.append('category', 'watches');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Category filter test results:', data);
      
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => 
                       product.category.toLowerCase().includes('watches')
                     );
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter by Category',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products match the category filter');
      }
      
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter by Category',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test filter by price range
    try {
      const start = performance.now();
      console.log('Running test: filter products by price range');
      
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
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Price range filter test results:', data);
      
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => 
                       product.price >= 100 && product.price <= 500
                     );
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter by Price Range',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products match the price range filter');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter by Price Range',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test filter by brand
    try {
      const start = performance.now();
      console.log('Running test: filter products by brand');
      
      const params = new URLSearchParams();
      params.append('brand', 'Rolex,Omega');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Brand filter test results:', data);
      
      // Enhanced logging for brand test failures
      if (data.products.length === 0) {
        console.error('Brand filter test failed: No products returned');
        throw new Error('No products returned for brand filter');
      }
      
      const nonMatchingProducts = data.products.filter((product: any) => 
        !['rolex', 'omega'].includes(product.brand.toLowerCase())
      );
      
      if (nonMatchingProducts.length > 0) {
        console.error('Brand filter test failed: Some products have incorrect brands', 
          nonMatchingProducts.map((p: any) => ({ id: p.id, brand: p.brand }))
        );
      }
      
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => 
                       ['rolex', 'omega'].includes(product.brand.toLowerCase())
                     );
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter by Brand',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products match the brand filter');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter by Brand',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    setResults(testResults);
    setRunning(false);
  };
  
  const runWatchFilterTests = async () => {
    const testResults: TestResult[] = [];
    setRunning(true);
    
    // Test filter by case size
    try {
      const start = performance.now();
      console.log('Running test: filter watches by case size');
      
      const params = new URLSearchParams();
      params.append('category', 'watches');
      params.append('minCaseSize', '30');
      params.append('maxCaseSize', '45');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      let passed = data.products.length > 0;
      
      // Validate case sizes when available in specifications
      for (const product of data.products) {
        if (product.specifications && product.specifications.caseSize) {
          const size = parseInt(product.specifications.caseSize);
          if (size < 30 || size > 45) {
            passed = false;
            throw new Error(`Found watch with invalid case size: ${size}mm`);
          }
        }
      }
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter by Case Size',
        passed,
        duration: Math.round(duration)
      });
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter by Case Size',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test filter by gender
    try {
      const start = performance.now();
      console.log('Running test: filter watches by gender');
      
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
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      let passed = data.products.length > 0;
      
      // Validate gender when available in specifications
      for (const product of data.products) {
        if (product.specifications && product.specifications.gender) {
          const gender = product.specifications.gender.toLowerCase();
          if (gender !== 'men') {
            passed = false;
            throw new Error(`Found watch with incorrect gender: ${gender}`);
          }
        }
      }
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter by Gender',
        passed,
        duration: Math.round(duration)
      });
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter by Gender',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    setResults(testResults);
    setRunning(false);
  };
  
  const runSpecialFilterTests = async () => {
    const testResults: TestResult[] = [];
    setRunning(true);
    
    // Test filter for clearance products
    try {
      const start = performance.now();
      console.log('Running test: filter clearance products');
      
      const params = new URLSearchParams();
      params.append('clearance', 'true');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => product.discount > 0);
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter Clearance Products',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products have discount > 0');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter Clearance Products',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test filter for in-stock products
    try {
      const start = performance.now();
      console.log('Running test: filter in-stock products');
      
      const params = new URLSearchParams();
      params.append('instock', 'true');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => product.stock > 0);
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Filter In-Stock Products',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products have stock > 0');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Filter In-Stock Products',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    setResults(testResults);
    setRunning(false);
  };
  
  const runCombinedFilterTests = async () => {
    const testResults: TestResult[] = [];
    setRunning(true);
    
    // Test multiple filter criteria together
    try {
      const start = performance.now();
      console.log('Running test: apply multiple filter criteria');
      
      const params = new URLSearchParams();
      params.append('category', 'watches');
      params.append('brand', 'Rolex');
      params.append('minPrice', '1000');
      params.append('maxPrice', '20000');
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/products?${params.toString()}`, {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const passed = data.products.length > 0 && 
                     data.products.every((product: any) => 
                       product.category.toLowerCase().includes('watches') &&
                       product.brand.toLowerCase() === 'rolex' &&
                       product.price >= 1000 &&
                       product.price <= 20000
                     );
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Combined Filters',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Not all products match the combined filter criteria');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Combined Filters',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    // Test pagination with filters
    try {
      const start = performance.now();
      console.log('Running test: pagination with filters');
      
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
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const passed = data.products.length <= 8 &&
                     data.pagination.currentPage === 1;
      
      const duration = performance.now() - start;
      
      testResults.push({
        name: 'Pagination with Filters',
        passed,
        duration: Math.round(duration)
      });
      
      if (!passed) {
        throw new Error('Pagination is not working correctly');
      }
    } catch (error) {
      console.error('Test failed:', error);
      testResults.push({
        name: 'Pagination with Filters',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    
    setResults(testResults);
    setRunning(false);
  };
  
  const runAllTests = async () => {
    setRunning(true);
    setResults([]);
    
    try {
      await runBasicFilterTests();
      await runWatchFilterTests();
      await runSpecialFilterTests();
      await runCombinedFilterTests();
    } catch (error) {
      console.error('Test suite failed:', error);
    }
    
    setRunning(false);
  };
  
  const getRunTestFunction = () => {
    switch (activeTab) {
      case 'basic':
        return runBasicFilterTests;
      case 'watch':
        return runWatchFilterTests;
      case 'special':
        return runSpecialFilterTests;
      case 'combined':
        return runCombinedFilterTests;
      case 'all':
        return runAllTests;
      default:
        return runBasicFilterTests;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeTab === 'basic' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('basic')}
        >
          Basic Filters
        </Button>
        <Button 
          variant={activeTab === 'watch' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('watch')}
        >
          Watch Filters
        </Button>
        <Button 
          variant={activeTab === 'special' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('special')}
        >
          Special Filters
        </Button>
        <Button 
          variant={activeTab === 'combined' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('combined')}
        >
          Combined Filters
        </Button>
        <Button 
          variant={activeTab === 'all' ? 'default' : 'outline'} 
          onClick={() => setActiveTab('all')}
        >
          All Tests
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {activeTab === 'basic' && 'Basic Filter Tests'}
          {activeTab === 'watch' && 'Watch-Specific Filter Tests'}
          {activeTab === 'special' && 'Special Filter Tests'}
          {activeTab === 'combined' && 'Combined Filter Tests'}
          {activeTab === 'all' && 'All Filter Tests'}
        </h3>
        <Button 
          onClick={getRunTestFunction()}
          disabled={running}
        >
          {running ? 'Running...' : 'Run Tests'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Results</h3>
          <div className="border rounded-md divide-y">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 flex justify-between items-center ${
                  result.passed ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <CheckIcon className="text-green-600 h-5 w-5" />
                  ) : (
                    <XIcon className="text-red-600 h-5 w-5" />
                  )}
                  <span>{result.name}</span>
                  {result.duration && (
                    <span className="text-xs text-gray-500">{result.duration}ms</span>
                  )}
                </div>
                <div>
                  {result.error && (
                    <TestResultDisplay error={result.error} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTests;
