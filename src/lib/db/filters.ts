import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { FilterOption, FiltersResponse, CategoryBrands } from "@/types/api";

// Define interfaces for type safety
interface SpecificationsType {
  strapMaterial?: string;
  caseMaterial?: string;
  dialColor?: string;
  strapColor?: string;
  caseSize?: string;
  [key: string]: string | undefined;
}

interface ProductType {
  category: string;
  brand: string;
  price: number;
  specifications?: SpecificationsType;
}

interface FiltersData {
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  categories: FilterOption[];
  brands: FilterOption[];
  categoryBrands: CategoryBrands;
  bands: FilterOption[];
  caseColors: FilterOption[];
  colors: FilterOption[];
  caseSizeRange: {
    min: number;
    max: number;
    unit: string;
  };
}

// Database operations for filters
export const filtersDb = {
  getAll: async (): Promise<FiltersData> => {
    console.log('[DB:filters] Getting all filters');
    
    try {
      // Fetch the filters data from Supabase
      const { data, error } = await supabase
        .from('filters')
        .select('data')
        .single();
      
      if (error) {
        console.error('[DB:filters] Error fetching filters:', error);
        
        // If filters don't exist yet in the database, generate and return default data
        console.log('[DB:filters] Generating default filters');
        
        // Build filter data by querying products table
        const filtersData = await filtersDb.generateFilters();
        
        return filtersData;
      }
      
      console.log('[DB:filters] Filters data retrieved successfully');
      
      // Parse the data with proper type handling
      let parsedData: FiltersData;
      
      if (typeof data.data === 'string') {
        // If it's a string, parse it and validate structure
        try {
          const parsed = JSON.parse(data.data);
          // Validate that parsed data has the necessary structure before casting
          if (parsed && 
              typeof parsed === 'object' && 
              parsed.priceRange && 
              Array.isArray(parsed.categories) && 
              Array.isArray(parsed.brands) && 
              parsed.categoryBrands) {
            parsedData = parsed as FiltersData;
          } else {
            throw new Error('Invalid data structure in parsed JSON');
          }
        } catch (parseError) {
          console.error('[DB:filters] Error parsing filters data:', parseError);
          return filtersDb.generateFilters();
        }
      } else if (data.data && typeof data.data === 'object') {
        // If it's already an object, validate its structure
        const jsonData = data.data as Record<string, unknown>;
        if (jsonData.priceRange && 
            Array.isArray(jsonData.categories) && 
            Array.isArray(jsonData.brands) && 
            jsonData.categoryBrands) {
          parsedData = jsonData as unknown as FiltersData;
        } else {
          console.error('[DB:filters] Invalid data structure in database');
          return filtersDb.generateFilters();
        }
      } else {
        console.error('[DB:filters] Unexpected data format');
        return filtersDb.generateFilters();
      }
        
      return parsedData;
    } catch (error) {
      console.error('[DB:filters] Unexpected error in filtersDb.getAll:', error);
      
      // Return default filters as fallback
      return filtersDb.generateFilters();
    }
  },
  
  generateFilters: async (): Promise<FiltersData> => {
    console.log('[DB:filters] Generating filters from products data');
    
    try {
      // Get all products to build filter data
      const { data: products, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('[DB:filters] Error fetching products for filter generation:', error);
        throw error;
      }
      
      // Type safety for products
      const typedProducts = products as unknown as ProductType[];
      
      // Extract and count unique categories
      const categories = typedProducts.reduce((acc, product) => {
        // Skip if category is already in the accumulator
        if (acc.some(cat => cat.id === product.category.toLowerCase())) {
          return acc;
        }
        
        // Count products in this category
        const count = typedProducts.filter(p => 
          p.category.toLowerCase() === product.category.toLowerCase()
        ).length;
        
        // Add category with count
        acc.push({
          id: product.category.toLowerCase(),
          name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
          count
        });
        
        return acc;
      }, [] as FilterOption[]);
      
      // Extract and count unique brands
      const brands = typedProducts.reduce((acc, product) => {
        // Skip if brand is already in the accumulator
        if (acc.some(brand => brand.id === product.brand)) {
          return acc;
        }
        
        // Count products with this brand
        const count = typedProducts.filter(p => p.brand === product.brand).length;
        
        // Add brand with count
        acc.push({
          id: product.brand,
          name: product.brand.charAt(0).toUpperCase() + product.brand.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          count
        });
        
        return acc;
      }, [] as FilterOption[]);
      
      // Group brands by category for category-specific brand filtering
      const categoryBrands = typedProducts.reduce((acc, product) => {
        const category = product.category.toLowerCase();
        const brand = {
          id: product.brand,
          name: product.brand.charAt(0).toUpperCase() + product.brand.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          count: typedProducts.filter(p => p.brand === product.brand && p.category.toLowerCase() === category).length
        };
        
        // Initialize category array if it doesn't exist
        if (!acc[category]) {
          acc[category] = [];
        }
        
        // Add brand to category if not already present
        if (!acc[category].some(b => b.id === brand.id)) {
          acc[category].push(brand);
        }
        
        return acc;
      }, {} as CategoryBrands);

      // Ensure each category has at least one brand
      categories.forEach(category => {
        const categoryId = category.id.toLowerCase();
        if (!categoryBrands[categoryId] || categoryBrands[categoryId].length === 0) {
          console.log(`[DB:filters] Adding default brands to category: ${categoryId}`);
          // Add some default brands if none exist for this category
          categoryBrands[categoryId] = brands.slice(0, 3).map(brand => ({
            ...brand,
            count: 1
          }));
        }
      });
      
      // Ensure all our categories have valid entries in categoryBrands
      const requiredCategories = ['watches', 'accessories', 'bags', 'perfumes'];
      requiredCategories.forEach(category => {
        if (!categoryBrands[category]) {
          console.log(`[DB:filters] Creating missing category brands for: ${category}`);
          categoryBrands[category] = brands.slice(0, 3).map(brand => ({
            ...brand,
            count: 1
          }));
        }
      });
      
      // Get watch products to extract watch-specific filters
      const watches = typedProducts.filter(product => 
        product.category.toLowerCase() === 'watches'
      );
      
      // Extract and count unique bands (strap materials)
      const bands = watches.reduce((acc, watch) => {
        if (!watch.specifications) {
          return acc;
        }
        
        const specifications = watch.specifications as SpecificationsType;
        const material = specifications.strapMaterial;
        
        if (!material) {
          return acc;
        }
        
        // Skip if material is already in the accumulator
        if (acc.some(band => band.id === material.toLowerCase())) {
          return acc;
        }
        
        // Count watches with this material
        const count = watches.filter(w => {
          if (!w.specifications) return false;
          const specs = w.specifications as SpecificationsType;
          return specs.strapMaterial && 
                 specs.strapMaterial.toLowerCase() === material.toLowerCase();
        }).length;
        
        // Add material with count
        acc.push({
          id: material.toLowerCase(),
          name: material.charAt(0).toUpperCase() + material.slice(1),
          count
        });
        
        return acc;
      }, [] as Array<{id: string, name: string, count: number}>);
      
      // Extract and count unique case colors (case materials)
      const caseColors = watches.reduce((acc, watch) => {
        if (!watch.specifications) {
          return acc;
        }
        
        const specifications = watch.specifications as SpecificationsType;
        const material = specifications.caseMaterial;
        
        if (!material) {
          return acc;
        }
        
        // Skip if material is already in the accumulator
        if (acc.some(color => color.id === material.toLowerCase())) {
          return acc;
        }
        
        // Count watches with this material
        const count = watches.filter(w => {
          if (!w.specifications) return false;
          const specs = w.specifications as SpecificationsType;
          return specs.caseMaterial && 
                 specs.caseMaterial.toLowerCase() === material.toLowerCase();
        }).length;
        
        // Add material with count
        acc.push({
          id: material.toLowerCase(),
          name: material.charAt(0).toUpperCase() + material.slice(1),
          count
        });
        
        return acc;
      }, [] as Array<{id: string, name: string, count: number}>);
      
      // Extract and count unique colors (combining dial and strap colors)
      const colors = watches.reduce((acc, watch) => {
        if (!watch.specifications) {
          return acc;
        }
        
        const specifications = watch.specifications as SpecificationsType;
        
        const processColor = (color: string | undefined) => {
          if (!color) return acc;
          
          // Skip if color is already in the accumulator
          if (acc.some(c => c.id === color.toLowerCase())) {
            return acc;
          }
          
          // Count watches with this color (in either dial or strap)
          const count = watches.filter(w => {
            if (!w.specifications) return false;
            const specs = w.specifications as SpecificationsType;
            return (specs.dialColor && specs.dialColor.toLowerCase() === color.toLowerCase()) ||
                   (specs.strapColor && specs.strapColor.toLowerCase() === color.toLowerCase());
          }).length;
          
          // Add color with count
          acc.push({
            id: color.toLowerCase(),
            name: color.charAt(0).toUpperCase() + color.slice(1),
            count
          });
          
          return acc;
        };
        
        // Process both dial and strap colors
        if (specifications.dialColor) {
          acc = processColor(specifications.dialColor);
        }
        
        if (specifications.strapColor) {
          acc = processColor(specifications.strapColor);
        }
        
        return acc;
      }, [] as Array<{id: string, name: string, count: number}>);
      
      // Find min and max price across all products
      const prices = typedProducts.map(product => product.price);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      
      // Find min and max case size for watches
      const caseSizes = watches
        .filter(watch => {
          if (!watch.specifications) return false;
          const specs = watch.specifications as SpecificationsType;
          return !!specs.caseSize;
        })
        .map(watch => {
          const specs = watch.specifications as SpecificationsType;
          const sizeStr = specs.caseSize;
          return sizeStr ? parseInt(sizeStr, 10) : NaN;
        })
        .filter(size => !isNaN(size));
      
      const minCaseSize = caseSizes.length > 0 ? Math.min(...caseSizes) : 20;
      const maxCaseSize = caseSizes.length > 0 ? Math.max(...caseSizes) : 45;
      
      // Construct the complete filters object
      const filtersData: FiltersData = {
        priceRange: {
          min: Math.floor(Math.min(...typedProducts.map(product => product.price))),
          max: Math.ceil(Math.max(...typedProducts.map(product => product.price))),
          unit: 'OMR'
        },
        categories,
        brands,
        categoryBrands,
        bands,
        caseColors,
        colors,
        caseSizeRange: {
          min: minCaseSize,
          max: maxCaseSize,
          unit: 'mm'
        }
      };
      
      console.log('[DB:filters] Generated filters data:', {
        categoriesCount: categories.length,
        brandsCount: brands.length,
        categoryBrandsCount: Object.keys(categoryBrands).length,
        categoryBrandsDetails: Object.keys(categoryBrands).map(key => 
          `${key}: ${categoryBrands[key].length} brands`
        ),
        bandsCount: bands.length,
        caseColorsCount: caseColors.length,
        colorsCount: colors.length,
        priceRange: `${minPrice}-${maxPrice}`,
        caseSizeRange: `${minCaseSize}-${maxCaseSize}`
      });
      
      return filtersData;
    } catch (error) {
      console.error('[DB:filters] Error generating filters:', error);
      
      // Return minimal default filters as fallback
      return {
        priceRange: { min: 0, max: 1000, unit: 'OMR' },
        categories: [],
        brands: [],
        categoryBrands: {
          watches: [],
          accessories: [],
          bags: [],
          perfumes: []
        },
        bands: [],
        caseColors: [],
        colors: [],
        caseSizeRange: { min: 20, max: 45, unit: 'mm' }
      };
    }
  }
};
