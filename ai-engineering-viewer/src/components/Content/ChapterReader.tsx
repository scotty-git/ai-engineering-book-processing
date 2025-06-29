import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChapterData, useReadingProgress, useTextSelection } from '../../hooks';
import { useCustomization } from '../../contexts/CustomizationContext';
import { ContentRenderer } from './ContentRenderer';
import { TextHighlighter } from '../Notes/TextHighlighter';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { ErrorMessage } from '../UI/ErrorMessage';
import styles from './ChapterReader.module.css';

export const ChapterReader: React.FC = () => {
  const { chapterId = 'ch01' } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { settings } = useCustomization();

  const { data: chapterData, loading, error } = useChapterData(chapterId);
  const { currentSection, progress, setCurrentSection } = useReadingProgress();

  // Initialize text selection for this chapter
  useTextSelection(chapterId);

  // Set up intersection observer for section tracking
  useEffect(() => {
    if (!chapterData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
      }
    );

    // Observe all headings and figures
    const elements = document.querySelectorAll('[id^="heading-"], [id^="ch"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [chapterData, setCurrentSection]);

  const getChapterNumber = (chapterId: string): number => {
    return parseInt(chapterId.replace('ch', ''), 10);
  };

  const getPreviousChapter = (): string | null => {
    const currentNum = getChapterNumber(chapterId);
    return currentNum > 1 ? `ch${(currentNum - 1).toString().padStart(2, '0')}` : null;
  };

  const getNextChapter = (): string | null => {
    const currentNum = getChapterNumber(chapterId);
    return currentNum < 10 ? `ch${(currentNum + 1).toString().padStart(2, '0')}` : null;
  };

  const handlePreviousChapter = () => {
    const prevChapter = getPreviousChapter();
    if (prevChapter) {
      navigate(`/chapter/${prevChapter}`);
    }
  };

  const handleNextChapter = () => {
    const nextChapter = getNextChapter();
    if (nextChapter) {
      navigate(`/chapter/${nextChapter}`);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner message={`Loading ${chapterId}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorMessage 
          title="Failed to load chapter"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className={styles.container}>
        <ErrorMessage 
          title="Chapter not found"
          message={`Chapter ${chapterId} could not be found.`}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Progress bar */}
      {settings.visualEffects.showProgress !== false && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Chapter content */}
      <article className={`${styles.content} customized-content`}>
        <TextHighlighter chapterId={chapterId}>
          {chapterData.sections.map((section, index) => (
            <ContentRenderer
              key={`${section.type}-${index}`}
              section={section}
              chapterId={chapterId}
            />
          ))}
        </TextHighlighter>
      </article>

      {/* Chapter navigation */}
      <nav className={styles.chapterNav}>
        <div className={styles.navButtons}>
          {getPreviousChapter() && (
            <button 
              className={styles.navButton}
              onClick={handlePreviousChapter}
              aria-label="Previous chapter"
            >
              <span className={styles.navArrow}>←</span>
              <span className={styles.navText}>
                <span className={styles.navLabel}>Previous</span>
                <span className={styles.navChapter}>Chapter {getChapterNumber(chapterId) - 1}</span>
              </span>
            </button>
          )}
          
          <div className={styles.navSpacer} />
          
          {getNextChapter() && (
            <button 
              className={styles.navButton}
              onClick={handleNextChapter}
              aria-label="Next chapter"
            >
              <span className={styles.navText}>
                <span className={styles.navLabel}>Next</span>
                <span className={styles.navChapter}>Chapter {getChapterNumber(chapterId) + 1}</span>
              </span>
              <span className={styles.navArrow}>→</span>
            </button>
          )}
        </div>
        
        {/* Chapter metadata */}
        {settings.visualEffects.showProgress !== false && (
          <div className={styles.chapterMeta}>
            <span className={styles.wordCount}>
              {chapterData.metadata.word_count.toLocaleString()} words
            </span>
            <span className={styles.readingTime}>
              {chapterData.metadata.reading_time_minutes} min read
            </span>
            <span className={styles.progress}>
              {Math.round(progress)}% complete
            </span>
          </div>
        )}
      </nav>
    </div>
  );
};
