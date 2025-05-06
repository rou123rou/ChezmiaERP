import { useState, useEffect, useCallback } from 'react';

interface State<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

interface UseFetchResult<T> extends State<T> {
  fetchData: (url: string, options?: RequestInit) => Promise<void>; // Type correct pour fetchData
}

function useFetch<T = any>(initialUrl?: string, initialOptions?: RequestInit): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialUrl);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `Erreur HTTP: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialUrl) {
      fetchData(initialUrl, initialOptions);
    }
  }, [initialUrl, initialOptions, fetchData]);

  return { loading, error, data, fetchData };
}

export default useFetch;