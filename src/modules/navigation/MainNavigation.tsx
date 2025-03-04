
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MainCategory {
  id: string;
  name: string;
  active: boolean;
}

const MainNavigation = () => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('women');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch navigation data directly from the API
  const fetchNavigationData = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching navigation data');
      
      // Direct API call without hooks or middleware
      const response = await fetch('/api/navigation');
      const data = await response.json();
      
      console.log('Navigation data received:', data);
      
      // Update state with fetched data
      setCategories(data.mainCategories);
      
      // Set active category based on data
      const activeFromData = data.mainCategories.find((cat: MainCategory) => cat.active);
      if (activeFromData) {
        setActiveCategory(activeFromData.id);
      }
    } catch (error) {
      // No error handling as per requirements - errors will throw themselves
      console.log('Error fetching navigation data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch navigation data when component mounts
  useEffect(() => {
    fetchNavigationData();
  }, []);

  return (
    <nav className="bg-brand text-white border-t border-brand-light">
      <div className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          // Loading skeleton
          <div className="flex justify-center py-3 space-x-12">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse h-6 w-20 bg-white/20 rounded"></div>
            ))}
          </div>
        ) : (
          <ul className="flex justify-center space-x-12">
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  to="/"
                  className={`nav-item py-3 px-6 font-display tracking-widest text-sm ${activeCategory === category.id ? 'nav-item-active bg-sale' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
