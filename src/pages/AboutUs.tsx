
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">About Us</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              Labels Luxury was established in Muscat, Oman in 2015 with the vision of bringing premium luxury items to discerning customers in the region. What started as a small boutique has now grown into one of the leading luxury retailers in the Middle East.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              Our curated collections feature exceptional timepieces, fine jewelry, designer accessories, and exclusive fragrances from the world's most prestigious brands. Every item in our store is selected with care, ensuring authenticity, quality, and timeless elegance.
            </p>
            
            <div className="my-10">
              <h2 className="text-2xl font-serif mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700">
                To provide an unparalleled luxury shopping experience by offering exclusive products, exceptional customer service, and a deep understanding of luxury craftsmanship.
              </p>
            </div>
            
            <div className="my-10">
              <h2 className="text-2xl font-serif mb-4">Our Values</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700">
                <li><strong>Authenticity</strong> - We guarantee the authenticity of every item we sell.</li>
                <li><strong>Excellence</strong> - We strive for excellence in every aspect of our business.</li>
                <li><strong>Expertise</strong> - Our team consists of luxury experts with deep knowledge about our products.</li>
                <li><strong>Customer-Centricity</strong> - We place our customers at the heart of everything we do.</li>
              </ul>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              Visit our stores to experience the world of Labels Luxury firsthand. Our knowledgeable staff are committed to providing personalized service to help you find the perfect addition to your collection.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
