
export default async function productDetailHandler(req: Request) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  console.log(`API: Fetching product detail for ID: ${productId}`);

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
    imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format",
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
