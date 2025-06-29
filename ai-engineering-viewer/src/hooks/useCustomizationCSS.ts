import { useEffect } from 'react';

// Inline interface to avoid import issues
interface CustomizationSettings {
  typography: {
    fontFamily: 'inter' | 'georgia' | 'times' | 'system-ui' | 'jetbrains-mono';
    fontSize: number;
    fontWeight: '100' | '200' | '300' | '350' | '400' | '450' | '500' | '550' | '600' | '650' | '700' | '750' | '800' | '900';
    lineHeight: number;
    letterSpacing: number;
    headingLetterSpacing: number;
    paragraphIndent: 'none' | 'small' | 'large';
    dropCaps: boolean;
    textRendering: 'auto' | 'optimizeSpeed' | 'optimizeLegibility';
    hyphenation: boolean;
  };
  readingLayout: {
    contentWidth: 'narrow' | 'medium' | 'wide' | 'full';
    contentWidthPx: number;
    paragraphSpacing: 'compact' | 'normal' | 'relaxed';
    textAlignment: 'left' | 'justify' | 'center';
    marginHorizontal: number;
  };
  theme: {
    mode: 'light' | 'dark' | 'true-dark' | 'sepia' | 'high-contrast' | 'blue-light-filter' | 'custom';
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    sidebarBackgroundColor: string;
    borderColor: string;
    autoTheme: boolean;
    scheduleTheme: boolean;
  };
  colors: {
    backgroundColors: {
      primary: string;
      secondary: string;
      sidebar: string;
    };
    textColors: {
      primary: string;
      secondary: string;
      muted: string;
    };
    accentColors: {
      primary: string;
      hover: string;
      active: string;
    };
    codeBlockTheme: 'default' | 'github' | 'monokai' | 'solarized-light' | 'solarized-dark';
  };
  visualEffects: {
    backgroundTexture: 'none' | 'paper' | 'linen' | 'canvas';
    backgroundGradient: 'none' | 'subtle' | 'warm' | 'cool' | 'vibrant';
    textShadow: 'none' | 'subtle' | 'soft' | 'crisp' | 'strong' | 'glow';
    borderStyle: 'none' | 'subtle' | 'bold' | 'rounded';
    sidebarOpacity: number;
    overlayOpacity: number;
  };
}

// Font family mappings
const fontFamilyMap = {
  'inter': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'georgia': 'Georgia, "Times New Roman", Times, serif',
  'times': '"Times New Roman", Times, serif',
  'system-ui': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  'jetbrains-mono': '"JetBrains Mono", "Fira Code", "Consolas", monospace',
};

// Content width mappings
const contentWidthMap = {
  'narrow': '600px',
  'medium': '800px',
  'wide': '1000px',
  'full': '100%',
};

// Paragraph spacing mappings
const paragraphSpacingMap = {
  'compact': '0.75rem',
  'normal': '1rem',
  'relaxed': '1.5rem',
};

// Paragraph indent mappings
const paragraphIndentMap = {
  'none': '0',
  'small': '1em',
  'large': '2em',
};

// Border style mappings
const borderStyleMap = {
  'none': 'none',
  'subtle': '1px solid var(--customization-border-color)',
  'defined': '2px solid var(--customization-border-color)',
  'bold': '3px solid var(--customization-border-color)',
};

// Background texture mappings
const backgroundTextureMap = {
  'none': 'none',
  'paper': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f5f5f5" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  'linen': 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.3"%3E%3Cpath d="M0 0h40v40H0z"/%3E%3C/g%3E%3C/svg%3E")',
  'canvas': 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23e8e8e8" fill-opacity="0.2"%3E%3Cpath d="M0 0h80v80H0z"/%3E%3C/g%3E%3C/svg%3E")',
};

