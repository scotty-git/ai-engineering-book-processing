import React, { useState, useEffect } from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import type { Note } from '../../contexts/NotesContext';
import styles from './NoteTooltip.module.css';

interface NoteTooltipProps {
  note: Note;
  targetElement: HTMLElement;
  onClose: () => void;
}

export const NoteTooltip: React.FC<NoteTooltipProps> = ({ note, targetElement, onClose }) => {
  const { settings } = useCustomization();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Calculate tooltip position
  useEffect(() => {
    const calculatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // Position tooltip to the right of the highlighted text
      const x = rect.right + scrollLeft + 10; // 10px offset from the highlight
      const y = rect.top + scrollTop;
      
      // Ensure tooltip doesn't go off-screen
      const tooltipWidth = 320; // Approximate tooltip width
      const tooltipHeight = 150; // Approximate tooltip height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let finalX = x;
      let finalY = y;
      
      // If tooltip would go off the right edge, position it to the left
      if (x + tooltipWidth > viewportWidth + scrollLeft) {
        finalX = rect.left + scrollLeft - tooltipWidth - 10;
      }
      
      // If tooltip would go off the bottom, adjust vertically
      if (y + tooltipHeight > viewportHeight + scrollTop) {
        finalY = Math.max(scrollTop + 10, y - tooltipHeight + rect.height);
      }
      
      setPosition({ x: finalX, y: finalY });
    };

    calculatePosition();
    
    // Recalculate on scroll or resize
    const handleResize = () => calculatePosition();
    window.addEventListener('scroll', calculatePosition);
    window.addEventListener('resize', handleResize);
    
    // Show tooltip after position is calculated
    const timer = setTimeout(() => setIsVisible(true), 50);
    
    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [targetElement]);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const tooltip = document.querySelector(`.${styles.tooltip}`);
      if (tooltip && !tooltip.contains(event.target as Node) && !targetElement.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [targetElement, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.tooltip} customized-content`}
      style={{
        left: position.x,
        top: position.y,
      }}
      data-theme-mode={settings.theme.mode}
    >
      {/* Arrow pointing to the highlight */}
      <div className={styles.arrow} />
      
      {/* Header with author and date */}
      <div className={styles.header}>
        <div className={styles.author}>
          <span className={styles.authorIcon}>👤</span>
          {note.author}
        </div>
        <div className={styles.date}>
          {formatDate(note.created)}
        </div>
      </div>
      
      {/* Note content */}
      <div className={styles.content}>
        {note.content}
      </div>
      
      {/* Tags if any */}
      {note.tags.length > 0 && (
        <div className={styles.tags}>
          {note.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Footer with highlighted text context */}
      <div className={styles.footer}>
        <div className={styles.highlightedText}>
          "{note.highlightedText}"
        </div>
      </div>
    </div>
  );
};
