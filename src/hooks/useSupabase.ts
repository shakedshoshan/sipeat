import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { QueryOptions } from '@/types/types_db';

// Generic hook for fetching data from Supabase
export function useSupabaseQuery<T>(
  tableName: string, 
  columns: string = '*', 
  options: QueryOptions = {}
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize the fetch function to avoid recreating it on every render
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Start the query
      let query = supabase.from(tableName).select(columns);
      
      // Apply filters if any
      if (options.filter && options.filter.length > 0) {
        options.filter.forEach(filter => {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.column, filter.value);
              break;
            case 'neq':
              query = query.neq(filter.column, filter.value);
              break;
            case 'gt':
              query = query.gt(filter.column, filter.value);
              break;
            case 'gte':
              query = query.gte(filter.column, filter.value);
              break;
            case 'lt':
              query = query.lt(filter.column, filter.value);
              break;
            case 'lte':
              query = query.lte(filter.column, filter.value);
              break;
            case 'like':
              // like operator requires string value
              if (typeof filter.value === 'string') {
                query = query.like(filter.column, filter.value);
              }
              break;
            case 'ilike':
              // ilike operator requires string value
              if (typeof filter.value === 'string') {
                query = query.ilike(filter.column, filter.value);
              }
              break;
            case 'in':
              // in operator requires array value
              if (Array.isArray(filter.value)) {
                query = query.in(filter.column, filter.value);
              }
              break;
            default:
              break;
          }
        });
      }
      
      // Apply ordering if specified
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      
      // Apply limit if specified
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Execute the query
      const { data: result, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      setData(result as T[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  }, [tableName, columns, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
}

// Hook for inserting data into Supabase
export function useSupabaseInsert<T>(tableName: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const insertData = async (data: Partial<T> | Partial<T>[]) => {
    try {
      setLoading(true);
      const { data: result, error: insertError } = await supabase
        .from(tableName)
        .insert(data)
        .select();
      
      if (insertError) throw insertError;
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error inserting data into Supabase:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { insertData, loading, error };
}

// Hook for updating data in Supabase
export function useSupabaseUpdate<T>(tableName: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateData = async (
    match: { column: string; value: string | number | boolean | null },
    data: Partial<T>
  ) => {
    try {
      setLoading(true);
      const { data: result, error: updateError } = await supabase
        .from(tableName)
        .update(data)
        .eq(match.column, match.value)
        .select();
      
      if (updateError) throw updateError;
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error updating data in Supabase:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading, error };
}

// Hook for deleting data from Supabase
export function useSupabaseDelete(tableName: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteData = async (match: { column: string; value: string | number | boolean | null }) => {
    try {
      setLoading(true);
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq(match.column, match.value);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error deleting data from Supabase:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, loading, error };
} 