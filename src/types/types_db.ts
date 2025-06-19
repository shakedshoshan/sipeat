/**
 * Database types based on the schema
 */

// Machine table types
export interface Machine {
  id: string; // UUID
  name: string;
  country: string;
  city: string;
  street?: string | null;
}

// Request table types
export interface DrinkRequest {
  id: string; // UUID
  customer_name: string;
  drink_name: string;
  machine: string; // UUID reference to Machine.id
}

export interface Contact {
  id: string; // UUID
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Filter operator types for queries
export type FilterOperator = 
  | 'eq'   // equals
  | 'neq'  // not equals
  | 'gt'   // greater than
  | 'gte'  // greater than or equal
  | 'lt'   // less than
  | 'lte'  // less than or equal
  | 'like' // SQL LIKE
  | 'ilike' // case insensitive LIKE
  | 'in';   // in array

// Filter definition for queries
export interface QueryFilter {
  column: string;
  operator: FilterOperator;
  value: string | number | boolean | null | Array<string | number | boolean | null>;
}

// Query options
export interface QueryOptions {
  filter?: QueryFilter[];
  order?: {
    column: string;
    ascending?: boolean;
  };
  limit?: number;
}
