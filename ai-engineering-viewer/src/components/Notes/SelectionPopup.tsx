import React, { useEffect, useState, useRef } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './SelectionPopup.module.css';

export const SelectionPopup: React.FC = () => {
  const { state, toggleSidebar } = useNotes();
  const { settings } = useCustomization();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Calculate popup position based on text selection
  useEffect(() => {
    if (!state.selectedText) {
      setPosition(null);
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setPosition(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position popup above the selection
    const x = rect.left + (rect.width / 2);
    const y = rect.top - 10; // 10px above selection

    setPosition({ x, y });
  }, [state.selectedText]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        // Don't close if clicking on selected text
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          return;
        }
        setPosition(null);
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [position]);

  const handleAddNote = () => {
    if (state.selectedText) {
      // Open sidebar to create note
      toggleSidebar(true);
    }
  };

  const handleClearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    setPosition(null);
  };

  if (!state.selectedText || !position) {
    return null;
  }

  return (
    <div
      ref={popupRef}
      className={styles.selectionPopup}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%) translateY(-100%)',
      }}
    >
      <div className={styles.popupContent}>
        <button
          className={styles.addNoteButton}
          onClick={handleAddNote}
          title="Add note to selected text"
        >
          📝 Add Note
        </button>
        <button
          className={styles.clearButton}
          onClick={handleClearSelection}
          title="Clear selection"
        >
          ✕
        </button>
      </div>
      
      {/* Selected text preview */}
      <div className={styles.selectedTextPreview}>
        "{state.selectedText.text.substring(0, 50)}
        {state.selectedText.text.length > 50 ? '...' : ''}"
      </div>
    </div>
  );
};
