
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SecondaryCategory {
  id: string;
  name: string;
  highlight?: boolean;
}

const SecondaryNavigation = () => {
  const [categories, setCategories] = useState<SecondaryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Determine which category is active based on current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeCategory = pathSegments.length > 0 ? pathSegments[0] : '';
  
  const fetchNavigationData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching secondary navigation data');
      
      // Direct API call to the navigation edge function
      const response = await fetch("https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/navigation", {
        headers: {
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo"
        }
      });
      
      if (!response.ok) {
        console.log('Error fetching navigation data:', response.status, response.statusText);
        throw new Error(`Failed to fetch navigation data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Secondary navigation data received:', data);
      
      setCategories(data.secondaryCategories || []);
    } catch (error) {
      console.log('Error fetching secondary navigation data:', error);
      // Let the error bubble up
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNavigationData();
  }, []);

  const getCategoryRoutePath = (categoryId: string): string => {
    const routeMap: Record<string, string> = {
      'sale': '/sale',
      'new-in': '/new-in',
      'brands': '/brands',
      'watches': '/watches',
      'jewellery': '/jewellery',
      'accessories': '/accessories',
      'bags': '/bags',
      'perfumes': '/perfumes',
      'stores': '/stores'
    };
    
    return routeMap[categoryId] || '/';
  };

  // Helper function to check if current path is related to the category
  const isCategoryActive = (categoryId: string): boolean => {
    // Check if the current path starts with the category ID
    return location.pathname === getCategoryRoutePath(categoryId) || 
           location.pathname.startsWith(`${getCategoryRoutePath(categoryId)}/`);
  };

  return (
    <nav className="w-full py-2">
      {isLoading ? (
        <div className="flex space-x-5 md:space-x-8 min-w-max">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <ul className="flex space-x-5 md:space-x-8 min-w-max">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={getCategoryRoutePath(category.id)}
                className={`category-item whitespace-nowrap tracking-wider ${
                  category.highlight ? 'bg-black text-white px-4 py-1.5 rounded-sm' : ''
                } ${isCategoryActive(category.id) ? 'font-medium underline' : ''}`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default SecondaryNavigation;
