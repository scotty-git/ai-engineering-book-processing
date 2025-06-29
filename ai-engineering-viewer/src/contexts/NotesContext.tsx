import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Text Range Interface for precise highlighting
interface TextRange {
  startOffset: number;
  endOffset: number;
  startContainer: string; // CSS selector or element ID
  endContainer: string;   // CSS selector or element ID
}

// Note Interface
interface Note {
  id: string;
  chapterId: string;
  sectionId?: string;
  textRange: TextRange;
  highlightedText: string;
  content: string;
  author: string; // Author name
  created: Date;
  modified: Date;
  tags: string[];
  color: string; // Hex color for highlight
}

// Notes Settings Interface
interface NotesSettings {
  showIndicators: boolean;
  indicatorStyle: 'underline' | 'highlight' | 'both';
  defaultColor: string;
  sidebarWidth: number; // 300-600px
  autoOpenSidebar: boolean;
  showPreviewOnHover: boolean;
}

// Notes State Interface
interface NotesState {
  notes: Record<string, Note>; // keyed by note ID
  settings: NotesSettings;
  sidebarOpen: boolean;
  activeNoteId: string | null;
  selectedText: {
    text: string;
    range: TextRange;
    chapterId: string;
  } | null;
}

// Default Settings
const defaultNotesSettings: NotesSettings = {
  showIndicators: true,
  indicatorStyle: 'underline',
  defaultColor: '#3182ce', // Matches default accent color
  sidebarWidth: 400,
  autoOpenSidebar: true,
  showPreviewOnHover: true,
};

// Default State
const defaultNotesState: NotesState = {
  notes: {},
  settings: defaultNotesSettings,
  sidebarOpen: false,
  activeNoteId: null,
  selectedText: null,
};

// Action Types
type NotesAction =
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id' | 'created' | 'modified' | 'author'> }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_SELECTED_TEXT'; payload: NotesState['selectedText'] }
  | { type: 'SET_ACTIVE_NOTE'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR'; payload?: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<NotesSettings> }
  | { type: 'LOAD_NOTES'; payload: NotesState }
  | { type: 'CLEAR_ALL_NOTES' };

// Utility function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Reducer
function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'ADD_NOTE': {
      const id = generateId();
      const now = new Date();
      const newNote: Note = {
        ...action.payload,
        id,
        author: 'Scott', // Default author
        created: now,
        modified: now,
      };
      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: newNote,
        },
        activeNoteId: id,
        selectedText: null,
      };
    }
    
    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload;
      const existingNote = state.notes[id];
      if (!existingNote) return state;
      
      return {
        ...state,
        notes: {
          ...state.notes,
          [id]: {
            ...existingNote,
            ...updates,
            modified: new Date(),
          },
        },
      };
    }
    
    case 'DELETE_NOTE': {
      const { [action.payload]: deleted, ...remainingNotes } = state.notes;
      return {
        ...state,
        notes: remainingNotes,
        activeNoteId: state.activeNoteId === action.payload ? null : state.activeNoteId,
      };
    }
    
    case 'SET_SELECTED_TEXT':
      return {
        ...state,
        selectedText: action.payload,
        sidebarOpen: action.payload ? state.settings.autoOpenSidebar : state.sidebarOpen,
      };
    
    case 'SET_ACTIVE_NOTE':
      return {
        ...state,
        activeNoteId: action.payload,
        sidebarOpen: action.payload ? true : state.sidebarOpen,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload !== undefined ? action.payload : !state.sidebarOpen,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'LOAD_NOTES':
      return action.payload;
    
    case 'CLEAR_ALL_NOTES':
      return {
        ...state,
        notes: {},
        activeNoteId: null,
        selectedText: null,
      };
    
    default:
      return state;
  }
}

// Context Interface
interface NotesContextType {
  state: NotesState;
  addNote: (note: Omit<Note, 'id' | 'created' | 'modified' | 'author'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setSelectedText: (selection: NotesState['selectedText']) => void;
  setActiveNote: (id: string | null) => void;
  toggleSidebar: (open?: boolean) => void;
  updateSettings: (settings: Partial<NotesSettings>) => void;
  getNotesForChapter: (chapterId: string) => Note[];
  getNotesForSection: (chapterId: string, sectionId: string) => Note[];
  exportNotes: () => string;
  importNotes: (notesJson: string) => boolean;
  clearAllNotes: () => void;
}

// Create Context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Storage Key
const NOTES_STORAGE_KEY = 'ai-engineering-viewer-notes';

// Provider Component
interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [state, dispatch] = useReducer(notesReducer, defaultNotesState);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes) {
        const parsedState = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const notesWithDates = Object.keys(parsedState.notes).reduce((acc, id) => {
          const note = parsedState.notes[id];
          acc[id] = {
            ...note,
            created: new Date(note.created),
            modified: new Date(note.modified),
          };
          return acc;
        }, {} as Record<string, Note>);
        
        dispatch({
          type: 'LOAD_NOTES',
          payload: {
            ...parsedState,
            notes: notesWithDates,
            // Merge saved settings with defaults to ensure new defaults are applied
            settings: {
              ...defaultNotesSettings,
              ...parsedState.settings,
              // Force showIndicators to true for existing users (one-time migration)
              showIndicators: true,
            },
          },
        });
      }
    } catch (error) {
      console.warn('Failed to load notes from localStorage:', error);
    }
  }, []);

  // Save notes to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save notes to localStorage:', error);
    }
  }, [state]);

  // Helper functions
  const getNotesForChapter = (chapterId: string): Note[] => {
    return Object.values(state.notes).filter(note => note.chapterId === chapterId);
  };

  const getNotesForSection = (chapterId: string, sectionId: string): Note[] => {
    return Object.values(state.notes).filter(
      note => note.chapterId === chapterId && note.sectionId === sectionId
    );
  };

  // Context value
  const contextValue: NotesContextType = {
    state,
    addNote: (note) => dispatch({ type: 'ADD_NOTE', payload: note }),
    updateNote: (id, updates) => dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } }),
    deleteNote: (id) => dispatch({ type: 'DELETE_NOTE', payload: id }),
    setSelectedText: (selection) => dispatch({ type: 'SET_SELECTED_TEXT', payload: selection }),
    setActiveNote: (id) => dispatch({ type: 'SET_ACTIVE_NOTE', payload: id }),
    toggleSidebar: (open) => dispatch({ type: 'TOGGLE_SIDEBAR', payload: open }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    getNotesForChapter,
    getNotesForSection,
    exportNotes: () => JSON.stringify(state, null, 2),
    importNotes: (notesJson: string) => {
      try {
        const parsedState = JSON.parse(notesJson);
        dispatch({ type: 'LOAD_NOTES', payload: parsedState });
        return true;
      } catch {
        return false;
      }
    },
    clearAllNotes: () => dispatch({ type: 'CLEAR_ALL_NOTES' }),
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

// Hook to use notes context
export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

// Export types for use in other components
export type {
  Note,
  NotesSettings,
  NotesState,
  TextRange,
};
