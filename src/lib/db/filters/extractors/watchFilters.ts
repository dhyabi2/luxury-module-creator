
import { FilterOption, ProductType } from "../types";

/**
 * Extract unique bands from watch products
 */
export function extractBands(watches: ProductType[]): FilterOption[] {
  const bands = new Map<string, { name: string; count: number }>();
  
  watches.forEach(watch => {
    if (watch.specifications && watch.specifications.strapMaterial) {
      const material = watch.specifications.strapMaterial;
      const id = material.toLowerCase().replace(/\s+/g, '-');
      
      if (bands.has(id)) {
        bands.get(id)!.count++;
      } else {
        bands.set(id, { name: material, count: 1 });
      }
    }
  });
  
  return Array.from(bands.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}

/**
 * Extract unique case colors from watch products
 */
export function extractCaseColors(watches: ProductType[]): FilterOption[] {
  const caseColors = new Map<string, { name: string; count: number }>();
  
  watches.forEach(watch => {
    if (watch.specifications && watch.specifications.caseMaterial) {
      const material = watch.specifications.caseMaterial;
      const id = material.toLowerCase().replace(/\s+/g, '-');
      
      if (caseColors.has(id)) {
        caseColors.get(id)!.count++;
      } else {
        caseColors.set(id, { name: material, count: 1 });
      }
    }
  });
  
  return Array.from(caseColors.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}

/**
 * Extract unique colors from watch products
 */
export function extractColors(watches: ProductType[]): FilterOption[] {
  const colors = new Map<string, { name: string; count: number }>();
  
  watches.forEach(watch => {
    if (watch.specifications) {
      // Check dial color
      if (watch.specifications.dialColor) {
        const color = watch.specifications.dialColor;
        const id = color.toLowerCase().replace(/\s+/g, '-');
        
        if (colors.has(id)) {
          colors.get(id)!.count++;
        } else {
          colors.set(id, { name: color, count: 1 });
        }
      }
      
      // Check strap color
      if (watch.specifications.strapColor) {
        const color = watch.specifications.strapColor;
        const id = color.toLowerCase().replace(/\s+/g, '-');
        
        if (colors.has(id)) {
          colors.get(id)!.count++;
        } else {
          colors.set(id, { name: color, count: 1 });
        }
      }
    }
  });
  
  return Array.from(colors.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}

/**
 * Extract case size range from watch products
 */
export function extractCaseSizeRange(watches: ProductType[]): { minCaseSize: number; maxCaseSize: number } {
  let minSize = 100;
  let maxSize = 0;
  
  watches.forEach(watch => {
    if (watch.specifications && watch.specifications.caseSize) {
      const sizeStr = watch.specifications.caseSize;
      const sizeNum = parseInt(sizeStr);
      
      if (!isNaN(sizeNum)) {
        minSize = Math.min(minSize, sizeNum);
        maxSize = Math.max(maxSize, sizeNum);
      }
    }
  });
  
  return {
    minCaseSize: minSize === 100 ? 28 : minSize,
    maxCaseSize: maxSize === 0 ? 45 : maxSize
  };
}

/**
 * Extract unique genders from watch products
 */
export function extractGenders(watches: ProductType[]): FilterOption[] {
  const genders = new Map<string, { name: string; count: number }>();
  
  watches.forEach(watch => {
    if (watch.specifications && watch.specifications.gender) {
      const gender = watch.specifications.gender;
      const id = gender.toLowerCase().replace(/\s+/g, '-');
      
      if (genders.has(id)) {
        genders.get(id)!.count++;
      } else {
        genders.set(id, { name: gender, count: 1 });
      }
    }
  });
  
  return Array.from(genders.entries()).map(([id, { name, count }]) => ({
    id,
    name,
    count
  }));
}
