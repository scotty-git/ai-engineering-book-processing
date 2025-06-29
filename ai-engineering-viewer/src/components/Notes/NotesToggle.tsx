import React from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { useParams } from 'react-router-dom';
import styles from './NotesToggle.module.css';

export const NotesToggle: React.FC = () => {
  const { chapterId = 'ch01' } = useParams<{ chapterId: string }>();
  const { state, toggleSidebar, getNotesForChapter } = useNotes();
  
  const chapterNotes = getNotesForChapter(chapterId);
  const noteCount = chapterNotes.length;

  const handleToggle = () => {
    toggleSidebar(!state.sidebarOpen);
  };

  return (
    <button
      className={`${styles.notesToggle} ${state.sidebarOpen ? styles.active : ''}`}
      onClick={handleToggle}
      aria-label={`${state.sidebarOpen ? 'Close' : 'Open'} notes sidebar`}
      title={`Notes (${noteCount}) - Ctrl+Shift+N`}
    >
      <span className={styles.icon}>📝</span>
      {noteCount > 0 && (
        <span className={styles.badge}>{noteCount}</span>
      )}
    </button>
  );
};
