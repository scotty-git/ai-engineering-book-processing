import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Typography Settings Interface
interface TypographySettings {
  fontFamily: 'inter' | 'georgia' | 'times' | 'system-ui' | 'jetbrains-mono';
  fontSize: number; // 14-24px
  fontWeight: '100' | '200' | '300' | '350' | '400' | '450' | '500' | '550' | '600' | '650' | '700' | '750' | '800' | '900';
  lineHeight: number; // 1.0-2.5
  letterSpacing: number; // -0.05 to 0.1em
  headingLetterSpacing: number; // -0.1 to 0.2em (wider range for headings)
  paragraphIndent: 'none' | 'small' | 'large';
  dropCaps: boolean;
  textRendering: 'auto' | 'optimizeSpeed' | 'optimizeLegibility';
  hyphenation: boolean;
}

// Reading Layout Settings Interface
interface ReadingLayoutSettings {
  contentWidth: 'narrow' | 'medium' | 'wide' | 'full';
  contentWidthPx: number; // 600, 800, 1000, 100%
  paragraphSpacing: 'compact' | 'normal' | 'relaxed';
  textAlignment: 'left' | 'justify' | 'center';
  marginHorizontal: number; // 0-100px
}

// Theme Settings Interface
interface ThemeSettings {
  mode: 'light' | 'dark' | 'true-dark' | 'sepia' | 'high-contrast' | 'blue-light-filter' | 'custom';
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  sidebarBackgroundColor: string;
  borderColor: string;
  autoTheme: boolean; // Follow system preference
  scheduleTheme: boolean; // Auto-switch based on time
}

// Color Customization Settings Interface
interface ColorSettings {
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
}

// Visual Effects Settings Interface
interface VisualEffectsSettings {
  backgroundTexture: 'none' | 'paper' | 'linen' | 'canvas';
  backgroundGradient: 'none' | 'subtle' | 'warm' | 'cool' | 'vibrant';
  textShadow: 'none' | 'subtle' | 'soft' | 'crisp' | 'strong' | 'glow';
  borderStyle: 'none' | 'subtle' | 'bold' | 'rounded';
  sidebarOpacity: number; // 0.3-1.0
  overlayOpacity: number; // 0.1-0.9
  // Reading preferences
  focusMode?: boolean;
  showProgress?: boolean;
  highlightCurrentSection?: boolean;
  // Content filtering
  showFigures?: boolean;
  showTables?: boolean;
  showCodeBlocks?: boolean;
  showFootnotes?: boolean;
}

// Combined Settings Interface
interface CustomizationSettings {
  typography: TypographySettings;
  readingLayout: ReadingLayoutSettings;
  theme: ThemeSettings;
  colors: ColorSettings;
  visualEffects: VisualEffectsSettings;
}

// Default Settings
const defaultSettings: CustomizationSettings = {
  typography: {
    fontFamily: 'inter',
    fontSize: 18,
    fontWeight: '400', // Normal weight
    lineHeight: 1.6,
    letterSpacing: 0,
    headingLetterSpacing: -0.02, // Slightly tighter for headings
    paragraphIndent: 'none',
    dropCaps: false,
    textRendering: 'optimizeLegibility',
    hyphenation: false,
  },
  readingLayout: {
    contentWidth: 'medium',
    contentWidthPx: 800,
    paragraphSpacing: 'normal',
    textAlignment: 'left',
    marginHorizontal: 0,
  },
  theme: {
    mode: 'light',
    backgroundColor: '#ffffff',
    textColor: '#2d3748',
    accentColor: '#3182ce',
    sidebarBackgroundColor: '#f7fafc',
    borderColor: '#e2e8f0',
    autoTheme: false,
    scheduleTheme: false,
  },
  colors: {
    backgroundColors: {
      primary: '#ffffff',
      secondary: '#f7fafc',
      sidebar: '#f7fafc',
    },
    textColors: {
      primary: '#2d3748',
      secondary: '#4a5568',
      muted: '#718096',
    },
    accentColors: {
      primary: '#3182ce',
      hover: '#2c5aa0',
      active: '#2a69ac',
    },
    codeBlockTheme: 'default',
  },
  visualEffects: {
    backgroundTexture: 'none',
    backgroundGradient: 'none',
    textShadow: 'none',
    borderStyle: 'subtle',
    sidebarOpacity: 1.0,
    overlayOpacity: 0.3,
    // Reading preferences
    focusMode: false,
    showProgress: true,
    highlightCurrentSection: false,
    // Content filtering
    showFigures: true,
    showTables: true,
    showCodeBlocks: true,
    showFootnotes: true,
  },
};

