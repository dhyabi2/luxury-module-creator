
import { FilterOption, ProductType } from "../types";

/**
 * Extracts unique band materials from watch products
 */
export function extractBands(products: ProductType[]): FilterOption[] {
  const bandMap = new Map<string, number>();
  
  products.forEach(product => {
    if (product.specifications && product.specifications.strapMaterial) {
      const band = product.specifications.strapMaterial;
      const count = bandMap.get(band) || 0;
      bandMap.set(band, count + 1);
    }
  });
  
  return Array.from(bandMap.entries()).map(([id, count]) => ({
    id,
    name: id,
    count
  }));
}

/**
 * Extracts unique case colors from watch products
 */
export function extractCaseColors(products: ProductType[]): FilterOption[] {
  const colorMap = new Map<string, number>();
  
  products.forEach(product => {
    if (product.specifications && product.specifications.caseMaterial) {
      const color = product.specifications.caseMaterial;
      const count = colorMap.get(color) || 0;
      colorMap.set(color, count + 1);
    }
  });
  
  return Array.from(colorMap.entries()).map(([id, count]) => ({
    id,
    name: id,
    count
  }));
}

/**
 * Extracts unique dial colors from watch products
 */
export function extractColors(products: ProductType[]): FilterOption[] {
  const colorMap = new Map<string, number>();
  
  products.forEach(product => {
    // Extract dial colors
    if (product.specifications && product.specifications.dialColor) {
      const color = product.specifications.dialColor;
      const count = colorMap.get(color) || 0;
      colorMap.set(color, count + 1);
    }
    
    // Extract strap colors
    if (product.specifications && product.specifications.strapColor) {
      const color = product.specifications.strapColor;
      const count = colorMap.get(color) || 0;
      colorMap.set(color, count + 1);
    }
  });
  
  return Array.from(colorMap.entries()).map(([id, count]) => ({
    id,
    name: id,
    count
  }));
}

/**
 * Calculates the min and max case sizes from watch products
 */
export function extractCaseSizeRange(products: ProductType[]): { minCaseSize: number; maxCaseSize: number } {
  let minCaseSize = 100;
  let maxCaseSize = 20;
  
  products.forEach(product => {
    if (product.specifications && product.specifications.caseSize) {
      let size = product.specifications.caseSize;
      
      // Handle string values with 'mm'
      if (typeof size === 'string') {
        size = parseFloat(size.replace('mm', ''));
      }
      
      if (!isNaN(size)) {
        minCaseSize = Math.min(minCaseSize, size);
        maxCaseSize = Math.max(maxCaseSize, size);
      }
    }
  });
  
  return {
    minCaseSize: Math.floor(minCaseSize),
    maxCaseSize: Math.ceil(maxCaseSize)
  };
}

/**
 * Extracts unique genders from products
 */
export function extractGenders(products: ProductType[]): FilterOption[] {
  // Standard genders for watches and accessories
  const standardGenders = [
    { id: 'men', name: 'Men', count: 0 },
    { id: 'women', name: 'Women', count: 0 },
    { id: 'unisex', name: 'Unisex', count: 0 }
  ];
  
  const genderMap = new Map<string, number>();
  standardGenders.forEach(gender => genderMap.set(gender.id, 0));
  
  products.forEach(product => {
    if (product.specifications && product.specifications.gender) {
      const gender = product.specifications.gender.toLowerCase();
      const count = genderMap.get(gender) || 0;
      genderMap.set(gender, count + 1);
    }
  });
  
  return standardGenders.map(gender => ({
    ...gender,
    count: genderMap.get(gender.id) || 0
  }));
}
