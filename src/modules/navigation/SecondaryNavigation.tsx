
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SecondaryNavigation = () => {
  const [activeCategory, setActiveCategory] = useState('');
  
  const categories = [
    { id: 'sale', name: 'Sale', highlight: true },
    { id: 'new', name: 'New in' },
    { id: 'brands', name: 'Brands' },
    { id: 'watches', name: 'Watches' },
    { id: 'jewellery', name: 'Jewellery' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'bags', name: 'Bags' },
    { id: 'perfumes', name: 'Perfumes' },
    { id: 'store', name: 'Store Locator' }
  ];

  return (
    <nav className="overflow-x-auto w-full md:w-auto py-1">
      <ul className="flex space-x-2 md:space-x-4 min-w-max">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to="/"
              className={`category-item ${
                category.highlight ? 'bg-sale text-white px-4 rounded-sm' : ''
              } ${activeCategory === category.id ? 'font-medium' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SecondaryNavigation;
