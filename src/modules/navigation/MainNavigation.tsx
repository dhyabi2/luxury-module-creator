
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface MainCategory {
  id: string;
  name: string;
  active: boolean;
}

const MainNavigation = () => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('women');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch navigation data directly from the API
  useEffect(() => {
    const getNavigationData = async () => {
      setIsLoading(true);
      
      try {
        console.log('Fetching navigation data');
        
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
        
        console.log('Navigation data received:', data);
        
        // Update state with fetched data
        setCategories(data.mainCategories || []);
        
        // Set active category based on data
        const activeFromData = data.mainCategories.find((cat: MainCategory) => cat.active);
        if (activeFromData) {
          setActiveCategory(activeFromData.id);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        // If there's an error, use a default set of categories
        setCategories([
          { id: 'women', name: 'WOMEN', active: true },
          { id: 'men', name: 'MEN', active: false },
          { id: 'new-in', name: 'NEW IN', active: false },
          { id: 'sale', name: 'SALE', active: false }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getNavigationData();
  }, []);

  return (
    <nav className="bg-brand text-white border-t border-brand-light">
      <div className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          // Loading skeleton
          <div className="flex justify-center py-3 space-x-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse h-6 w-20 bg-white/20 rounded"></div>
            ))}
          </div>
        ) : (
          <ul className="flex justify-center space-x-12">
            {categories.map((category) => {
              // Map category IDs to appropriate routes
              let routePath = '/';
              if (category.id === 'women' || category.id === 'men') {
                routePath = `/${category.id}`;
              } else if (category.id === 'new-in') {
                routePath = '/new-in';
              } else if (category.id === 'sale') {
                routePath = '/sale';
              }
              
              return (
                <li key={category.id}>
                  <Link 
                    to={routePath}
                    className={`nav-item py-3 px-6 font-display tracking-widest text-sm inline-block ${activeCategory === category.id ? 'nav-item-active bg-brand-dark' : 'hover:bg-brand-dark'}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
