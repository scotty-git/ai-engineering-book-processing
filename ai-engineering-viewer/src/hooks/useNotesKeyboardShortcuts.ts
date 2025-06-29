import { useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';

/**
 * Hook for managing notes-related keyboard shortcuts
 */
export function useNotesKeyboardShortcuts() {
  const { state, toggleSidebar, setActiveNote, setSelectedText } = useNotes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      // Ctrl/Cmd + Shift + N: Toggle notes sidebar
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Escape: Close notes sidebar and clear selections
      if (e.key === 'Escape') {
        if (state.sidebarOpen) {
          e.preventDefault();
          toggleSidebar(false);
          setActiveNote(null);
          setSelectedText(null);
          
          // Also clear text selection
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
          }
        }
        return;
      }

      // Ctrl/Cmd + Enter: Save note (when sidebar is open and editing)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (state.sidebarOpen && (state.selectedText || state.activeNoteId)) {
          e.preventDefault();
          // Trigger save by dispatching a custom event
          // The NoteEditor component will listen for this
          window.dispatchEvent(new CustomEvent('notes:save-shortcut'));
        }
        return;
      }

      // N: Quick note creation (when text is selected)
      if (e.key === 'n' || e.key === 'N') {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
          e.preventDefault();
          toggleSidebar(true);
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.sidebarOpen, state.selectedText, state.activeNoteId, toggleSidebar, setActiveNote, setSelectedText]);

  // Return keyboard shortcuts info for help/documentation
  return {
    shortcuts: [
      {
        keys: ['Ctrl', 'Shift', 'N'],
        description: 'Toggle notes sidebar',
        mac: ['Cmd', 'Shift', 'N'],
      },
      {
        keys: ['N'],
        description: 'Create note from selected text',
        condition: 'When text is selected',
      },
      {
        keys: ['Ctrl', 'Enter'],
        description: 'Save note',
        mac: ['Cmd', 'Enter'],
        condition: 'When editing a note',
      },
      {
        keys: ['Escape'],
        description: 'Close notes sidebar',
        condition: 'When notes sidebar is open',
      },
    ],
  };
}