// Preset Definitions
const presets: Record<string, CustomizationSettings> = {
  default: defaultSettings,
  comfortable: {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 19,
      lineHeight: 1.7,
      fontWeight: '400',
    },
    readingLayout: {
      ...defaultSettings.readingLayout,
      contentWidth: 'medium',
      paragraphSpacing: 'relaxed',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      showProgress: true,
    },
  },
  compact: {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: '400',
    },
    readingLayout: {
      ...defaultSettings.readingLayout,
      contentWidth: 'narrow',
      paragraphSpacing: 'compact',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      showProgress: false,
      sidebarOpacity: 0.8,
    },
  },
  focus: {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 18,
      lineHeight: 1.6,
    },
    readingLayout: {
      ...defaultSettings.readingLayout,
      contentWidth: 'medium',
      textAlignment: 'center',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      focusMode: true,
      showProgress: true,
      highlightCurrentSection: true,
    },
  },
  'dark-reader': {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 18,
      lineHeight: 1.6,
    },
    theme: {
      ...defaultSettings.theme,
      mode: 'dark',
      backgroundColor: '#0f1419',
      textColor: '#f0f6fc',
      accentColor: '#7dd3fc',
      sidebarBackgroundColor: '#1c2128',
      borderColor: '#30363d',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      showProgress: true,
    },
  },
  'high-contrast': {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 20,
      lineHeight: 1.8,
      fontWeight: '500',
    },
    readingLayout: {
      ...defaultSettings.readingLayout,
      contentWidth: 'wide',
      textAlignment: 'left',
    },
    theme: {
      ...defaultSettings.theme,
      mode: 'high-contrast',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#0066cc',
      sidebarBackgroundColor: '#f5f5f5',
      borderColor: '#333333',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      textShadow: 'none',
      borderStyle: 'bold',
    },
  },
  'sepia-classic': {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 19,
      lineHeight: 1.7,
      fontFamily: 'georgia',
    },
    theme: {
      ...defaultSettings.theme,
      mode: 'sepia',
      backgroundColor: '#f7f3e9',
      textColor: '#5c4b37',
      accentColor: '#8b4513',
      sidebarBackgroundColor: '#f0ead6',
      borderColor: '#d4c4a8',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      focusMode: true,
      showProgress: true,
    },
  },
  'modern-minimal': {
    ...defaultSettings,
    typography: {
      ...defaultSettings.typography,
      fontSize: 17,
      lineHeight: 1.6,
      fontFamily: 'system-ui',
      fontWeight: '350',
    },
    readingLayout: {
      ...defaultSettings.readingLayout,
      contentWidth: 'medium',
      paragraphSpacing: 'normal',
    },
    theme: {
      ...defaultSettings.theme,
      backgroundColor: '#fafafa',
      textColor: '#1a1a1a',
      accentColor: '#2563eb',
      sidebarBackgroundColor: '#f5f5f5',
      borderColor: '#e5e5e5',
    },
    visualEffects: {
      ...defaultSettings.visualEffects,
      backgroundTexture: 'none',
      borderStyle: 'subtle',
    },
  },
};

// Action Types
type CustomizationAction =
  | { type: 'UPDATE_TYPOGRAPHY'; payload: Partial<TypographySettings> }
  | { type: 'UPDATE_READING_LAYOUT'; payload: Partial<ReadingLayoutSettings> }
  | { type: 'UPDATE_THEME'; payload: Partial<ThemeSettings> }
  | { type: 'UPDATE_COLORS'; payload: Partial<ColorSettings> }
  | { type: 'UPDATE_VISUAL_EFFECTS'; payload: Partial<VisualEffectsSettings> }
  | { type: 'RESET_TO_DEFAULT' }
  | { type: 'LOAD_SETTINGS'; payload: CustomizationSettings }
  | { type: 'APPLY_PRESET'; payload: string };

