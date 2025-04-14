
import { supabase } from "@/integrations/supabase/client";
import { FiltersData, ProductType } from "./types";
import { defaultFilters } from "./defaultValues";
import { extractCategories, extractBrands, groupBrandsByCategory } from "./extractors/categoryBrands";
import { 
  extractBands, 
  extractCaseColors, 
  extractColors, 
  extractCaseSizeRange,
  extractGenders 
} from "./extractors/watchFilters";

/**
 * Generates filter data by analyzing product data from the database
 */
export async function generateFilters(): Promise<FiltersData> {
  console.log('[DB:filters:generator] Generating filters from products data');
  
  try {
    // Get all products to build filter data
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('[DB:filters:generator] Error fetching products for filter generation:', error);
      throw error;
    }
    
    // Type safety for products
    const typedProducts = products as unknown as ProductType[];
    
    // Extract and count unique categories
    const categories = extractCategories(typedProducts);
    
    // Extract and count unique brands
    const brands = extractBrands(typedProducts);
    
    // Group brands by category for category-specific brand filtering
    const categoryBrands = groupBrandsByCategory(typedProducts, brands);

    // Get watch products to extract watch-specific filters
    const watches = typedProducts.filter(product => 
      product.category.toLowerCase() === 'watches'
    );
    
    // Extract watch-specific filters
    const bands = extractBands(watches);
    const caseColors = extractCaseColors(watches);
    const colors = extractColors(watches);
    
    // Extract genders from all products, not just watches
    const genders = [
      { id: 'men', name: 'Men' },
      { id: 'women', name: 'Women' },
      { id: 'unisex', name: 'Unisex' }
    ];
    
    // Find min and max prices
    const prices = typedProducts.map(product => product.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    
    // Find min and max case sizes
    const { minCaseSize, maxCaseSize } = extractCaseSizeRange(watches);
    
    // Construct the complete filters object
    const filtersData: FiltersData = {
      priceRange: {
        min: minPrice,
        max: maxPrice,
        unit: 'OMR'
      },
      categories,
      brands,
      categoryBrands,
      bands,
      caseColors,
      colors,
      genders,
      caseSizeRange: {
        min: minCaseSize,
        max: maxCaseSize,
        unit: 'mm'
      }
    };
    
    console.log('[DB:filters:generator] Generated filters data:', {
      categoriesCount: categories.length,
      brandsCount: brands.length,
      categoryBrandsCount: Object.keys(categoryBrands).length,
      categoryBrandsDetails: Object.keys(categoryBrands).map(key => 
        `${key}: ${categoryBrands[key].length} brands`
      ),
      bandsCount: bands.length,
      caseColorsCount: caseColors.length,
      colorsCount: colors.length,
      gendersCount: genders.length,
      priceRange: `${minPrice}-${maxPrice}`,
      caseSizeRange: `${minCaseSize}-${maxCaseSize}`
    });
    
    return filtersData;
  } catch (error) {
    console.error('[DB:filters:generator] Error generating filters:', error);
    
    // Return minimal default filters as fallback
    return defaultFilters;
  }
}
