import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { useCustomization } from '../../contexts/CustomizationContext';
import type { Note } from '../../contexts/NotesContext';
import styles from './NotesList.module.css';

export const NotesList: React.FC = () => {
  const { chapterId = 'ch01' } = useParams<{ chapterId: string }>();
  const { state, setActiveNote, deleteNote, getNotesForChapter } = useNotes();
  const { settings } = useCustomization();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'modified' | 'content'>('modified');

  // Get notes for current chapter
  const chapterNotes = getNotesForChapter(chapterId);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(state.notes).forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [state.notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = chapterNotes;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note =>
        note.content.toLowerCase().includes(term) ||
        note.highlightedText.toLowerCase().includes(term) ||
        note.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    // Sort notes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'modified':
          return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        case 'content':
          return a.content.localeCompare(b.content);
        default:
          return 0;
      }
    });

    return filtered;
  }, [chapterNotes, searchTerm, selectedTag, sortBy]);

  const handleNoteClick = (note: Note) => {
    setActiveNote(note.id);
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNote(noteId);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (chapterNotes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📝</div>
        <div className={styles.emptyTitle}>No notes yet</div>
        <div className={styles.emptyText}>
          Select some text to create your first note for this chapter.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.notesList}>
      {/* Search and filters */}
      <div className={styles.controls}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className={styles.filters}>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="modified">Recently modified</option>
            <option value="created">Recently created</option>
            <option value="content">Alphabetical</option>
          </select>
          
          {allTags.length > 0 && (
            <select
              className={styles.tagSelect}
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div className={styles.notesContainer}>
        {filteredNotes.length === 0 ? (
          <div className={styles.noResults}>
            No notes match your search criteria.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`${styles.noteItem} ${
                state.activeNoteId === note.id ? styles.noteItemActive : ''
              }`}
              onClick={() => handleNoteClick(note)}
            >
              {/* Note header */}
              <div className={styles.noteHeader}>
                <div 
                  className={styles.noteColor}
                  style={{ backgroundColor: note.color }}
                />
                <div className={styles.noteDate}>
                  {formatDate(new Date(note.modified))}
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteNote(e, note.id)}
                  title="Delete note"
                  aria-label="Delete note"
                >
                  ×
                </button>
              </div>

              {/* Highlighted text */}
              <div className={styles.highlightedText}>
                "{truncateText(note.highlightedText, 80)}"
              </div>

              {/* Note content */}
              <div className={styles.noteContent}>
                {truncateText(note.content, 120)}
              </div>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className={styles.noteTags}>
                  {note.tags.map(tag => (
                    <span key={tag} className={styles.noteTag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        Showing {filteredNotes.length} of {chapterNotes.length} notes
        {selectedTag && ` tagged with #${selectedTag}`}
      </div>
    </div>
  );
};
