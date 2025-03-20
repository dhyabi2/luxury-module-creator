
// CORS headers for all responses - absolutely unrestricted access
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
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
    if (!product.image || 
        !product.image.startsWith('http') || 
        product.image.includes('via.placeholder.com') || 
        product.image.includes('placeholder.com')) {
      console.log(`[API:products] Product ID ${product.id} has invalid image URL, using fallback`);
      return {
        ...product,
        // Use a more reliable fallback image
        image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8'
      };
    }
    return product;
  }) || [];
};
