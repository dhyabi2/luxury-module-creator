
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/api';

interface ProductCurrencyConverterProps {
  product: Product;
  currency: string;
  onConversion: (convertedProduct: Product) => void;
}

const ProductCurrencyConverter: React.FC<ProductCurrencyConverterProps> = ({
  product,
  currency,
  onConversion
}) => {
  useEffect(() => {
    const convertCurrency = async () => {
      if (currency === 'OMR') {
        onConversion(product);
        return;
      }
      
      console.log(`Converting prices from OMR to ${currency}`);
      
      try {
        const response = await fetch('https://kkdldvrceqdcgclnvixt.supabase.co/functions/v1/convert-currency', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrZGxkdnJjZXFkY2djbG52aXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODY2MzAsImV4cCI6MjA1NjY2MjYzMH0.wOKSvpQhUEqYlxR9qK-1BWhicCU_CRiU7eA2-nKa4Fo'
          },
          body: JSON.stringify({
            product: product,
            targetCurrency: currency
          })
        });
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Converted product data:', data);
        onConversion(data.convertedProduct);
      } catch (err) {
        console.error('Error converting currency:', err);
        onConversion(product);
      }
    };
    
    convertCurrency();
  }, [currency, product, onConversion]);

  return null; // This is a logic-only component with no UI
};

export default ProductCurrencyConverter;
