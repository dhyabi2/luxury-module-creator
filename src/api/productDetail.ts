
export default async function productDetailHandler(req: Request) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  console.log(`API: Fetching product detail for ID: ${productId}`);

  // High-quality product images based on ID
  const productImages = {
    // Watches
    '1': "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop&auto=format",
    '2': "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop&auto=format",
    '3': "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop&auto=format",
    '4': "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format",
    '5': "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop&auto=format",
    // Default fallback
    'default': "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format"
  };

  // In a real application, this would fetch from a database
  // For now, we'll return some mock data based on the ID
  const mockProduct = {
    id: productId,
    name: `Luxury Watch ${productId}`,
    brand: "MNK",
    category: "Watches",
    price: 899.99,
    originalPrice: 1100.00,
    onSale: true,
    isNew: false,
    imageUrl: productImages[productId as keyof typeof productImages] || productImages.default,
    gender: "Unisex",
    caseSize: 40,
    description: "A premium timepiece featuring exquisite craftsmanship and precision engineering. Perfect for both casual and formal occasions."
  };

  return new Response(
    JSON.stringify({
      product: mockProduct
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60' // Add cache control to reduce API calls
      }
    }
  );
}