// Background gradient mappings - theme-aware
const getBackgroundGradient = (gradientType: string, isDark: boolean) => {
  const gradients = {
    'none': 'none',
    'subtle': isDark
      ? 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)'
      : 'linear-gradient(135deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.03) 100%)',
    'warm': isDark
      ? 'linear-gradient(135deg, rgba(255,200,150,0.05) 0%, rgba(255,180,120,0.02) 100%)'
      : 'linear-gradient(135deg, rgba(255,248,220,0.3) 0%, rgba(255,235,205,0.1) 100%)',
    'cool': isDark
      ? 'linear-gradient(135deg, rgba(150,200,255,0.05) 0%, rgba(120,180,255,0.02) 100%)'
      : 'linear-gradient(135deg, rgba(240,248,255,0.3) 0%, rgba(230,245,255,0.1) 100%)',
    'vibrant': isDark
      ? 'linear-gradient(135deg, rgba(255,100,150,0.03) 0%, rgba(100,200,255,0.03) 50%, rgba(200,100,255,0.03) 100%)'
      : 'linear-gradient(135deg, rgba(255,182,193,0.1) 0%, rgba(173,216,230,0.1) 50%, rgba(221,160,221,0.1) 100%)',
  };
  return gradients[gradientType as keyof typeof gradients] || 'none';
};

// Text shadow mappings - theme-aware
const getTextShadow = (shadowType: string, isDark: boolean) => {
  const shadows = {
    'none': 'none',
    'subtle': isDark
      ? '0 1px 2px rgba(0, 0, 0, 0.3)'
      : '0 1px 2px rgba(0, 0, 0, 0.1)',
    'soft': isDark
      ? '0 2px 4px rgba(0, 0, 0, 0.4)'
      : '0 1px 3px rgba(0, 0, 0, 0.15)',
    'crisp': isDark
      ? '1px 1px 2px rgba(0, 0, 0, 0.5)'
      : '1px 1px 2px rgba(0, 0, 0, 0.2)',
    'strong': isDark
      ? '0 2px 6px rgba(0, 0, 0, 0.6)'
      : '0 2px 4px rgba(0, 0, 0, 0.25)',
    'glow': isDark
      ? '0 0 4px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)'
      : '0 0 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.15)',
  };
  return shadows[shadowType as keyof typeof shadows] || 'none';
};

