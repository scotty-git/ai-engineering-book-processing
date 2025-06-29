import React, { useState } from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import { PresetControls } from './PresetControls';
import { FontControls } from './FontControls';
import { LayoutControls } from './LayoutControls';
import { ThemeControls } from './ThemeControls';
import { ReadingControls } from './ReadingControls';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  className?: string;
}

type TabType = 'presets' | 'typography' | 'layout' | 'theme' | 'reading';

export function SettingsPanel({ className }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('presets');
  const {
    resetToDefault,
    updateTypography,
    updateReadingLayout,
    updateTheme,
    updateVisualEffects
  } = useCustomization();

  const tabs = [
    { id: 'presets' as const, label: 'Presets', icon: '⚡' },
    { id: 'typography' as const, label: 'Typography', icon: '🔤' },
    { id: 'layout' as const, label: 'Layout', icon: '📐' },
    { id: 'theme' as const, label: 'Theme', icon: '🎨' },
    { id: 'reading' as const, label: 'Reading', icon: '📖' },
  ];



  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      resetToDefault();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'presets':
        return <PresetControls />;
      case 'typography':
        return <FontControls />;
      case 'layout':
        return <LayoutControls />;
      case 'theme':
        return <ThemeControls />;
      case 'reading':
        return <ReadingControls />;
      default:
        return <FontControls />;
    }
  };

  return (
    <div className={`${styles.settingsPanel} ${className || ''}`}>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {renderTabContent()}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.resetButton}`}
          onClick={handleReset}
        >
          🔄 Reset to Default
        </button>
      </div>


    </div>
  );
}