// Reducer
function customizationReducer(
  state: CustomizationSettings,
  action: CustomizationAction
): CustomizationSettings {
  switch (action.type) {
    case 'UPDATE_TYPOGRAPHY':
      return {
        ...state,
        typography: { ...state.typography, ...action.payload },
      };
    case 'UPDATE_READING_LAYOUT':
      return {
        ...state,
        readingLayout: { ...state.readingLayout, ...action.payload },
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        theme: { ...state.theme, ...action.payload },
      };
    case 'UPDATE_COLORS':
      return {
        ...state,
        colors: { ...state.colors, ...action.payload },
      };
    case 'UPDATE_VISUAL_EFFECTS':
      return {
        ...state,
        visualEffects: { ...state.visualEffects, ...action.payload },
      };
    case 'RESET_TO_DEFAULT':
      return defaultSettings;
    case 'LOAD_SETTINGS':
      return action.payload;
    case 'APPLY_PRESET':
      const preset = presets[action.payload];
      return preset || state;
    default:
      return state;
  }
}

// Context Interface
interface CustomizationContextType {
  settings: CustomizationSettings;
  updateTypography: (settings: Partial<TypographySettings>) => void;
  updateReadingLayout: (settings: Partial<ReadingLayoutSettings>) => void;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  updateColors: (settings: Partial<ColorSettings>) => void;
  updateVisualEffects: (settings: Partial<VisualEffectsSettings>) => void;
  resetToDefault: () => void;
  applyPreset: (presetId: string) => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

// Create Context
const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

// Storage Key
const STORAGE_KEY = 'ai-engineering-viewer-customization';

// Provider Component
interface CustomizationProviderProps {
  children: ReactNode;
}

export function CustomizationProvider({ children }: CustomizationProviderProps) {
  const [settings, dispatch] = useReducer(customizationReducer, defaultSettings);

  // Migrate old settings to new format
  const migrateSettings = (oldSettings: any): CustomizationSettings => {
    return {
      ...defaultSettings,
      ...oldSettings,
      typography: {
        ...defaultSettings.typography,
        ...oldSettings.typography,
        // Ensure new properties have default values
        headingLetterSpacing: oldSettings.typography?.headingLetterSpacing ?? defaultSettings.typography.headingLetterSpacing,
      },
      visualEffects: {
        ...defaultSettings.visualEffects,
        ...oldSettings.visualEffects,
        // Ensure new properties have default values
        backgroundGradient: oldSettings.visualEffects?.backgroundGradient ?? defaultSettings.visualEffects.backgroundGradient,
        textShadow: oldSettings.visualEffects?.textShadow ?? defaultSettings.visualEffects.textShadow,
      },
    };
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        const migratedSettings = migrateSettings(parsedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: migratedSettings });
      }
    } catch (error) {
      console.warn('Failed to load customization settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save customization settings:', error);
    }
  }, [settings]);

  // Context value
  const contextValue: CustomizationContextType = {
    settings,
    updateTypography: (payload) => dispatch({ type: 'UPDATE_TYPOGRAPHY', payload }),
    updateReadingLayout: (payload) => dispatch({ type: 'UPDATE_READING_LAYOUT', payload }),
    updateTheme: (payload) => dispatch({ type: 'UPDATE_THEME', payload }),
    updateColors: (payload) => dispatch({ type: 'UPDATE_COLORS', payload }),
    updateVisualEffects: (payload) => dispatch({ type: 'UPDATE_VISUAL_EFFECTS', payload }),
    resetToDefault: () => dispatch({ type: 'RESET_TO_DEFAULT' }),
    applyPreset: (presetId: string) => dispatch({ type: 'APPLY_PRESET', payload: presetId }),
    exportSettings: () => JSON.stringify(settings, null, 2),
    importSettings: (settingsJson: string) => {
      try {
        const parsedSettings = JSON.parse(settingsJson);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings });
        return true;
      } catch {
        return false;
      }
    },
  };

  return (
    <CustomizationContext.Provider value={contextValue}>
      {children}
    </CustomizationContext.Provider>
  );
}

// Hook to use customization context
export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}

// Export types for use in other components
export type {
  CustomizationSettings,
  TypographySettings,
  ReadingLayoutSettings,
  ThemeSettings,
  ColorSettings,
  VisualEffectsSettings,
};