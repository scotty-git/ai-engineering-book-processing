import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { useCustomization } from '../../contexts/CustomizationContext';
import { isValidTextRange } from './TextHighlighter';
import styles from './NoteEditor.module.css';

export const NoteEditor: React.FC = () => {
  const { 
    state, 
    addNote, 
    updateNote, 
    deleteNote, 
    setActiveNote, 
    setSelectedText,
    toggleSidebar 
  } = useNotes();
  const { settings } = useCustomization();
  
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState(state.settings.defaultColor);
  const [isLoading, setIsLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!state.activeNoteId;
  const existingNote = isEditing ? state.notes[state.activeNoteId!] : null;

  // Initialize form with existing note data or selected text
  useEffect(() => {
    if (existingNote) {
      setContent(existingNote.content);
      setTags(existingNote.tags);
      setColor(existingNote.color);
    } else {
      setContent('');
      setTags([]);
      setColor(state.settings.defaultColor);
    }
  }, [existingNote, state.settings.defaultColor]);

  // Auto-focus textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Listen for save keyboard shortcut
  useEffect(() => {
    const handleSaveShortcut = () => {
      if (content.trim()) {
        handleSave();
      }
    };

    window.addEventListener('notes:save-shortcut', handleSaveShortcut);
    return () => window.removeEventListener('notes:save-shortcut', handleSaveShortcut);
  }, [content]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSave = async () => {
    if (!content.trim()) {
      alert('Please enter some content for your note.');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && existingNote) {
        // Update existing note
        updateNote(existingNote.id, {
          content: content.trim(),
          tags,
          color,
        });
      } else if (state.selectedText) {
        // Create new note from selection
        if (!isValidTextRange(state.selectedText.range, state.selectedText.text)) {
          alert('Invalid text selection. Please try selecting the text again.');
          return;
        }

        addNote({
          chapterId: state.selectedText.chapterId,
          textRange: state.selectedText.range,
          highlightedText: state.selectedText.text,
          content: content.trim(),
          tags,
          color,
        });
      }

      // Clear form and close
      setContent('');
      setTags([]);
      setColor(state.settings.defaultColor);
      setActiveNote(null);
      setSelectedText(null);

      // Keep sidebar open to show the new note
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setTags([]);
    setColor(state.settings.defaultColor);
    setActiveNote(null);
    setSelectedText(null);
  };

  const handleDelete = () => {
    if (existingNote && confirm('Are you sure you want to delete this note?')) {
      deleteNote(existingNote.id);
      setActiveNote(null);
    }
  };

  const handleTagAdd = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      handleTagAdd(input.value);
      input.value = '';
    }
  };

  const colorOptions = [
    { name: 'Blue', value: '#3182ce' },
    { name: 'Green', value: '#38a169' },
    { name: 'Purple', value: '#805ad5' },
    { name: 'Red', value: '#e53e3e' },
    { name: 'Orange', value: '#dd6b20' },
    { name: 'Teal', value: '#319795' },
    { name: 'Pink', value: '#d53f8c' },
    { name: 'Gray', value: '#718096' },
  ];

  return (
    <div className={styles.noteEditor}>
      {/* Selected text context */}
      {state.selectedText && (
        <div className={styles.selectedTextContext}>
          <div className={styles.contextLabel}>Selected text:</div>
          <div className={styles.contextText}>
            "{state.selectedText.text}"
          </div>
        </div>
      )}

      {/* Note content */}
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="note-content">
          Note content
        </label>
        <textarea
          ref={textareaRef}
          id="note-content"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Tags */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Tags</label>
        <div className={styles.tagsContainer}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={() => handleTagRemove(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className={styles.tagInput}
            placeholder="Add tag..."
            onKeyDown={handleTagKeyDown}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Color picker */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Highlight color</label>
        <div className={styles.colorPicker}>
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.value}
              type="button"
              className={`${styles.colorOption} ${
                color === colorOption.value ? styles.colorOptionActive : ''
              }`}
              style={{ backgroundColor: colorOption.value }}
              onClick={() => setColor(colorOption.value)}
              title={colorOption.name}
              aria-label={`Select ${colorOption.name} color`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        
        {isEditing && (
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </button>
        )}
        
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};
