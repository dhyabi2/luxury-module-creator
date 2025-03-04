
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import API handlers for local development fallback
import ProductsAPI from "./api/products";
import FiltersAPI from "./api/filters";
import NavigationAPI from "./api/navigation";

// Import database initialization
import { getDb } from "./lib/db";

const queryClient = new QueryClient();

// Mock fetch for development environment when not using Supabase
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_SUPABASE) {
  const originalFetch = window.fetch;
  
  window.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : input.toString();
    
    // Check if the request is for one of our API endpoints
    if (url.includes('/api/products')) {
      console.log('Intercepting products API request');
      return await ProductsAPI(new Request(url, init));
    }
    
    if (url.includes('/api/filters')) {
      console.log('Intercepting filters API request');
      return await FiltersAPI(new Request(url, init));
    }
    
    if (url.includes('/api/navigation')) {
      console.log('Intercepting navigation API request');
      return await NavigationAPI(new Request(url, init));
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };
}

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize database connection on app load
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await getDb();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing database'));
      }
    };

    initDatabase();
  }, []);

  // Show loading state while initializing
  if (!isInitialized && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Connecting to database...</p>
        </div>
      </div>
    );
  }

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-6 max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-bold mb-2">Database Connection Error</h2>
            <p>{error.message}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
