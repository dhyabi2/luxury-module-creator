import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SecondaryCategory {
  id: string;
  name: string;
  highlight?: boolean;
}

const SecondaryNavigation = () => {
  const [categories, setCategories] = useState<SecondaryCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchNavigationData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching secondary navigation data');
      
      const response = await fetch('/api/navigation');
      const data = await response.json();
      
      console.log('Secondary navigation data received:', data);
      
      setCategories(data.secondaryCategories);
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
                } ${activeCategory === category.id ? 'font-medium' : ''}`}
                onClick={() => setActiveCategory(category.id)}
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
