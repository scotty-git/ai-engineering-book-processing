import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './PresetControls.module.css';
import sharedStyles from './shared.module.css';

export function PresetControls() {
  const { applyPreset } = useCustomization();

  const presets = [
    {
      id: 'default',
      name: 'Default',
      description: 'Clean and balanced reading experience',
      icon: '📄',
      preview: 'Aa'
    },
    {
      id: 'comfortable',
      name: 'Comfortable',
      description: 'Larger text and relaxed spacing',
      icon: '😌',
      preview: 'Aa'
    },
    {
      id: 'compact',
      name: 'Compact',
      description: 'Dense layout for more content',
      icon: '📚',
      preview: 'Aa'
    },
    {
      id: 'focus',
      name: 'Focus',
      description: 'Minimal distractions, centered content',
      icon: '🎯',
      preview: 'Aa'
    },
    {
      id: 'dark-reader',
      name: 'Dark Reader',
      description: 'Dark theme optimized for reading',
      icon: '🌙',
      preview: 'Aa'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum readability and accessibility',
      icon: '⚡',
      preview: 'Aa'
    },
    {
      id: 'sepia-classic',
      name: 'Sepia Classic',
      description: 'Warm, paper-like reading experience',
      icon: '📜',
      preview: 'Aa'
    },
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Clean, contemporary design',
      icon: '✨',
      preview: 'Aa'
    }
  ];

  const handlePresetClick = (presetId: string) => {
    applyPreset(presetId);
  };

  return (
    <div className={sharedStyles.controlsContainer}>
      <h3 className={sharedStyles.title}>Quick Presets</h3>
      
      <div className={styles.presetsGrid}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            className={styles.presetCard}
            onClick={() => handlePresetClick(preset.id)}
            title={preset.description}
          >
            <div className={styles.presetIcon}>
              {preset.icon}
            </div>
            <div className={styles.presetPreview}>
              {preset.preview}
            </div>
            <div className={styles.presetInfo}>
              <div className={styles.presetName}>
                {preset.name}
              </div>
              <div className={styles.presetDescription}>
                {preset.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.presetNote}>
        <p>
          <strong>💡 Tip:</strong> Presets provide instant styling combinations. 
          You can further customize any preset using the other tabs.
        </p>
      </div>
    </div>
  );
}
