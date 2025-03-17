
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SecondaryCategory {
  id: string;
  name: string;
  highlight?: boolean;
}

const SecondaryNavigation = () => {
  const [categories, setCategories] = useState<SecondaryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which category is active based on current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeCategory = pathSegments.length > 0 ? pathSegments[0] : '';
  
  const fetchNavigationData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching secondary navigation data');
      
      const response = await fetch('/api/navigation');
      const data = await response.json();
      
      console.log('Secondary navigation data received:', data);
      
      // Filter out any categories that are not part of the main content
      const indexPageCategories = data.secondaryCategories.filter((category: SecondaryCategory) => {
        return ['sale', 'new-in', 'brands', 'watches', 'jewellery', 
                'accessories', 'bags', 'perfumes', 'store-locator'].includes(category.id);
      });
      
      setCategories(indexPageCategories);
    } catch (error) {
      console.log('Error fetching secondary navigation data:', error);
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
      'store-locator': '/store-locator'
    };
    
    return routeMap[categoryId] || '/';
  };

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow normal navigation to occur as well
    console.log(`Navigation: Category ${categoryId} clicked`);
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
                onClick={(e) => handleCategoryClick(category.id, e)}
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
