import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';
import styles from './ThemeControls.module.css';

interface ThemeControlsProps {
  className?: string;
}

export function ThemeControls({ className }: ThemeControlsProps) {
  const { settings, updateTheme, updateColors } = useCustomization();

  const themeOptions = [
    { value: 'light', label: 'Light', description: 'Clean white background' },
    { value: 'dark', label: 'Dark', description: 'Comfortable dark theme' },
    { value: 'true-dark', label: 'True Dark', description: 'Pure black for OLED' },
    { value: 'sepia', label: 'Sepia', description: 'Warm, paper-like' },
    { value: 'high-contrast', label: 'High Contrast', description: 'Maximum readability' },
    { value: 'blue-light-filter', label: 'Blue Light Filter', description: 'Reduced blue light' },
    { value: 'custom', label: 'Custom', description: 'Your own colors' },
  ];

  const codeThemeOptions = [
    { value: 'default', label: 'Default' },
    { value: 'github', label: 'GitHub' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'solarized-light', label: 'Solarized Light' },
    { value: 'solarized-dark', label: 'Solarized Dark' },
  ];

  // Vibrant accent color palettes
  const accentColorPalettes = [
    { name: 'Blue', primary: '#3182ce', hover: '#2c5aa0', active: '#2a69ac', description: 'Classic blue' },
    { name: 'Coral', primary: '#ff6b6b', hover: '#ff5252', active: '#e53e3e', description: 'Warm coral' },
    { name: 'Teal', primary: '#38b2ac', hover: '#319795', active: '#2c7a7b', description: 'Ocean teal' },
    { name: 'Purple', primary: '#805ad5', hover: '#6b46c1', active: '#553c9a', description: 'Royal purple' },
    { name: 'Emerald', primary: '#10b981', hover: '#059669', active: '#047857', description: 'Fresh emerald' },
    { name: 'Orange', primary: '#f56500', hover: '#dd6b20', active: '#c05621', description: 'Vibrant orange' },
    { name: 'Pink', primary: '#ed64a6', hover: '#d53f8c', active: '#b83280', description: 'Bright pink' },
    { name: 'Indigo', primary: '#667eea', hover: '#5a67d8', active: '#4c51bf', description: 'Deep indigo' },
  ];

  const applyAccentColorPalette = (palette: typeof accentColorPalettes[0]) => {
    updateTheme({
      accentColor: palette.primary
    });
    updateColors({
      accentColors: {
        primary: palette.primary,
        hover: palette.hover,
        active: palette.active,
      },
    });
  };

  const applyThemePreset = (themeMode: string) => {
    const presets = {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#2d3748',
        accentColor: '#3182ce',
        sidebarBackgroundColor: '#f7fafc',
        borderColor: '#e2e8f0',
      },
      dark: {
        backgroundColor: '#0f1419', // Deeper, warmer dark background
        textColor: '#f0f6fc', // Higher contrast white with slight warmth
        accentColor: '#7dd3fc', // Softer cyan with reduced blue light
        sidebarBackgroundColor: '#1c2128', // Slightly lighter than main bg
        borderColor: '#30363d', // Better contrast borders
      },
      'true-dark': {
        backgroundColor: '#000000', // Pure black for OLED screens
        textColor: '#ffffff', // Pure white for maximum contrast
        accentColor: '#00d4aa', // Bright teal that's easy on eyes
        sidebarBackgroundColor: '#0a0a0a', // Very subtle gray
        borderColor: '#1a1a1a', // Minimal borders
      },
      sepia: {
        backgroundColor: '#f7f3e9',
        textColor: '#5d4e37',
        accentColor: '#8b4513',
        sidebarBackgroundColor: '#f0ead6',
        borderColor: '#d2b48c',
      },
      'high-contrast': {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        accentColor: '#0066cc',
        sidebarBackgroundColor: '#f5f5f5',
        borderColor: '#333333',
      },
      'blue-light-filter': {
        backgroundColor: '#fef7e0', // Warmer, more amber background
        textColor: '#4a4a4a', // Higher contrast dark gray
        accentColor: '#d97706', // Warm amber accent instead of blue
        sidebarBackgroundColor: '#f6f1e8', // Subtle warm sidebar
        borderColor: '#d6d3d1', // Soft warm borders
      },
    };

    const preset = presets[themeMode as keyof typeof presets];
    if (preset) {
      updateTheme({ mode: themeMode as any, ...preset });
      // Also update color settings to match the theme
      updateColors({
        backgroundColors: {
          primary: preset.backgroundColor,
          secondary: preset.sidebarBackgroundColor,
          sidebar: preset.sidebarBackgroundColor,
        },
        textColors: {
          primary: preset.textColor,
          secondary: preset.textColor,
          muted: preset.textColor,
        },
        accentColors: {
          primary: preset.accentColor,
          hover: preset.accentColor,
          active: preset.accentColor,
        },
      });
    }
  };

  return (
    <div className={`${styles.themeControls} ${className || ''}`}>
      <h3 className={styles.title}>Theme</h3>

      {/* Theme Mode */}
      <div className={styles.control}>
        <label className={styles.label}>Theme Mode</label>
        <div className={styles.themeGrid}>
          {themeOptions.map(option => (
            <button
              key={option.value}
              className={`${styles.themeOption} ${
                settings.theme.mode === option.value ? styles.active : ''
              }`}
              onClick={() => {
                if (option.value !== 'custom') {
                  applyThemePreset(option.value);
                } else {
                  updateTheme({ mode: 'custom' });
                }
              }}
            >
              <div className={styles.themePreview} data-theme={option.value}></div>
              <div className={styles.themeInfo}>
                <div className={styles.themeName}>{option.label}</div>
                <div className={styles.themeDescription}>{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Palettes */}
      <div className={styles.control}>
        <label className={styles.label}>Accent Color Palette</label>
        <div className={styles.colorPaletteGrid}>
          {accentColorPalettes.map(palette => (
            <button
              key={palette.name}
              className={`${styles.colorPalette} ${
                settings.theme.accentColor === palette.primary ? styles.active : ''
              }`}
              onClick={() => applyAccentColorPalette(palette)}
              title={`${palette.name} - ${palette.description}`}
            >
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: palette.primary }}
              ></div>
              <div className={styles.colorName}>{palette.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors (when custom theme is selected) */}
      {settings.theme.mode === 'custom' && (
        <>
          <div className={styles.control}>
            <label className={styles.label} htmlFor="bg-color">
              Background Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="bg-color"
                type="color"
                value={settings.theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={settings.theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className={styles.colorText}
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className={styles.control}>
            <label className={styles.label} htmlFor="text-color">
              Text Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="text-color"
                type="color"
                value={settings.theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={settings.theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className={styles.colorText}
                placeholder="#2d3748"
              />
            </div>
          </div>

          <div className={styles.control}>
            <label className={styles.label} htmlFor="accent-color">
              Accent Color
            </label>
            <div className={styles.colorInput}>
              <input
                id="accent-color"
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className={styles.colorPicker}
              />
              <input
                type="text"
                value={settings.theme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className={styles.colorText}
                placeholder="#3182ce"
              />
            </div>
          </div>
        </>
      )}

      {/* Code Block Theme */}
      <div className={styles.control}>
        <label className={styles.label} htmlFor="code-theme">
          Code Block Theme
        </label>
        <select
          id="code-theme"
          className={styles.select}
          value={settings.colors.codeBlockTheme}
          onChange={(e) => updateColors({
            codeBlockTheme: e.target.value as any
          })}
        >
          {codeThemeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Auto Theme Options */}
      <div className={styles.toggleSection}>
        <div className={styles.control}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={settings.theme.autoTheme}
              onChange={(e) => updateTheme({ autoTheme: e.target.checked })}
            />
            Follow system theme
          </label>
        </div>

        <div className={styles.control}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={settings.theme.scheduleTheme}
              onChange={(e) => updateTheme({ scheduleTheme: e.target.checked })}
            />
            Auto-switch based on time
          </label>
        </div>
      </div>
    </div>
  );
}
