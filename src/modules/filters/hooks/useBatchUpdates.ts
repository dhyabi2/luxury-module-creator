
import { useRef, useCallback } from 'react';

/**
 * Hook for managing batch updates to prevent multiple renders
 * and filter applications while changing multiple states
 * 
 * @returns Object containing isUpdating ref and batch control functions
 */
export const useBatchUpdates = () => {
  // Flag to track if we're in the middle of a batch update
  const isUpdating = useRef(false);
  
  // Queue to track pending callbacks
  const pendingCallbacks = useRef<(() => void)[]>([]);

  // Start a batch update operation
  const startBatchUpdate = useCallback(() => {
    console.log('[useBatchUpdates] Starting batch update');
    isUpdating.current = true;
  }, []);

  // End a batch update operation with optional callback
  const endBatchUpdate = useCallback((callback?: () => void) => {
    // Allow state to settle before applying changes
    console.log('[useBatchUpdates] Ending batch update');
    
    if (callback) {
      pendingCallbacks.current.push(callback);
    }
    
    // Use setTimeout to ensure all state updates have been processed
    setTimeout(() => {
      isUpdating.current = false;
      
      // Execute all pending callbacks
      if (pendingCallbacks.current.length > 0) {
        console.log(`[useBatchUpdates] Executing ${pendingCallbacks.current.length} pending callbacks`);
        pendingCallbacks.current.forEach(cb => cb());
        pendingCallbacks.current = [];
      }
    }, 0);
  }, []);

  return {
    isUpdating,
    startBatchUpdate,
    endBatchUpdate,
    // Expose pending callbacks for testing/debugging
    pendingCallbacks
  };
};
