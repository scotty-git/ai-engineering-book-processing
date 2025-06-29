import React from 'react';
import { SettingsPanel } from './SettingsPanel';
import styles from './CustomizationPanel.module.css';

interface CustomizationPanelProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizationPanel({ className, isOpen, onClose }: CustomizationPanelProps) {
  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + , to open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        // Don't handle opening here - let the parent component handle it
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.panel} ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Customize Reading Experience</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close customization panel"
          >
            ✕
          </button>
        </div>

        <SettingsPanel />
      </div>
    </div>
  );
}