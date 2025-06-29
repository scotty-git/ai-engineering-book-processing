import { useState, useEffect, useCallback } from 'react';

interface UseReadingProgressReturn {
  currentSection: string | null;
  progress: number;
  updateProgress: (sectionId: string) => void;
}

export const useReadingProgress = (): UseReadingProgressReturn => {
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const updateProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    setProgress(Math.min(100, Math.max(0, scrollProgress)));
  }, []);

  const handleSectionChange = useCallback((sectionId: string) => {
    setCurrentSection(sectionId);
    
    // Save reading progress to localStorage
    const currentChapter = window.location.pathname.split('/').pop() || 'ch01';
    const progressKey = `reading-progress-${currentChapter}`;
    
    localStorage.setItem(progressKey, JSON.stringify({
      sectionId,
      timestamp: Date.now(),
      progress: progress
    }));
  }, [progress]);

  useEffect(() => {
    // Load saved reading progress
    const currentChapter = window.location.pathname.split('/').pop() || 'ch01';
    const progressKey = `reading-progress-${currentChapter}`;
    const savedProgress = localStorage.getItem(progressKey);
    
    if (savedProgress) {
      try {
        const { sectionId } = JSON.parse(savedProgress);
        setCurrentSection(sectionId);
      } catch (err) {
        console.warn('Failed to parse saved reading progress:', err);
      }
    }
  }, []);

  useEffect(() => {
    // Set up scroll listener for progress tracking
    const handleScroll = () => {
      updateProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial progress calculation
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateProgress]);

  return {
    currentSection,
    progress,
    setCurrentSection: handleSectionChange
  };
};
