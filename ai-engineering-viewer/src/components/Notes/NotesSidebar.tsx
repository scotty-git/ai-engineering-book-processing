import React, { useEffect, useRef, useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { useCustomization } from '../../contexts/CustomizationContext';
import { NoteEditor } from './NoteEditor';
import { NotesList } from './NotesList';
import { NotesSettings } from './NotesSettings';
import styles from './NotesSidebar.module.css';

export const NotesSidebar: React.FC = () => {
  const { state, toggleSidebar, setActiveNote, setSelectedText } = useNotes();
  const { settings } = useCustomization();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.sidebarOpen) {
        toggleSidebar(false);
        setActiveNote(null);
        setSelectedText(null);
      }
    };

    if (state.sidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [state.sidebarOpen, toggleSidebar, setActiveNote, setSelectedText]);

  // Handle click outside to close on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth <= 768 &&
        state.sidebarOpen
      ) {
        toggleSidebar(false);
      }
    };

    if (state.sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [state.sidebarOpen, toggleSidebar]);

  const handleClose = () => {
    toggleSidebar(false);
    setActiveNote(null);
    setSelectedText(null);
  };

  if (!state.sidebarOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={styles.overlay}
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Notes sidebar */}
      <aside
        ref={sidebarRef}
        className={`${styles.notesSidebar} customized-content`}
        style={{
          width: `${state.settings.sidebarWidth}px`,
        }}
        data-theme-mode={settings.theme.mode}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {state.selectedText ? 'Add Note' : 
             state.activeNoteId ? 'Edit Note' : 'Notes'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notes sidebar"
            title="Close notes (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {showSettings ? (
            <NotesSettings onClose={() => setShowSettings(false)} />
          ) : state.selectedText || state.activeNoteId ? (
            <NoteEditor />
          ) : (
            <NotesList />
          )}
        </div>

        {/* Footer with settings */}
        <div className={styles.footer}>
          <div className={styles.footerStats}>
            {Object.keys(state.notes).length} notes
          </div>
          <button
            className={styles.settingsButton}
            onClick={() => setShowSettings(!showSettings)}
            title="Notes settings"
          >
            ⚙️
          </button>
        </div>
      </aside>
    </>
  );
};
