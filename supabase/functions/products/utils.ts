
// CORS headers for all responses - open access with no restrictions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

// Helper for creating standard responses
export const createResponse = (data: any, status = 200) => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

// Process products to validate images etc.
export const processProducts = (products: any[]) => {
  console.log('[API:products] Processing product data');
  return products?.map(product => {
    // Validate image URL for each product
    if (!product.image || !product.image.startsWith('http')) {
      console.log(`[API:products] Product ID ${product.id} has invalid image URL, using fallback`);
      return {
        ...product,
        image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8'
      };
    }
    return product;
  }) || [];
};
