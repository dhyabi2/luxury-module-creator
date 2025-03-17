
import { useCallback, useRef } from 'react';

const CACHE_TTL = 5000; // 5 seconds cache TTL

export const useProductCache = () => {
  const responseCache = useRef<Map<string, { timestamp: number, data: any }>>(new Map());
  
  const getCachedResponse = useCallback((cacheKey: string) => {
    const cachedData = responseCache.current.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      console.log('[ProductGrid] Using cached response for:', cacheKey);
      return cachedData.data;
    }
    return null;
  }, []);
  
  const cacheResponse = useCallback((cacheKey: string, data: any) => {
    responseCache.current.set(cacheKey, {
      timestamp: Date.now(),
      data
    });
  }, []);

  return { getCachedResponse, cacheResponse };
};
