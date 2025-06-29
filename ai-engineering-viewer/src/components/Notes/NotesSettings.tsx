import React from 'react';
import { useNotes } from '../../contexts/NotesContext';
import styles from './NotesSettings.module.css';

interface NotesSettingsProps {
  onClose: () => void;
}

export const NotesSettings: React.FC<NotesSettingsProps> = ({ onClose }) => {
  const { state, updateSettings, exportNotes, importNotes, clearAllNotes } = useNotes();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (importNotes(content)) {
            alert('Notes imported successfully!');
          } else {
            alert('Failed to import notes. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const notesData = exportNotes();
    const blob = new Blob([notesData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all notes? This cannot be undone.')) {
      clearAllNotes();
      alert('All notes have been deleted.');
    }
  };

  return (
    <div className={styles.notesSettings}>
      <div className={styles.header}>
        <h3 className={styles.title}>Notes Settings</h3>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close settings"
        >
          ✕
        </button>
      </div>

      <div className={styles.content}>
        {/* Display Settings */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Display</h4>
          
          <div className={styles.control}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={state.settings.showIndicators}
                onChange={(e) => updateSettings({ showIndicators: e.target.checked })}
              />
              Show note indicators in text
            </label>
          </div>

          <div className={styles.control}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={state.settings.showPreviewOnHover}
                onChange={(e) => updateSettings({ showPreviewOnHover: e.target.checked })}
              />
              Show preview on hover
            </label>
          </div>

          <div className={styles.control}>
            <label className={styles.label} htmlFor="sidebar-width">
              Sidebar Width: {state.settings.sidebarWidth}px
            </label>
            <input
              id="sidebar-width"
              type="range"
              className={styles.slider}
              min="300"
              max="600"
              step="20"
              value={state.settings.sidebarWidth}
              onChange={(e) => updateSettings({ sidebarWidth: parseInt(e.target.value) })}
            />
            <div className={styles.sliderLabels}>
              <span>300px</span>
              <span>600px</span>
            </div>
          </div>
        </div>

        {/* Behavior Settings */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Behavior</h4>
          
          <div className={styles.control}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={state.settings.autoOpenSidebar}
                onChange={(e) => updateSettings({ autoOpenSidebar: e.target.checked })}
              />
              Auto-open sidebar when creating notes
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Data Management</h4>
          
          <div className={styles.buttonGroup}>
            <button
              className={styles.actionButton}
              onClick={handleExport}
            >
              📤 Export Notes
            </button>
            
            <button
              className={styles.actionButton}
              onClick={handleImport}
            >
              📥 Import Notes
            </button>
            
            <button
              className={`${styles.actionButton} ${styles.dangerButton}`}
              onClick={handleClearAll}
            >
              🗑️ Clear All Notes
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Statistics</h4>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Notes:</span>
              <span className={styles.statValue}>{Object.keys(state.notes).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
