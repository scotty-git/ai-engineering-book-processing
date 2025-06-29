import React from 'react';
import { useParams } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './FloatingNotesButton.module.css';

export const FloatingNotesButton: React.FC = () => {
  const { chapterId = 'ch01' } = useParams<{ chapterId: string }>();
  const { state, toggleSidebar, getNotesForChapter } = useNotes();
  const { settings } = useCustomization();
  
  const chapterNotes = getNotesForChapter(chapterId);
  const noteCount = chapterNotes.length;

  const handleClick = () => {
    toggleSidebar(true); // Always open the sidebar
  };

  // Don't render the button if the sidebar is already open
  if (state.sidebarOpen) {
    return null;
  }

  return (
    <button
      className={`${styles.floatingButton} customized-content`}
      onClick={handleClick}
      aria-label={`Open notes sidebar (${noteCount} notes)`}
      title={`Notes (${noteCount}) - Click to open`}
      data-theme-mode={settings.theme.mode}
    >
      <div className={styles.icon}>
        <span className={styles.noteIcon}>📝</span>
        {noteCount > 0 && (
          <span className={styles.badge}>{noteCount}</span>
        )}
      </div>
      <div className={styles.label}>
        Notes
      </div>
    </button>
  );
};
