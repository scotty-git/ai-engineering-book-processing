import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { Sidebar } from './components/Navigation/Sidebar';
import { ChapterReader } from './components/Content/ChapterReader';
import { useBookMetadata } from './hooks';
import { LoadingSpinner } from './components/UI/LoadingSpinner';
import { ErrorMessage } from './components/UI/ErrorMessage';
import { CustomizationProvider, useCustomization } from './contexts/CustomizationContext';
import { NotesProvider } from './contexts/NotesContext';
import { useCustomizationCSS } from './hooks/useCustomizationCSS';
import { useNotesKeyboardShortcuts } from './hooks/useNotesKeyboardShortcuts';
import { CustomizationPanel } from './components/Customization/CustomizationPanel';
import { SelectionPopup } from './components/Notes/SelectionPopup';
import { NotesSidebar } from './components/Notes/NotesSidebar';
import { NotesToggle } from './components/Notes/NotesToggle';
import { FloatingNotesButton } from './components/Notes/FloatingNotesButton';

// Inner App component that needs to be inside Router
function AppContent() {
  const navigate = useNavigate();
  const { chapterId } = useParams<{ chapterId: string }>();
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const { data: bookMetadata, loading, error } = useBookMetadata();
  const { settings } = useCustomization();

  // Apply customization CSS
  useCustomizationCSS(settings);

  // Enable notes keyboard shortcuts
  useNotesKeyboardShortcuts();

  // Handle settings panel keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + , to open settings
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsPanelOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get current chapter from URL params
  const currentChapter = chapterId || 'ch01';

  const handleChapterSelect = (chapterId: string) => {
    // Clear current section when changing chapters
    setCurrentSection(null);
    navigate(`/chapter/${chapterId}`);
  };

  const handleSectionSelect = (sectionId: string) => {
    setCurrentSection(sectionId);

    // Use a timeout to ensure the DOM is updated after any potential navigation
    setTimeout(() => {
      // Since all section IDs are the same in metadata, try to find by heading text
      // Look for headings that contain the section title
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let targetElement = null;

      // First try to find by ID
      targetElement = document.getElementById(sectionId);

      // If not found by ID, try to find by text content
      if (!targetElement) {
        for (const heading of headings) {
          if (heading.textContent && heading.textContent.includes(sectionId)) {
            targetElement = heading;
            break;
          }
        }
      }

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Section not found: ${sectionId}`);
      }
    }, 100);
  };

  if (loading) {
    return <LoadingSpinner message="Loading AI Engineering Book..." />;
  }

  if (error || !bookMetadata) {
    return (
      <ErrorMessage
        title="Failed to load book"
        message={error || 'Could not load book metadata'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const sidebar = (
    <Sidebar
      bookMetadata={bookMetadata}
      currentChapter={currentChapter}
      currentSection={currentSection}
      onChapterSelect={handleChapterSelect}
      onSectionSelect={handleSectionSelect}
      onSettingsToggle={() => setSettingsPanelOpen(true)}
    />
  );

  return (
    <AppLayout sidebar={sidebar}>
      <Routes>
        <Route path="/" element={<Navigate to="/chapter/ch01" replace />} />
        <Route path="/chapter/:chapterId" element={<ChapterReader key={currentChapter} />} />
        <Route path="*" element={<Navigate to="/chapter/ch01" replace />} />
      </Routes>
      <CustomizationPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
      />
      <SelectionPopup />
      <NotesSidebar />
      <NotesToggle />
      <FloatingNotesButton />
    </AppLayout>
  );
}

// Main App component
function App() {
  return (
    <CustomizationProvider>
      <NotesProvider>
        <Router>
          <AppContent />
        </Router>
      </NotesProvider>
    </CustomizationProvider>
  );
}

export default App;
