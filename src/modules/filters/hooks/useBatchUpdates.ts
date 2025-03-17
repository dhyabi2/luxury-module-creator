
import { useRef, useCallback } from 'react';

/**
 * Hook for managing batch updates to prevent multiple renders
 * and filter applications while changing multiple states
 */
export const useBatchUpdates = () => {
  // Flag to track if we're in the middle of a batch update
  const isUpdating = useRef(false);

  // Start a batch update operation
  const startBatchUpdate = useCallback(() => {
    isUpdating.current = true;
  }, []);

  // End a batch update operation with optional callback
  const endBatchUpdate = useCallback((callback?: () => void) => {
    // Allow state to settle before applying changes
    setTimeout(() => {
      isUpdating.current = false;
      if (callback) callback();
    }, 0);
  }, []);

  return {
    isUpdating,
    startBatchUpdate,
    endBatchUpdate
  };
};
