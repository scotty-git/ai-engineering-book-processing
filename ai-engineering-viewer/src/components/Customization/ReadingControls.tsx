import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './ReadingControls.module.css';

interface ReadingControlsProps {
  className?: string;
}

export function ReadingControls({ className }: ReadingControlsProps) {
  const { settings, updateVisualEffects } = useCustomization();

  const backgroundTextureOptions = [
    { value: 'none', label: 'None' },
    { value: 'paper', label: 'Paper' },
    { value: 'linen', label: 'Linen' },
    { value: 'canvas', label: 'Canvas' },
  ];

  const backgroundGradientOptions = [
    { value: 'none', label: 'None' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'warm', label: 'Warm' },
    { value: 'cool', label: 'Cool' },
    { value: 'vibrant', label: 'Vibrant' },
  ];

  const borderStyleOptions = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'none', label: 'None' },
    { value: 'bold', label: 'Bold' },
    { value: 'rounded', label: 'Rounded' },
  ];

  const textShadowOptions = [
    { value: 'none', label: 'None' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'soft', label: 'Soft' },
    { value: 'crisp', label: 'Crisp' },
    { value: 'strong', label: 'Strong' },
    { value: 'glow', label: 'Glow' },
  ];

  return (
    <div className={`${styles.readingControls} ${className || ''}`}>
      <h3 className={styles.title}>Reading Experience</h3>

      {/* Focus Mode */}
      <div className={styles.control}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={settings.visualEffects.focusMode || false}
            onChange={(e) => updateVisualEffects({ focusMode: e.target.checked })}
          />
          Focus Mode
        </label>
        <p className={styles.description}>
          Dims sidebar and highlights current section for distraction-free reading
        </p>
      </div>

      {/* Reading Progress */}
      <div className={styles.control}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={settings.visualEffects.showProgress || false}
            onChange={(e) => updateVisualEffects({ showProgress: e.target.checked })}
          />
          Show Reading Progress
        </label>
        <p className={styles.description}>
          Display progress bar and reading time estimates
        </p>
      </div>

      {/* Section Highlighting */}
      <div className={styles.control}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={settings.visualEffects.highlightCurrentSection || false}
            onChange={(e) => updateVisualEffects({ highlightCurrentSection: e.target.checked })}
          />
          Highlight Current Section
        </label>
        <p className={styles.description}>
          Subtly highlight the section you're currently reading
        </p>
      </div>

      {/* Background Texture */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="background-texture">
          Background Texture
        </label>
        <select
          id="background-texture"
          className={styles.select}
          value={settings.visualEffects.backgroundTexture}
          onChange={(e) => updateVisualEffects({
            backgroundTexture: e.target.value as any
          })}
        >
          {backgroundTextureOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Background Gradient */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="background-gradient">
          Background Gradient
        </label>
        <select
          id="background-gradient"
          className={styles.select}
          value={settings.visualEffects.backgroundGradient ?? 'none'}
          onChange={(e) => updateVisualEffects({
            backgroundGradient: e.target.value as any
          })}
        >
          {backgroundGradientOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className={styles.description}>
          Add subtle gradient overlays to enhance visual depth
        </p>
      </div>

      {/* Text Shadow */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="text-shadow">
          Text Shadow
        </label>
        <select
          id="text-shadow"
          className={styles.select}
          value={settings.visualEffects.textShadow ?? 'none'}
          onChange={(e) => updateVisualEffects({
            textShadow: e.target.value as any
          })}
        >
          {textShadowOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className={styles.description}>
          Add text shadows to improve readability and visual depth
        </p>
        <div className={styles.textShadowPreview}>
          <span className={styles.previewText} style={{ textShadow: 'var(--customization-text-shadow)' }}>
            Preview text with current shadow
          </span>
        </div>
      </div>

      {/* Border Style */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="border-style">
          Border Style
        </label>
        <select
          id="border-style"
          className={styles.select}
          value={settings.visualEffects.borderStyle}
          onChange={(e) => updateVisualEffects({
            borderStyle: e.target.value as any
          })}
        >
          {borderStyleOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sidebar Opacity */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="sidebar-opacity">
          Sidebar Opacity: {Math.round(settings.visualEffects.sidebarOpacity * 100)}%
        </label>
        <input
          id="sidebar-opacity"
          type="range"
          className={styles.slider}
          min="0.3"
          max="1.0"
          step="0.1"
          value={settings.visualEffects.sidebarOpacity}
          onChange={(e) => updateVisualEffects({
            sidebarOpacity: parseFloat(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>30%</span>
          <span>100%</span>
        </div>
      </div>


    </div>
  );
}
