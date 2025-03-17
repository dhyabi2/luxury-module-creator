
export default async function productDetailHandler(req: Request) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');
  const productId = pathParts[pathParts.length - 1];

  console.log(`API: Fetching product detail for ID: ${productId}`);

  // High-quality product images based on ID
  const productImages = {
    // Men's Watches
    '1': "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop&auto=format",
    '2': "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop&auto=format",
    '3': "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&h=600&fit=crop&auto=format",
    '4': "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format",
    '5': "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop&auto=format",
    '6': "https://images.unsplash.com/photo-1457831449053-3aca29not?w=600&h=600&fit=crop&auto=format",
    '7': "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=600&h=600&fit=crop&auto=format",
    '8': "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600&h=600&fit=crop&auto=format",
    // Women's Watches
    '9': "https://images.unsplash.com/photo-1549972574-8e3e1ed6a347?w=600&h=600&fit=crop&auto=format",
    '10': "https://images.unsplash.com/photo-1590736969596-8624399e6edd?w=600&h=600&fit=crop&auto=format",
    '11': "https://images.unsplash.com/photo-1606293459339-019675048d26?w=600&h=600&fit=crop&auto=format",
    '12': "https://images.unsplash.com/photo-1551335571-4569fe5b3b25?w=600&h=600&fit=crop&auto=format",
    // Luxury Watches
    '13': "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&h=600&fit=crop&auto=format",
    '14': "https://images.unsplash.com/photo-1548171245-9d193cef056d?w=600&h=600&fit=crop&auto=format",
    '15': "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop&auto=format",
    '16': "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&h=600&fit=crop&auto=format",
    // Default fallback
    'default': "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop&auto=format"
  };

  // Generate a consistent name, brand, and description based on ID
  const watchTypes = {
    '1': { name: "Classic Chronograph", brand: "MNK", gender: "Men", caseSize: 42 },
    '2': { name: "Elegant Automatic", brand: "MNK", gender: "Men", caseSize: 40 },
    '3': { name: "Diver Professional", brand: "AIGNER", gender: "Men", caseSize: 44 },
    '4': { name: "Minimalist Ultra-Thin", brand: "Calvin Klein", gender: "Men", caseSize: 38 },
    '5': { name: "Pilot's Chronometer", brand: "Michael Kors", gender: "Men", caseSize: 46 },
    '6': { name: "Sport Titanium", brand: "AIGNER", gender: "Men", caseSize: 45 },
    '7': { name: "Vintage Heritage", brand: "Calvin Klein", gender: "Men", caseSize: 39 },
    '8': { name: "Executive Gold", brand: "Michael Kors", gender: "Men", caseSize: 41 },
    '9': { name: "Petite Diamond", brand: "MNK", gender: "Women", caseSize: 28 },
    '10': { name: "Rose Gold Classic", brand: "AIGNER", gender: "Women", caseSize: 32 },
    '11': { name: "Ceramic White", brand: "Calvin Klein", gender: "Women", caseSize: 30 },
    '12': { name: "Silver Bracelet", brand: "Michael Kors", gender: "Women", caseSize: 34 },
    '13': { name: "Tourbillon Limited", brand: "AIGNER", gender: "Unisex", caseSize: 41 },
    '14': { name: "Platinum Moonphase", brand: "MNK", gender: "Unisex", caseSize: 42 },
    '15': { name: "Perpetual Calendar", brand: "Calvin Klein", gender: "Men", caseSize: 43 },
    '16': { name: "Skeleton Automatic", brand: "Michael Kors", gender: "Men", caseSize: 45 },
    'default': { name: "Luxury Watch", brand: "MNK", gender: "Unisex", caseSize: 40 }
  };

  // Get watch type info, default if not found
  const watchInfo = watchTypes[productId as keyof typeof watchTypes] || watchTypes.default;

  // Calculate prices consistently based on ID
  const basePrice = 750 + (parseInt(productId) * 50);
  const originalPrice = basePrice + (basePrice * 0.2);

  // In a real application, this would fetch from a database
  // For now, we'll return some mock data based on the ID
  const mockProduct = {
    id: productId,
    name: watchInfo.name,
    brand: watchInfo.brand,
    category: "Watches",
    price: basePrice,
    originalPrice: originalPrice,
    onSale: true,
    isNew: parseInt(productId) > 12,
    imageUrl: productImages[productId as keyof typeof productImages] || productImages.default,
    gender: watchInfo.gender,
    caseSize: watchInfo.caseSize,
    description: `A premium ${watchInfo.name.toLowerCase()} timepiece by ${watchInfo.brand}, featuring exquisite craftsmanship and precision engineering. This ${watchInfo.caseSize}mm ${watchInfo.gender.toLowerCase()}'s watch exemplifies luxury and sophistication for both casual and formal occasions.`
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
