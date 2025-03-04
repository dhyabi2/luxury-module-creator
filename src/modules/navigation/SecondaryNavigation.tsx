
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
  
  // Fetch navigation data directly from the API
  const fetchNavigationData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching secondary navigation data');
      
      // Direct API call without hooks or middleware
      const response = await fetch('/api/navigation');
      const data = await response.json();
      
      console.log('Secondary navigation data received:', data);
      
      // Update state with fetched data
      setCategories(data.secondaryCategories);
    } catch (error) {
      // No error handling as per requirements - errors will throw themselves
      console.log('Error fetching secondary navigation data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch navigation data when component mounts
  useEffect(() => {
    fetchNavigationData();
  }, []);

  return (
    <nav className="w-full py-2">
      {isLoading ? (
        // Loading skeleton
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
                to="/"
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
