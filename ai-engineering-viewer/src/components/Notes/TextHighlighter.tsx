import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNotes } from '../../contexts/NotesContext';
import { NoteTooltip } from './NoteTooltip';
import type { Note, TextRange } from '../../contexts/NotesContext';

interface TextHighlighterProps {
  children: React.ReactNode;
  chapterId: string;
  sectionId?: string;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({ 
  children, 
  chapterId, 
  sectionId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { state, getNotesForChapter, setActiveNote } = useNotes();

  // Get notes for this chapter
  const chapterNotes = getNotesForChapter(chapterId);

  // Tooltip state
  const [tooltipState, setTooltipState] = useState<{
    note: Note;
    targetElement: HTMLElement;
  } | null>(null);

  // Simple highlighting function that works with stored text
  const applyHighlights = () => {
    if (!containerRef.current || !state.settings.showIndicators) {
      console.log('TextHighlighter: Container not ready or indicators disabled');
      return;
    }

    console.log(`TextHighlighter: Applying ${chapterNotes.length} highlights for chapter ${chapterId}`);

    // Remove existing highlights
    const existingHighlights = containerRef.current.querySelectorAll('.note-highlight-span');
    existingHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
        parent.normalize();
      }
    });

    // Apply new highlights
    chapterNotes.forEach(note => {
      try {
        highlightNoteText(note);
      } catch (error) {
        console.warn('Failed to highlight note:', note.id, error);
      }
    });
  };

  // Simple text-based highlighting
  const highlightNoteText = (note: Note) => {
    if (!containerRef.current || !note.highlightedText || note.highlightedText.length < 3) {
      return;
    }

    const textToFind = note.highlightedText.trim();
    console.log('Looking for text:', textToFind);

    // Get all text nodes in the container
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip if already highlighted or in a script/style tag
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          if (parent.classList.contains('note-highlight-span')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }

    // Search for the text in all text nodes
    for (const textNode of textNodes) {
      const nodeText = textNode.textContent || '';
      const index = nodeText.indexOf(textToFind);
      
      if (index !== -1) {
        console.log('Found text in node:', nodeText.substring(0, 50));
        
        // Split the text node and wrap the found text
        const beforeText = nodeText.substring(0, index);
        const foundText = nodeText.substring(index, index + textToFind.length);
        const afterText = nodeText.substring(index + textToFind.length);
        
        const parent = textNode.parentNode;
        if (!parent) continue;
        
        // Create highlight span with elegant styling
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'note-highlight-span';
        highlightSpan.setAttribute('data-note-id', note.id);

        // Use the note's color or a default accent color
        const noteColor = note.color || '#3182ce'; // Default blue

        // Apply elegant highlighting
        highlightSpan.style.backgroundColor = `${noteColor}20`; // 20% opacity
        highlightSpan.style.borderBottom = `2px solid ${noteColor}`;
        highlightSpan.style.borderRadius = '2px';
        highlightSpan.style.cursor = 'pointer';
        highlightSpan.style.padding = '1px 2px';
        highlightSpan.style.transition = 'all 0.2s ease';
        highlightSpan.textContent = foundText;

        // Add hover effects and tooltip
        let hoverTimeout: NodeJS.Timeout;

        highlightSpan.addEventListener('mouseenter', () => {
          highlightSpan.style.backgroundColor = `${noteColor}40`; // Darker on hover
          highlightSpan.style.transform = 'translateY(-1px)';

          // Show tooltip after a short delay
          hoverTimeout = setTimeout(() => {
            if (state.settings.showPreviewOnHover) {
              setTooltipState({
                note,
                targetElement: highlightSpan
              });
            }
          }, 500); // 500ms delay
        });

        highlightSpan.addEventListener('mouseleave', () => {
          highlightSpan.style.backgroundColor = `${noteColor}20`; // Back to normal
          highlightSpan.style.transform = 'translateY(0)';

          // Clear hover timeout and hide tooltip
          clearTimeout(hoverTimeout);
          setTooltipState(null);
        });

        // Add click handler
        highlightSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Clicked note highlight:', note.id);
          setActiveNote(note.id);
        });
        
        // Replace the text node with the new structure
        if (beforeText) {
          parent.insertBefore(document.createTextNode(beforeText), textNode);
        }
        parent.insertBefore(highlightSpan, textNode);
        if (afterText) {
          parent.insertBefore(document.createTextNode(afterText), textNode);
        }
        parent.removeChild(textNode);
        
        console.log('✅ Successfully highlighted text for note:', note.id);
        break; // Only highlight the first occurrence
      }
    }
  };

  // Apply highlights when notes change
  useEffect(() => {
    const timer = setTimeout(applyHighlights, 200);
    return () => clearTimeout(timer);
  }, [chapterNotes, state.settings.showIndicators]);

  return (
    <>
      <div
        ref={containerRef}
        className="text-highlighter-container"
        data-content-area="true"
        data-chapter-id={chapterId}
        data-section-id={sectionId}
        style={{ position: 'relative' }}
      >
        {children}
      </div>

      {/* Render tooltip using portal */}
      {tooltipState && createPortal(
        <NoteTooltip
          note={tooltipState.note}
          targetElement={tooltipState.targetElement}
          onClose={() => setTooltipState(null)}
        />,
        document.body
      )}
    </>
  );
};

// Helper function to check if a range is valid for highlighting
export const isValidTextRange = (range: TextRange, text: string): boolean => {
  return (
    range.startOffset >= 0 &&
    range.endOffset > range.startOffset &&
    text.length >= 3 && // Minimum text length
    text.trim().length > 0
  );
};
