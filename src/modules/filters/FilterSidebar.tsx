
import React from 'react';
import FilterCategory from './FilterCategory';

const FilterSidebar = () => {
  // Sample filter categories and options
  const priceRange = { min: 16, max: 1225, unit: 'OMR' };
  
  const categoryOptions = [
    { id: 'accessories', name: 'Accessories', count: 24 },
    { id: 'bags', name: 'Bags', count: 18 },
    { id: 'perfumes', name: 'Perfumes', count: 32 }
  ];
  
  const brandOptions = [
    { id: 'aigner', name: 'AIGNER', count: 85 },
    { id: 'cartier', name: 'Cartier', count: 32 },
    { id: 'rolex', name: 'Rolex', count: 28 },
    { id: 'gucci', name: 'Gucci', count: 45 },
    { id: 'chopard', name: 'Chopard', count: 19 },
    { id: 'omega', name: 'Omega', count: 37 },
    { id: 'louis-vuitton', name: 'Louis Vuitton', count: 23 }
  ];
  
  const bandOptions = [
    { id: 'bracelet', name: 'Bracelet', count: 48 },
    { id: 'leather', name: 'Leather', count: 36 },
    { id: 'leather-strap', name: 'Leather Strap', count: 27 }
  ];
  
  const caseColorOptions = [
    { id: 'gold', name: 'Gold', count: 29 },
    { id: 'gold-silver', name: 'Gold/Silver', count: 17 },
    { id: 'rose-gold', name: 'Rose Gold', count: 23 },
    { id: 'rose-gold-silver', name: 'Rose Gold/Silver', count: 12 },
    { id: 'silver', name: 'Silver', count: 34 },
    { id: 'silver-gold', name: 'Silver/Gold', count: 14 }
  ];
  
  const colorOptions = [
    { id: 'baby-beige', name: 'Baby Beige', count: 8 },
    { id: 'baby-pink', name: 'Baby Pink', count: 7 },
    { id: 'antique-white', name: 'Antique White', count: 5 },
    { id: 'bellflower-blue', name: 'Bellflower Blue', count: 9 },
    { id: 'bison-brown', name: 'Bison Brown', count: 12 },
    { id: 'black', name: 'Black', count: 45 },
    { id: 'black-colored', name: 'BLACK COLOURED', count: 13 },
    { id: 'blue', name: 'Blue', count: 18 },
    { id: 'burgundy', name: 'Burgundy', count: 6 },
    { id: 'green', name: 'Green', count: 14 },
    { id: 'navy', name: 'Navy', count: 11 },
    { id: 'red', name: 'Red', count: 16 }
  ];
  
  const caseSizeRange = { min: 20, max: 45, unit: 'mm' };

  return (
    <div className="bg-white p-4 rounded-md shadow-soft">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-900">Filters</h2>
        <button className="text-sm text-brand hover:underline">
          Clear Filters
        </button>
      </div>
      
      <FilterCategory
        title="Price Range"
        options={[]}
        type="range"
        rangeMin={priceRange.min}
        rangeMax={priceRange.max}
        rangeUnit={priceRange.unit}
      />
      
      <FilterCategory
        title="Shop by Category"
        options={categoryOptions}
        type="checkbox"
      />
      
      <FilterCategory
        title="Brands"
        options={brandOptions}
        type="checkbox"
        selectedOptions={['aigner']}
      />
      
      <FilterCategory
        title="Band"
        options={bandOptions}
        type="checkbox"
      />
      
      <FilterCategory
        title="Case Colour"
        options={caseColorOptions}
        type="checkbox"
      />
      
      <FilterCategory
        title="Colour"
        options={colorOptions}
        type="checkbox"
      />
      
      <FilterCategory
        title="Case Size"
        options={[]}
        type="range"
        rangeMin={caseSizeRange.min}
        rangeMax={caseSizeRange.max}
        rangeUnit={caseSizeRange.unit}
      />
    </div>
  );
};

export default FilterSidebar;
