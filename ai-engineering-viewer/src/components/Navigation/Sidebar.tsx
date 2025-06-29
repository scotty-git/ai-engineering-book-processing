import React, { useState, useEffect } from 'react';
import { NavItem } from './NavItem';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './Sidebar.module.css';

interface SectionTOC {
  title: string;
  level: number;
  id: string;
  children: SectionTOC[];
}

interface ChapterTOC {
  id: string;
  title: string;
  sections: SectionTOC[];
}

interface BookMetadata {
  title: string;
  total_chapters: number;
  table_of_contents: ChapterTOC[];
}

interface NavigationProps {
  bookMetadata: BookMetadata;
  currentChapter: string;
  currentSection?: string;
  onChapterSelect: (chapterId: string) => void;
  onSectionSelect: (sectionId: string) => void;
  onSettingsToggle?: () => void;
}

export const Sidebar: React.FC<NavigationProps> = ({
  bookMetadata,
  currentChapter,
  currentSection,
  onChapterSelect,
  onSectionSelect,
  onSettingsToggle
}) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set([currentChapter])
  );
  const [navigatingToChapter, setNavigatingToChapter] = useState<string | null>(null);

  // Update expanded chapters when currentChapter changes
  useEffect(() => {
    setExpandedChapters(prev => new Set([...prev, currentChapter]));
    // Clear navigation state when chapter actually changes
    setNavigatingToChapter(null);
  }, [currentChapter]);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleChapterClick = (chapterId: string) => {
    // Don't navigate if already on this chapter
    if (chapterId === currentChapter) {
      return;
    }

    // Set loading state
    setNavigatingToChapter(chapterId);

    onChapterSelect(chapterId);
    // Auto-expand the selected chapter
    setExpandedChapters(prev => new Set([...prev, chapterId]));

    // On mobile, close sidebar after selection
    if (window.innerWidth <= 768) {
      // Small delay to allow navigation to complete
      setTimeout(() => {
        const event = new CustomEvent('closeSidebar');
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const renderSections = (sections: SectionTOC[], chapterId: string, depth = 0) => {
    return sections.map((section, index) => {
      // Generate unique key by combining chapter, depth, index, and section title
      const uniqueKey = `${chapterId}-${depth}-${index}-${section.title.replace(/\s+/g, '-').toLowerCase()}`;

      return (
        <NavItem
          key={uniqueKey}
          section={section}
          chapterId={chapterId}
          currentSection={currentSection}
          onSectionSelect={onSectionSelect}
          depth={depth}
        >
          {section.children && section.children.length > 0 && (
            <div className={styles.subsections}>
              {renderSections(section.children, chapterId, depth + 1)}
            </div>
          )}
        </NavItem>
      );
    });
  };

  if (!bookMetadata) {
    return (
      <div className={styles.sidebar}>
        <div className={styles.loading}>Loading navigation...</div>
      </div>
    );
  }

  return (
    <nav className={`${styles.sidebar} customized-content`}>
      <div className={`${styles.header} customized-content`}>
        <h1 className={`${styles.title} customized-content`}>{bookMetadata.title}</h1>
        <div className={`${styles.stats} customized-content`}>
          {bookMetadata.total_chapters} chapters • {' '}
          161 figures
        </div>
      </div>

      <div className={`${styles.navigation} customized-content`}>
        {bookMetadata.table_of_contents.map((chapter) => {
          const isExpanded = expandedChapters.has(chapter.id);
          const isCurrentChapter = currentChapter === chapter.id;
          const isNavigating = navigatingToChapter === chapter.id;

          return (
            <div key={chapter.id} className={`${styles.chapter} customized-content`}>
              <div className={`${styles.chapterHeader} customized-content`}>
                <button
                  className={`${styles.chapterButton} customized-content ${
                    isCurrentChapter ? styles.current : ''
                  }`}
                  onClick={() => handleChapterClick(chapter.id)}
                  aria-expanded={isExpanded}
                  disabled={isNavigating}
                >
                  <span className={`${styles.chapterTitle} customized-content`}>
                    {isNavigating ? '⏳ ' : ''}{chapter.title}
                  </span>
                  <span className={`${styles.chapterMeta} customized-content`}>
                    {chapter.word_count.toLocaleString()} words • {chapter.reading_time}min
                  </span>
                </button>
                {chapter.sections.length > 0 && (
                  <button
                    className={styles.expandButton}
                    onClick={() => toggleChapter(chapter.id)}
                    aria-label={isExpanded ? 'Collapse sections' : 'Expand sections'}
                  >
                    <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                      ▶
                    </span>
                  </button>
                )}
              </div>
              
              {isExpanded && chapter.sections.length > 0 && (
                <div className={styles.sections}>
                  {renderSections(chapter.sections, chapter.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settings and Controls Section */}
      <div className={`${styles.settingsSection} customized-content`}>
        <div className={styles.settingsDivider}></div>
        <div className={styles.settingsControls}>
          <button
            className={`${styles.settingsButton} customized-content`}
            onClick={onSettingsToggle}
            title="Customization Settings"
            aria-label="Open customization settings"
          >
            <span className={styles.settingsIcon}>⚙️</span>
            <span className={styles.settingsLabel}>Settings</span>
          </button>

          {/* Future controls can be added here */}
          <div className={styles.futureControls}>
            {/* Placeholder for user controls, themes, etc. */}
          </div>
        </div>
      </div>
    </nav>
  );
};
