import { useState, useEffect } from 'react';

interface BookMetadata {
  title: string;
  chapters: any[];
}

interface UseBookMetadataReturn {
  data: BookMetadata | null;
  loading: boolean;
  error: string | null;
}

export const useBookMetadata = (): UseBookMetadataReturn => {
  const [data, setData] = useState<BookMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookMetadata = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/extracted-content/chapters/metadata/book-metadata.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load book metadata: ${response.status} ${response.statusText}`);
        }
        
        const bookMetadata: BookMetadata = await response.json();
        
        // Validate the data structure
        if (!bookMetadata.title || !bookMetadata.table_of_contents || !Array.isArray(bookMetadata.table_of_contents)) {
          throw new Error('Invalid book metadata structure');
        }
        
        setData(bookMetadata);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading book metadata';
        setError(errorMessage);
        console.error('Error loading book metadata:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookMetadata();
  }, []);

  return { data, loading, error };
};
