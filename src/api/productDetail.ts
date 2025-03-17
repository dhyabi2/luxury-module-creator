
import { NextRequest } from 'next/server';

export default async function productDetailHandler(req: NextRequest) {
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
    imageUrl: "https://via.placeholder.com/400x400?text=Product+Image",
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
        'Content-Type': 'application/json'
      }
    }
  );
}
