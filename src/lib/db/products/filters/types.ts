
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

/**
 * Interface for filter options
 */
export interface FilterOptions {
  brand?: string;
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  minCaseSize?: number;
  maxCaseSize?: number;
  band?: string;
  caseColor?: string;
  color?: string;
  [key: string]: any;
}

/**
 * Type for filter function
 */
export type FilterFunction = (
  query: PostgrestFilterBuilder<any, any, any>,
  value: any
) => PostgrestFilterBuilder<any, any, any>;
