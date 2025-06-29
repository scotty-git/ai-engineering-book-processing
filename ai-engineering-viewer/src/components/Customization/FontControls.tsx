import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './FontControls.module.css';

interface FontControlsProps {
  className?: string;
}

export function FontControls({ className }: FontControlsProps) {
  const { settings, updateTypography } = useCustomization();

  const fontFamilyOptions = [
    { value: 'inter', label: 'Inter (Sans-serif)' },
    { value: 'georgia', label: 'Georgia (Serif)' },
    { value: 'times', label: 'Times New Roman (Serif)' },
    { value: 'system-ui', label: 'System UI (Sans-serif)' },
    { value: 'jetbrains-mono', label: 'JetBrains Mono (Monospace)' },
  ];

  const fontWeightOptions = [
    { value: '100', label: '100 - Thin' },
    { value: '200', label: '200 - Extra Light' },
    { value: '300', label: '300 - Light' },
    { value: '350', label: '350 - Book' },
    { value: '400', label: '400 - Normal' },
    { value: '450', label: '450 - Medium Light' },
    { value: '500', label: '500 - Medium' },
    { value: '550', label: '550 - Demi Bold' },
    { value: '600', label: '600 - Semi Bold' },
    { value: '650', label: '650 - Bold Light' },
    { value: '700', label: '700 - Bold' },
    { value: '750', label: '750 - Extra Bold' },
    { value: '800', label: '800 - Heavy' },
    { value: '900', label: '900 - Black' },
  ];

  return (
    <div className={`${styles.fontControls} ${className || ''}`}>
      <h3 className={styles.title}>Typography</h3>

      {/* Font Family */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="font-family">
          Font Family
        </label>
        <select
          id="font-family"
          className={styles.select}
          value={settings.typography.fontFamily}
          onChange={(e) => updateTypography({
            fontFamily: e.target.value as any
          })}
        >
          {fontFamilyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="font-size">
          Font Size: {settings.typography.fontSize}px
        </label>
        <input
          id="font-size"
          type="range"
          className={styles.slider}
          min="14"
          max="24"
          step="1"
          value={settings.typography.fontSize}
          onChange={(e) => updateTypography({
            fontSize: parseInt(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>14px</span>
          <span>24px</span>
        </div>
      </div>

      {/* Font Weight */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="font-weight">
          Font Weight: {settings.typography.fontWeight}
        </label>
        <select
          id="font-weight"
          className={styles.select}
          value={settings.typography.fontWeight}
          onChange={(e) => updateTypography({
            fontWeight: e.target.value as any
          })}
        >
          {fontWeightOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.fontWeightPresets}>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.fontWeight === '300' ? styles.active : ''}`}
            onClick={() => updateTypography({ fontWeight: '300' })}
          >
            Light
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.fontWeight === '400' ? styles.active : ''}`}
            onClick={() => updateTypography({ fontWeight: '400' })}
          >
            Normal
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.fontWeight === '500' ? styles.active : ''}`}
            onClick={() => updateTypography({ fontWeight: '500' })}
          >
            Medium
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.fontWeight === '600' ? styles.active : ''}`}
            onClick={() => updateTypography({ fontWeight: '600' })}
          >
            Semi Bold
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.fontWeight === '700' ? styles.active : ''}`}
            onClick={() => updateTypography({ fontWeight: '700' })}
          >
            Bold
          </button>
        </div>
      </div>

      {/* Line Height */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="line-height">
          Line Height: {settings.typography.lineHeight.toFixed(2)}
        </label>
        <input
          id="line-height"
          type="range"
          className={styles.slider}
          min="1.0"
          max="2.5"
          step="0.05"
          value={settings.typography.lineHeight}
          onChange={(e) => updateTypography({
            lineHeight: parseFloat(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>1.0 (Tight)</span>
          <span>1.6 (Normal)</span>
          <span>2.5 (Loose)</span>
        </div>
        <div className={styles.lineHeightPresets}>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.lineHeight === 1.25 ? styles.active : ''}`}
            onClick={() => updateTypography({ lineHeight: 1.25 })}
          >
            Compact
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.lineHeight === 1.6 ? styles.active : ''}`}
            onClick={() => updateTypography({ lineHeight: 1.6 })}
          >
            Normal
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.lineHeight === 1.8 ? styles.active : ''}`}
            onClick={() => updateTypography({ lineHeight: 1.8 })}
          >
            Relaxed
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${settings.typography.lineHeight === 2.0 ? styles.active : ''}`}
            onClick={() => updateTypography({ lineHeight: 2.0 })}
          >
            Spacious
          </button>
        </div>
      </div>

      {/* Letter Spacing */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="letter-spacing">
          Body Letter Spacing: {settings.typography.letterSpacing.toFixed(2)}em
        </label>
        <input
          id="letter-spacing"
          type="range"
          className={styles.slider}
          min="-0.05"
          max="0.1"
          step="0.01"
          value={settings.typography.letterSpacing}
          onChange={(e) => updateTypography({
            letterSpacing: parseFloat(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>-0.05em (Tight)</span>
          <span>0.1em (Loose)</span>
        </div>
      </div>

      {/* Heading Letter Spacing */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="heading-letter-spacing">
          Heading Letter Spacing: {(settings.typography.headingLetterSpacing ?? -0.02).toFixed(2)}em
        </label>
        <input
          id="heading-letter-spacing"
          type="range"
          className={styles.slider}
          min="-0.1"
          max="0.2"
          step="0.01"
          value={settings.typography.headingLetterSpacing ?? -0.02}
          onChange={(e) => updateTypography({
            headingLetterSpacing: parseFloat(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>-0.1em (Very Tight)</span>
          <span>0em (Normal)</span>
          <span>0.2em (Very Loose)</span>
        </div>
        <div className={styles.headingSpacingPresets}>
          <button
            type="button"
            className={`${styles.presetButton} ${(settings.typography.headingLetterSpacing ?? -0.02) === -0.05 ? styles.active : ''}`}
            onClick={() => updateTypography({ headingLetterSpacing: -0.05 })}
          >
            Tight
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${(settings.typography.headingLetterSpacing ?? -0.02) === -0.02 ? styles.active : ''}`}
            onClick={() => updateTypography({ headingLetterSpacing: -0.02 })}
          >
            Normal
          </button>
          <button
            type="button"
            className={`${styles.presetButton} ${(settings.typography.headingLetterSpacing ?? -0.02) === 0.05 ? styles.active : ''}`}
            onClick={() => updateTypography({ headingLetterSpacing: 0.05 })}
          >
            Loose
          </button>
        </div>
      </div>


    </div>
  );
}