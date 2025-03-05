
import { FilterOption } from "@/types/api";
import { ProductType, SpecificationsType } from "../types";

/**
 * Extract bands (strap materials) from watches
 */
export function extractBands(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
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
  }, [] as FilterOption[]);
}

/**
 * Extract case colors (case materials) from watches
 */
export function extractCaseColors(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
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
  }, [] as FilterOption[]);
}

/**
 * Extract colors from watches (combining dial and strap colors)
 */
export function extractColors(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
    if (!watch.specifications) {
      return acc;
    }
    
    const specifications = watch.specifications as SpecificationsType;
    
    // Process both dial and strap colors
    if (specifications.dialColor) {
      acc = processColor(specifications.dialColor, watches, acc);
    }
    
    if (specifications.strapColor) {
      acc = processColor(specifications.strapColor, watches, acc);
    }
    
    return acc;
  }, [] as FilterOption[]);
}

/**
 * Process a color and add it to the accumulator if it's not already there
 */
function processColor(color: string, watches: ProductType[], acc: FilterOption[]): FilterOption[] {
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
}

/**
 * Extract case size range from watches
 */
export function extractCaseSizeRange(watches: ProductType[]): { minCaseSize: number, maxCaseSize: number } {
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
  
  return { minCaseSize, maxCaseSize };
}

/**
 * Extract genders from watches
 */
export function extractGenders(watches: ProductType[]): FilterOption[] {
  return watches.reduce((acc, watch) => {
    if (!watch.gender) {
      return acc;
    }
    
    const gender = watch.gender.toLowerCase();
    
    // Skip if gender is already in the accumulator
    if (acc.some(g => g.id === gender)) {
      return acc;
    }
    
    // Count watches with this gender
    const count = watches.filter(w => 
      w.gender && w.gender.toLowerCase() === gender
    ).length;
    
    // Add gender with count
    acc.push({
      id: gender,
      name: gender.charAt(0).toUpperCase() + gender.slice(1),
      count
    });
    
    return acc;
  }, [] as FilterOption[]);
}
