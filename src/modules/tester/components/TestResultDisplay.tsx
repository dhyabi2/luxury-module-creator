
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface TestResultDisplayProps {
  error: string;
}

const TestResultDisplay: React.FC<TestResultDisplayProps> = ({ error }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="flex flex-col">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide Error' : 'Show Error'}
      </Button>
      
      {expanded && (
        <div className="mt-2 bg-red-50 border border-red-200 rounded p-3 max-w-2xl whitespace-pre-wrap text-xs font-mono">
          {error}
        </div>
      )}
    </div>
  );
};

export default TestResultDisplay;
