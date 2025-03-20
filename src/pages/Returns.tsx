
import React from 'react';
import MainLayout from '../modules/layout/MainLayout';

const Returns = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif mb-8">Returns & Exchanges</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              At Labels Luxury, we want you to be completely satisfied with your purchase. If you're not entirely happy with your order, we're here to help.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Return Policy</h2>
            <p className="text-gray-700 mb-6">
              You may return most new, unopened items within 14 days of delivery for a full refund. We also accept returns of opened items within 7 days of delivery if the item is defective or damaged.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Return Process</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>Contact our customer service team at returns@labelsluxury.com or call +968 9291120 to request a return.</li>
              <li>Our team will provide you with a return authorization number and return instructions.</li>
              <li>Pack the item securely in its original packaging, including all accessories, manuals, and warranty cards.</li>
              <li>Attach the return label provided by our customer service team.</li>
              <li>Ship the package to the address provided in the return instructions.</li>
            </ol>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Refund Process</h2>
            <p className="text-gray-700 mb-6">
              Once we receive your returned item, we will inspect it and notify you of the status of your refund. If approved, your refund will be processed and a credit will automatically be applied to your original method of payment within 7-10 business days.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Exchange Policy</h2>
            <p className="text-gray-700 mb-6">
              If you would like to exchange an item for a different size or color, please follow the same process as for returns. In your communication with our customer service team, please specify that you would like an exchange and provide details of the item you would like instead.
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Non-Returnable Items</h2>
            <p className="text-gray-700 mb-6">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Items that have been used, worn, or altered</li>
              <li>Items marked as "Final Sale" or "Non-Returnable"</li>
              <li>Gift cards</li>
              <li>Personalized or custom-made items</li>
              <li>Fragrances and cosmetics that have been opened or unsealed</li>
            </ul>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Shipping Costs</h2>
            <p className="text-gray-700 mb-6">
              The customer is responsible for the cost of return shipping unless the return is due to our error (you received an incorrect or defective item).
            </p>
            
            <h2 className="text-2xl font-serif mb-4 mt-8">Need Help?</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about our return policy or need assistance with a return, please contact our customer service team:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>Email: returns@labelsluxury.com</li>
              <li>Phone: +968 9291120</li>
              <li>Visit: Any of our store locations</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Returns;
