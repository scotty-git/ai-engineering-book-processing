import React, { useState, useEffect } from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, sidebar }) => {
  const { settings } = useCustomization();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close sidebar when switching to desktop
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    const handleCloseSidebar = () => {
      setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('closeSidebar', handleCloseSidebar);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('closeSidebar', handleCloseSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className={`${styles.layout} ${sidebarOpen ? styles.sidebarOpen : ''}`}
      data-focus-mode={settings.visualEffects.focusMode || false}
    >
      {/* Mobile header with menu button */}
      {isMobile && (
        <header className={styles.mobileHeader}>
          <button
            className={styles.menuButton}
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <span className={styles.menuIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <h1 className={styles.mobileTitle}>AI Engineering</h1>
        </header>
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
