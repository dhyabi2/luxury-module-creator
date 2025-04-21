
import React, { useState } from 'react';
import MainLayout from '@/modules/layout/MainLayout';
import { Button } from '@/components/ui/button';
import FilterTests from '@/modules/tester/components/FilterTests';

const Tester: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Test Suite</h1>
        
        <div className="grid gap-6">
          {/* Section 1: Filter Tests */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => toggleSection('filters')}
            >
              <h2 className="text-xl font-semibold">Filter Tests</h2>
              <Button variant="outline">
                {activeSection === 'filters' ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {activeSection === 'filters' && (
              <div className="mt-4">
                <FilterTests />
              </div>
            )}
          </div>
          
          {/* Add more test sections here in the future */}
          {/* Section placeholders for future implementation */}
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index + 2} className="border rounded-lg p-6 bg-white shadow-sm opacity-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Test Section {index + 2}</h2>
                <Button variant="outline" disabled>Coming Soon</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tester;
