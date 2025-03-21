
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SecondaryCategory {
  id: string;
  name: string;
  highlight?: boolean;
}

const SecondaryNavigation = () => {
  // Static categories data
  const [categories] = useState<SecondaryCategory[]>([
    { id: 'new-in', name: 'NEW IN' },
    { id: 'sale', name: 'SALE' },
    { id: 'brands', name: 'BRANDS' },
    { id: 'watches', name: 'WATCHES' },
    { id: 'jewellery', name: 'JEWELLERY' },
    { id: 'accessories', name: 'ACCESSORIES' },
    { id: 'bags', name: 'BAGS' },
    { id: 'perfumes', name: 'PERFUMES' },
    { id: 'stores', name: 'STORE LOCATOR', highlight: true }
  ]);
  
  const [isLoading] = useState(false);
  const location = useLocation();
  
  // Determine which category is active based on current path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeCategory = pathSegments.length > 0 ? pathSegments[0] : '';

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
        <ul className="flex space-x-5 md:space-x-8 min-w-max overflow-x-auto pb-2 scrollbar-hide">
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
