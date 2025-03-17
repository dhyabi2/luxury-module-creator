
import { useRef } from 'react';

export const useRequestTracking = () => {
  const pendingRequest = useRef<AbortController | null>(null);

  const abortPendingRequest = () => {
    if (pendingRequest.current) {
      pendingRequest.current.abort();
      pendingRequest.current = null;
    }
  };

  const createNewRequest = () => {
    abortPendingRequest();
    pendingRequest.current = new AbortController();
    return pendingRequest.current;
  };

  return {
    pendingRequest,
    abortPendingRequest,
    createNewRequest
  };
};
