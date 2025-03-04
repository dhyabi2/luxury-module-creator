
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import API handlers
import ProductsAPI from "./api/products";
import FiltersAPI from "./api/filters";
import NavigationAPI from "./api/navigation";

// Import and initialize database
import { getDb } from "./lib/db";

const queryClient = new QueryClient();

// Initialize the database
getDb();

// Mock fetch for development environment
if (typeof window !== 'undefined') {
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

const App = () => (
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

export default App;
