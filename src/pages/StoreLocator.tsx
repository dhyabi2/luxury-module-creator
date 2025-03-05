
import React, { useState } from 'react';
import MainLayout from '../modules/layout/MainLayout';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
}

const StoreLocator = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  
  // Dummy store data
  const stores: Store[] = [
    {
      id: '1',
      name: 'Luxury Boutique - Downtown',
      address: '123 Main Street',
      city: 'New York',
      phone: '+1 (212) 555-1234',
      hours: 'Mon-Sat: 10am-7pm, Sun: 12pm-5pm'
    },
    {
      id: '2',
      name: 'Luxury Boutique - Uptown',
      address: '456 Park Avenue',
      city: 'New York',
      phone: '+1 (212) 555-5678',
      hours: 'Mon-Sat: 10am-8pm, Sun: 12pm-6pm'
    },
    {
      id: '3',
      name: 'Luxury Boutique - Beverly Hills',
      address: '789 Rodeo Drive',
      city: 'Los Angeles',
      phone: '+1 (310) 555-9012',
      hours: 'Mon-Sat: 10am-8pm, Sun: 11am-6pm'
    },
    {
      id: '4',
      name: 'Luxury Boutique - Michigan Ave',
      address: '321 Michigan Avenue',
      city: 'Chicago',
      phone: '+1 (312) 555-3456',
      hours: 'Mon-Sat: 10am-7pm, Sun: Closed'
    }
  ];
  
  // Get unique cities for the filter
  const cities = Array.from(new Set(stores.map(store => store.city)));
  
  // Filter stores by selected city
  const filteredStores = selectedCity === 'all' 
    ? stores 
    : stores.filter(store => store.city === selectedCity);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-gray-600 mb-6 tracking-wider">
          <span className="hover:text-black cursor-pointer transition-colors">HOME</span> / <span className="font-medium text-gray-900">STORE LOCATOR</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6 sm:mb-10">Find a Store</h1>
        
        {/* City Filter */}
        <div className="mb-8">
          <label htmlFor="city-filter" className="block mb-2 text-sm font-medium">
            Filter by City:
          </label>
          <select 
            id="city-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        {/* Store List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map(store => (
            <div key={store.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-medium mb-3">{store.name}</h2>
              <div className="space-y-2 text-gray-700">
                <p>{store.address}</p>
                <p>{store.city}</p>
                <p className="font-medium">{store.phone}</p>
                <p className="text-sm">{store.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default StoreLocator;
