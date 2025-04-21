
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TestResultDisplayProps {
  error?: string;
}

const TestResultDisplay: React.FC<TestResultDisplayProps> = ({ error }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!error) return null;
  
  return (
    <div className="flex flex-col">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-red-500 p-1 h-auto"
      >
        {expanded ? 'Hide Error Details' : 'Show Error Details'}
        {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </Button>
      
      {expanded && (
        <div className="bg-red-50 p-2 text-xs text-red-800 rounded mt-1 max-h-[200px] overflow-auto">
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
};

export default TestResultDisplay;
