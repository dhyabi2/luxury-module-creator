
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  // Animation effect when input gets focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full md:w-64 lg:w-72 my-2">
      <div 
        className={`flex items-center bg-white bg-opacity-90 rounded-sm overflow-hidden transition-all duration-300 ${
          isFocused ? 'ring-1 ring-white ring-opacity-50' : ''
        }`}
        ref={inputRef}
      >
        <input
          type="text"
          placeholder="What are you looking for?"
          className="flex-grow py-2 px-3 text-gray-800 text-sm focus:outline-none"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          className={`px-3 py-2 transition-colors duration-200 ${
            isFocused ? 'text-black' : 'text-gray-500'
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
      
      {/* Animated search suggestions panel (visible only when input is focused and has content) */}
      {isFocused && searchQuery.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-soft rounded-sm border border-gray-100 p-2 z-50 animate-fade-in">
          <div className="text-xs text-gray-500 px-2 py-1">Popular Searches</div>
          <div className="space-y-1 mt-1">
            {['Aigner Watches', 'Gold Watches', 'Luxury Perfumes'].map((item, index) => (
              <div 
                key={index} 
                className="px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer rounded-sm text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
