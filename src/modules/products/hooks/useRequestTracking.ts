
import { useRef, useCallback } from 'react';

export const useRequestTracking = () => {
  const pendingRequest = useRef<AbortController | null>(null);

  const abortPendingRequest = useCallback(() => {
    if (pendingRequest.current) {
      pendingRequest.current.abort();
      pendingRequest.current = null;
    }
  }, []);

  const createNewRequest = useCallback(() => {
    abortPendingRequest();
    pendingRequest.current = new AbortController();
    return pendingRequest.current;
  }, [abortPendingRequest]);

  return {
    pendingRequest,
    abortPendingRequest,
    createNewRequest
  };
};
