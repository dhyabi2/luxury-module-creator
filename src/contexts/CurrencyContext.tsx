
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Currency = 'OMR' | '$';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'OMR',
  setCurrency: () => {},
});

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to OMR, but try to load from localStorage if available
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferredCurrency');
    return (saved === 'OMR' || saved === '$') ? saved as Currency : 'OMR';
  });

  // Save currency preference to localStorage
  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency);
    console.log('Currency preference saved:', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
