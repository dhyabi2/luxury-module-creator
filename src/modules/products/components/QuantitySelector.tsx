
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onIncrement, 
  onDecrement 
}) => {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-2">Quantity</p>
      <div className="flex items-center border border-gray-200 rounded-sm inline-block">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-none"
          onClick={onDecrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-4 text-sm font-medium">{quantity}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 rounded-none"
          onClick={onIncrement}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
