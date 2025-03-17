
import { useCallback, useRef, useEffect } from 'react';

// Default cache time-to-live in milliseconds
const DEFAULT_CACHE_TTL = 5000; // 5 seconds cache TTL

interface CacheEntry {
  timestamp: number;
  data: any;
}

interface UseProductCacheProps {
  cacheTTL?: number;
  maxCacheSize?: number;
}

/**
 * Hook for caching product API responses to reduce redundant network requests
 * 
 * @param cacheTTL - Optional cache time-to-live in ms (default: 5000)
 * @param maxCacheSize - Optional maximum number of entries to cache (default: 10)
 */
export const useProductCache = ({
  cacheTTL = DEFAULT_CACHE_TTL,
  maxCacheSize = 10
}: UseProductCacheProps = {}) => {
  const responseCache = useRef<Map<string, CacheEntry>>(new Map());
  
  // Get a cached response if it exists and is not expired
  const getCachedResponse = useCallback((cacheKey: string) => {
    if (!cacheKey) {
      console.warn('[useProductCache] Invalid cache key provided');
      return null;
    }
    
    const cachedData = responseCache.current.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < cacheTTL) {
      console.log('[useProductCache] Using cached response for:', cacheKey);
      return cachedData.data;
    }
    
    // If data exists but is expired, remove it from cache
    if (cachedData) {
      console.log('[useProductCache] Cache expired for:', cacheKey);
      responseCache.current.delete(cacheKey);
    }
    
    return null;
  }, [cacheTTL]);
  
  // Add or update an entry in the cache
  const cacheResponse = useCallback((cacheKey: string, data: any) => {
    if (!cacheKey) {
      console.warn('[useProductCache] Invalid cache key provided');
      return;
    }
    
    // If cache would exceed max size, remove oldest entry
    if (responseCache.current.size >= maxCacheSize && !responseCache.current.has(cacheKey)) {
      const oldestKey = responseCache.current.keys().next().value;
      console.log('[useProductCache] Cache limit reached, removing oldest entry:', oldestKey);
      responseCache.current.delete(oldestKey);
    }
    
    // Add new entry
    responseCache.current.set(cacheKey, {
      timestamp: Date.now(),
      data
    });
    
    console.log('[useProductCache] Cached response for:', cacheKey);
  }, [maxCacheSize]);
  
  // Clear expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleanedEntries = 0;
      
      responseCache.current.forEach((entry, key) => {
        if (now - entry.timestamp > cacheTTL) {
          responseCache.current.delete(key);
          cleanedEntries++;
        }
      });
      
      if (cleanedEntries > 0) {
        console.log(`[useProductCache] Cleaned up ${cleanedEntries} expired cache entries`);
      }
    }, cacheTTL * 2);
    
    return () => clearInterval(cleanupInterval);
  }, [cacheTTL]);
  
  // Manually clear all cache entries
  const clearCache = useCallback(() => {
    console.log('[useProductCache] Clearing entire cache');
    responseCache.current.clear();
  }, []);

  return { 
    getCachedResponse, 
    cacheResponse,
    clearCache,
    // For debugging/testing
    cacheSize: responseCache.current.size
  };
};
