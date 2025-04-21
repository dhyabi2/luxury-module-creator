
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface TestResultDisplayProps {
  error?: string;
}

const TestResultDisplay: React.FC<TestResultDisplayProps> = ({ error }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!error) return null;
  
  // Format and highlight errors for better readability
  const formatError = (errorString: string) => {
    try {
      // Try to extract JSON from the error message
      const jsonMatch = errorString.match(/\{.*\}/s);
      if (jsonMatch) {
        const jsonPart = jsonMatch[0];
        try {
          const parsedJson = JSON.parse(jsonPart);
          return errorString.replace(jsonPart, JSON.stringify(parsedJson, null, 2));
        } catch {
          // If JSON parsing fails, return the original
          return errorString;
        }
      }
    } catch (e) {
      console.log('Error formatting test result:', e);
    }
    
    return errorString;
  };
  
  const formattedError = formatError(error);
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center text-red-500 gap-1.5 mb-1">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Test Failed</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-red-500 p-1 h-auto flex items-center justify-between w-full"
      >
        <span>{expanded ? 'Hide Error Details' : 'Show Error Details'}</span>
        {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </Button>
      
      {expanded && (
        <div className="bg-red-50 p-3 text-xs text-red-800 rounded mt-1 max-h-[400px] overflow-auto border border-red-200">
          <pre className="whitespace-pre-wrap font-mono">{formattedError}</pre>
        </div>
      )}
    </div>
  );
};

export default TestResultDisplay;