// Theme presets
const themePresets = {
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

/**
 * Hook to apply customization settings to CSS custom properties
 */
export function useCustomizationCSS(settings: CustomizationSettings) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply typography settings
    root.style.setProperty('--customization-font-family', fontFamilyMap[settings.typography.fontFamily]);
    root.style.setProperty('--customization-font-size', `${settings.typography.fontSize}px`);
    root.style.setProperty('--customization-font-weight', settings.typography.fontWeight);
    root.style.setProperty('--customization-line-height', settings.typography.lineHeight.toString());
    root.style.setProperty('--customization-letter-spacing', `${settings.typography.letterSpacing}em`);
    root.style.setProperty('--customization-heading-letter-spacing', `${settings.typography.headingLetterSpacing}em`);
    root.style.setProperty('--customization-paragraph-indent', paragraphIndentMap[settings.typography.paragraphIndent]);
    root.style.setProperty('--customization-text-rendering', settings.typography.textRendering);
    root.style.setProperty('--customization-hyphens', settings.typography.hyphenation ? 'auto' : 'none');

    // Apply reading layout settings
    root.style.setProperty('--customization-content-width', contentWidthMap[settings.readingLayout.contentWidth]);
    root.style.setProperty('--customization-content-width-px', `${settings.readingLayout.contentWidthPx}px`);
    root.style.setProperty('--customization-paragraph-spacing', paragraphSpacingMap[settings.readingLayout.paragraphSpacing]);
    root.style.setProperty('--customization-text-align', settings.readingLayout.textAlignment);
    root.style.setProperty('--customization-margin-horizontal', `${settings.readingLayout.marginHorizontal}px`);

    // Apply theme settings
    const themeColors = settings.theme.mode === 'custom'
      ? {
          backgroundColor: settings.theme.backgroundColor,
          textColor: settings.theme.textColor,
          accentColor: settings.theme.accentColor,
          sidebarBackgroundColor: settings.theme.sidebarBackgroundColor,
          borderColor: settings.theme.borderColor,
        }
      : themePresets[settings.theme.mode] || themePresets.light;

    root.style.setProperty('--customization-bg-color', themeColors.backgroundColor);
    root.style.setProperty('--customization-text-color', themeColors.textColor);
    root.style.setProperty('--customization-accent-color', themeColors.accentColor);
    root.style.setProperty('--customization-sidebar-bg-color', themeColors.sidebarBackgroundColor);
    root.style.setProperty('--customization-border-color', themeColors.borderColor);

    // Also update secondary variables to ensure consistency
    root.style.setProperty('--customization-text-primary', themeColors.textColor);
    root.style.setProperty('--customization-accent-primary', themeColors.accentColor);
    root.style.setProperty('--customization-accent-hover', themeColors.accentColor);

    // Apply color settings
    root.style.setProperty('--customization-bg-primary', settings.colors.backgroundColors.primary);
    root.style.setProperty('--customization-bg-secondary', settings.colors.backgroundColors.secondary);
    root.style.setProperty('--customization-bg-sidebar', settings.colors.backgroundColors.sidebar);
    root.style.setProperty('--customization-text-primary', settings.colors.textColors.primary);
    root.style.setProperty('--customization-text-secondary', settings.colors.textColors.secondary);
    root.style.setProperty('--customization-text-muted', settings.colors.textColors.muted);
    root.style.setProperty('--customization-accent-primary', settings.colors.accentColors.primary);
    root.style.setProperty('--customization-accent-hover', settings.colors.accentColors.hover);
    root.style.setProperty('--customization-accent-active', settings.colors.accentColors.active);

    // Convert accent color to RGB for rgba() usage
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
        '49, 130, 206'; // fallback blue
    };
    root.style.setProperty('--customization-accent-rgb', hexToRgb(settings.colors.accentColors.primary));

    // Apply visual effects
    const isDarkTheme = settings.theme.mode === 'dark' || settings.theme.mode === 'true-dark';
    root.style.setProperty('--customization-background-texture', backgroundTextureMap[settings.visualEffects.backgroundTexture]);
    root.style.setProperty('--customization-background-gradient', getBackgroundGradient(settings.visualEffects.backgroundGradient, isDarkTheme));
    root.style.setProperty('--customization-text-shadow', getTextShadow(settings.visualEffects.textShadow, isDarkTheme));
    root.style.setProperty('--customization-border-style', borderStyleMap[settings.visualEffects.borderStyle]);
    root.style.setProperty('--customization-sidebar-opacity', settings.visualEffects.sidebarOpacity.toString());
    root.style.setProperty('--customization-overlay-opacity', settings.visualEffects.overlayOpacity.toString());

    // Apply drop caps styling
    root.style.setProperty('--customization-drop-caps-display', settings.typography.dropCaps ? 'block' : 'none');

    // Apply reading preferences
    root.style.setProperty('--customization-focus-mode', settings.visualEffects.focusMode ? '1' : '0');
    root.style.setProperty('--customization-show-progress', settings.visualEffects.showProgress ? '1' : '0');
    root.style.setProperty('--customization-highlight-section', settings.visualEffects.highlightCurrentSection ? '1' : '0');

    // Apply content filtering
    root.style.setProperty('--customization-show-figures', settings.visualEffects.showFigures !== false ? '1' : '0');
    root.style.setProperty('--customization-show-tables', settings.visualEffects.showTables !== false ? '1' : '0');
    root.style.setProperty('--customization-show-code', settings.visualEffects.showCodeBlocks !== false ? '1' : '0');
    root.style.setProperty('--customization-show-footnotes', settings.visualEffects.showFootnotes !== false ? '1' : '0');

  }, [settings]);
}