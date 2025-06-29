import { useState, useEffect, useCallback, useRef } from 'react';

interface ChapterData {
  id: string;
  title: string;
  sections: any[];
}

interface UseChapterDataReturn {
  data: ChapterData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Global cache for chapter data
const chapterCache = new Map<string, ChapterData>();
const loadingPromises = new Map<string, Promise<ChapterData>>();

const loadChapterFromAPI = async (chapterId: string): Promise<ChapterData> => {
  const response = await fetch(`/extracted-content/chapters/structured/${chapterId}.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to load chapter ${chapterId}: ${response.status} ${response.statusText}`);
  }
  
  const chapterData: ChapterData = await response.json();
  
  // Validate the data structure
  if (!chapterData.id || !chapterData.title || !Array.isArray(chapterData.sections)) {
    throw new Error(`Invalid chapter data structure for ${chapterId}`);
  }
  
  return chapterData;
};

const loadChapter = async (chapterId: string): Promise<ChapterData> => {
  // Return cached data if available
  if (chapterCache.has(chapterId)) {
    return chapterCache.get(chapterId)!;
  }
  
  // Return existing loading promise if already loading
  if (loadingPromises.has(chapterId)) {
    return loadingPromises.get(chapterId)!;
  }
  
  // Create new loading promise
  const loadingPromise = loadChapterFromAPI(chapterId);
  loadingPromises.set(chapterId, loadingPromise);
  
  try {
    const chapterData = await loadingPromise;
    chapterCache.set(chapterId, chapterData);
    return chapterData;
  } finally {
    loadingPromises.delete(chapterId);
  }
};

const preloadAdjacentChapters = (currentChapterId: string) => {
  const chapterNumber = parseInt(currentChapterId.replace('ch', ''), 10);
  
  // Preload previous and next chapters
  const adjacentChapters = [
    chapterNumber - 1,
    chapterNumber + 1
  ].filter(num => num >= 1 && num <= 10)
   .map(num => `ch${num.toString().padStart(2, '0')}`);
  
  adjacentChapters.forEach(chapterId => {
    if (!chapterCache.has(chapterId) && !loadingPromises.has(chapterId)) {
      // Preload in background without blocking
      loadChapter(chapterId).catch(err => {
        console.warn(`Failed to preload chapter ${chapterId}:`, err);
      });
    }
  });
};

export const useChapterData = (chapterId: string): UseChapterDataReturn => {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentChapterRef = useRef<string>(chapterId);

  const loadChapterData = useCallback(async (targetChapterId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const chapterData = await loadChapter(targetChapterId);
      
      // Only update state if this is still the current chapter
      if (currentChapterRef.current === targetChapterId) {
        setData(chapterData);
        
        // Preload adjacent chapters in background
        preloadAdjacentChapters(targetChapterId);
      }
    } catch (err) {
      // Only update error state if this is still the current chapter
      if (currentChapterRef.current === targetChapterId) {
        const errorMessage = err instanceof Error ? err.message : `Unknown error loading chapter ${targetChapterId}`;
        setError(errorMessage);
        console.error(`Error loading chapter ${targetChapterId}:`, err);
      }
    } finally {
      // Only update loading state if this is still the current chapter
      if (currentChapterRef.current === targetChapterId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    currentChapterRef.current = chapterId;
    
    // Check if chapter is already cached
    if (chapterCache.has(chapterId)) {
      setData(chapterCache.get(chapterId)!);
      setLoading(false);
      setError(null);
      
      // Still preload adjacent chapters
      preloadAdjacentChapters(chapterId);
    } else {
      loadChapterData(chapterId);
    }
  }, [chapterId, loadChapterData]);

  const refetch = useCallback(() => {
    loadChapterData(chapterId);
  }, [chapterId, loadChapterData]);

  return { data, loading, error, refetch };
};

// Utility function to clear cache if needed
export const clearChapterCache = () => {
  chapterCache.clear();
  loadingPromises.clear();
};

// Utility function to get cache status
export const getCacheStatus = () => {
  return {
    cachedChapters: Array.from(chapterCache.keys()),
    loadingChapters: Array.from(loadingPromises.keys()),
    cacheSize: chapterCache.size
  };
};
