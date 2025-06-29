import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './LayoutControls.module.css';

interface LayoutControlsProps {
  className?: string;
}

export function LayoutControls({ className }: LayoutControlsProps) {
  const { settings, updateReadingLayout } = useCustomization();

  const contentWidthOptions = [
    { value: 'narrow', label: 'Narrow (600px)', px: 600 },
    { value: 'medium', label: 'Medium (800px)', px: 800 },
    { value: 'wide', label: 'Wide (1000px)', px: 1000 },
    { value: 'full', label: 'Full Width', px: 0 },
  ];

  const paragraphSpacingOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
  ];

  const textAlignmentOptions = [
    { value: 'left', label: 'Left' },
    { value: 'justify', label: 'Justified' },
    { value: 'center', label: 'Center' },
  ];

  return (
    <div className={`${styles.layoutControls} ${className || ''}`}>
      <h3 className={styles.title}>Layout</h3>

      {/* Content Width */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="content-width">
          Content Width
        </label>
        <select
          id="content-width"
          className={styles.select}
          value={settings.readingLayout.contentWidth}
          onChange={(e) => {
            const selectedOption = contentWidthOptions.find(opt => opt.value === e.target.value);
            updateReadingLayout({
              contentWidth: e.target.value as any,
              contentWidthPx: selectedOption?.px || 800
            });
          }}
        >
          {contentWidthOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Width Slider (when not full width) */}
      {settings.readingLayout.contentWidth !== 'full' && (
        <div className={styles.control}>
          <label className={styles.label} htmlFor="content-width-px">
            Custom Width: {settings.readingLayout.contentWidthPx}px
          </label>
          <input
            id="content-width-px"
            type="range"
            className={styles.slider}
            min="400"
            max="1200"
            step="50"
            value={settings.readingLayout.contentWidthPx}
            onChange={(e) => updateReadingLayout({
              contentWidthPx: parseInt(e.target.value)
            })}
          />
          <div className={styles.sliderLabels}>
            <span>400px</span>
            <span>1200px</span>
          </div>
        </div>
      )}

      {/* Paragraph Spacing */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="paragraph-spacing">
          Paragraph Spacing
        </label>
        <select
          id="paragraph-spacing"
          className={styles.select}
          value={settings.readingLayout.paragraphSpacing}
          onChange={(e) => updateReadingLayout({
            paragraphSpacing: e.target.value as any
          })}
        >
          {paragraphSpacingOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Alignment */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="text-alignment">
          Text Alignment
        </label>
        <select
          id="text-alignment"
          className={styles.select}
          value={settings.readingLayout.textAlignment}
          onChange={(e) => updateReadingLayout({
            textAlignment: e.target.value as any
          })}
        >
          {textAlignmentOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Horizontal Margins */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="margin-horizontal">
          Horizontal Margins: {settings.readingLayout.marginHorizontal}px
        </label>
        <input
          id="margin-horizontal"
          type="range"
          className={styles.slider}
          min="0"
          max="100"
          step="5"
          value={settings.readingLayout.marginHorizontal}
          onChange={(e) => updateReadingLayout({
            marginHorizontal: parseInt(e.target.value)
          })}
        />
        <div className={styles.sliderLabels}>
          <span>0px</span>
          <span>100px</span>
        </div>
      </div>
    </div>
  );
}
