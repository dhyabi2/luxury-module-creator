import React, { useState, useEffect } from 'react';
import ProductGridHeader from './components/ProductGridHeader';
import ProductGridLoading from './components/ProductGridLoading';
import ProductGridEmpty from './components/ProductGridEmpty';
import ProductGridContent from './components/ProductGridContent';
import { Product } from '@/types/api';
import { toast } from 'sonner';

interface ProductGridProps {
  gender?: string;
  brand?: string;
  category?: string;
  isNewIn?: boolean;
  isOnSale?: boolean;
  title?: string;
  filters?: Record<string, any>;
  pageSize?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  gender = '', 
  brand = '', 
  category = '', 
  isNewIn = false, 
  isOnSale = false,
  title,
  filters = {},
  pageSize = 8
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Load products when dependencies change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      console.log('Loading products with filters:', filters);
      
      // Build query params
      const urlParams = new URLSearchParams();
      
      // Add page navigation filters
      if (gender) urlParams.append('gender', gender);
      if (brand) urlParams.append('brand', brand);
      if (category) urlParams.append('category', category);
      if (isNewIn) urlParams.append('isNewIn', 'true');
      if (isOnSale) urlParams.append('isOnSale', 'true');
      
      // Add user-selected filters (using OR logic within each category)
      if (filters.brands && filters.brands.length > 0 && !filters.brands.includes('all')) {
        urlParams.append('brand', filters.brands.join(','));
        console.log('Filtering by brands:', filters.brands.join(','));
      }
      
      if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
        urlParams.append('category', filters.categories.join(','));
        console.log('Filtering by categories:', filters.categories.join(','));
      }
      
      if (filters.genders && filters.genders.length > 0 && !filters.genders.includes('all')) {
        urlParams.append('gender', filters.genders.join(','));
        console.log('Filtering by genders:', filters.genders.join(','));
      }
      
      if (filters.bands && filters.bands.length > 0 && !filters.bands.includes('all')) {
        urlParams.append('band', filters.bands.join(','));
        console.log('Filtering by bands:', filters.bands.join(','));
      }
      
      if (filters.caseColors && filters.caseColors.length > 0 && !filters.caseColors.includes('all')) {
        urlParams.append('caseColor', filters.caseColors.join(','));
        console.log('Filtering by case colors:', filters.caseColors.join(','));
      }
      
      if (filters.colors && filters.colors.length > 0 && !filters.colors.includes('all')) {
        urlParams.append('color', filters.colors.join(','));
        console.log('Filtering by colors:', filters.colors.join(','));
      }
      
      if (filters.priceRange) {
        urlParams.append('minPrice', filters.priceRange.min.toString());
        urlParams.append('maxPrice', filters.priceRange.max.toString());
        console.log('Filtering by price range:', `${filters.priceRange.min}-${filters.priceRange.max}`);
      }
      
      // Check if watches is in the selected categories
      const hasWatchesCategory = 
        (filters.categories && filters.categories.includes('watches')) || 
        (category && category.toLowerCase() === 'watches');

      // Only include case size if watches category is selected
      if (filters.caseSizeRange && hasWatchesCategory) {
        urlParams.append('minCaseSize', filters.caseSizeRange.min.toString());
        urlParams.append('maxCaseSize', filters.caseSizeRange.max.toString());
        console.log('Filtering by case size range:', `${filters.caseSizeRange.min}-${filters.caseSizeRange.max}`);
      }
      
      // Add pagination and sorting
      urlParams.append('page', currentPage.toString());
      urlParams.append('pageSize', pageSize.toString());
      urlParams.append('sortBy', sortBy);
      
      const queryString = urlParams.toString();
      console.log('Final query string:', queryString);
      
      try {
        console.log('Fetching products with query params:', queryString);
        
        // Make direct API call with completely unrestricted access
        const SUPABASE_URL = "https://kkdldvrceqdcgclnvixt.supabase.co";
        const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo";
        
        // Use a simpler URL for watches + gender combination to avoid SQL join issues
        let finalUrl = `${SUPABASE_URL}/functions/v1/products?${queryString}`;
        
        // Fix for watches + gender filter issue - use a specialized endpoint format
        if (hasWatchesCategory && filters.genders && filters.genders.length > 0 && !filters.genders.includes('all')) {
          console.log('Using modified query format for watches + gender combination');
          
          // Remove gender from URL parameters to rebuild it in a different format
          const newUrlParams = new URLSearchParams(urlParams.toString());
          newUrlParams.delete('gender');
          
          // Add gender back but in a text search format that the API can handle better
          finalUrl = `${SUPABASE_URL}/functions/v1/products?${newUrlParams.toString()}&genderSearch=${filters.genders.join(',')}`;
          console.log('Modified URL:', finalUrl);
        }
        
        console.log('Making API call to:', finalUrl);
        const response = await fetch(finalUrl, {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch products:', response.status, response.statusText);
          
          // If we get a 500 error, try a simpler fallback request with fewer filters
          if (response.status === 500) {
            console.log('Trying fallback request with fewer filters');
            
            const fallbackParams = new URLSearchParams();
            
            // Only keep essential parameters
            if (hasWatchesCategory) {
              fallbackParams.append('category', 'watches');
            } else if (category) {
              fallbackParams.append('category', category);
            } else if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
              fallbackParams.append('category', filters.categories.join(','));
            }
            
            // Keep brand filter as it's important
            if (filters.brands && filters.brands.length > 0 && !filters.brands.includes('all')) {
              fallbackParams.append('brand', filters.brands.join(','));
            }
            
            // Add pagination and sorting
            fallbackParams.append('page', currentPage.toString());
            fallbackParams.append('pageSize', pageSize.toString());
            fallbackParams.append('sortBy', sortBy);
            
            const fallbackUrl = `${SUPABASE_URL}/functions/v1/products?${fallbackParams.toString()}`;
            console.log('Fallback URL:', fallbackUrl);
            
            const fallbackResponse = await fetch(fallbackUrl, {
              headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
              }
            });
            
            if (!fallbackResponse.ok) {
              throw new Error(`Failed to fetch products: ${fallbackResponse.statusText}`);
            }
            
            const fallbackData = await fallbackResponse.json();
            setProducts(fallbackData.products);
            setTotalPages(fallbackData.pagination.totalPages);
            setTotalCount(fallbackData.pagination.totalCount);
            setCurrentPage(fallbackData.pagination.currentPage);
            setError("Some filters were disabled due to compatibility issues");
            setLoading(false);
            return;
          }
          
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log('Product data received:', data);
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        setCurrentPage(data.pagination.currentPage);
        setError(null);
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [gender, brand, category, isNewIn, isOnSale, currentPage, sortBy, JSON.stringify(filters), pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (loading && products.length === 0) {
    return <ProductGridLoading sortBy={sortBy} onSortChange={handleSortChange} />;
  }

  return (
    <div className="space-y-4">
      <ProductGridHeader
        title={title}
        totalProducts={totalCount}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        loading={loading}
      />
      
      {products.length === 0 && !loading ? (
        <ProductGridEmpty />
      ) : (
        <ProductGridContent 
          products={products}
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {error && error !== "Some filters were disabled due to compatibility issues" && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}
      
      {error === "Some filters were disabled due to compatibility issues" && (
        <div className="text-amber-500 text-center py-2 text-sm">
          Note: Some filters were simplified for compatibility with non-watch items
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
