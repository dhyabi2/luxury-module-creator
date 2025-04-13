
import React from 'react';
import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as Currency);
  };

  return (
    <div className="flex items-center">
      <Select value={currency} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-[70px] h-8 text-xs">
          <SelectValue placeholder={currency} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OMR">OMR</SelectItem>
          <SelectItem value="$">$</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
