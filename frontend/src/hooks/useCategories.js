import { useState, useEffect } from 'react';
import { categoriesAPI, handleApiError } from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getAll();
      
      // Transform data to match frontend expectations
      const transformedCategories = response.data.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        count: category.business_count,
        slug: category.slug,
        description: category.description
      }));
      
      setCategories(transformedCategories);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
};

export default useCategories;