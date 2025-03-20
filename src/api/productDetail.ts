
import { productsDb } from '../lib/db';

export default async function productDetailHandler(req: Request) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  console.log(`API: Fetching product detail for ID: ${productId}`);

  // Fetch product directly from database - let errors propagate naturally
  const product = await productsDb.getById(productId);

  return new Response(
    JSON.stringify({
      product
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
