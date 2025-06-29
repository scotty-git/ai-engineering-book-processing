# Changelog

All notable changes to the AI Engineering Book Viewer project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-06-29

### 📝 Revolutionary Note-Taking System

#### New Features
- **Highlight-to-Note Creation**: Select any text to create contextual annotations
  - Intuitive text selection with popup for quick note creation
  - Rich text editor with full formatting capabilities
  - Color coding system with 8 customizable highlight colors
- **Collapsible Notes Sidebar**: Comprehensive note management interface
  - Right-side panel that doesn't interfere with reading
  - Auto-opens when creating notes, manual toggle available
  - Responsive design with mobile overlay support
- **Visual Note Indicators**: Dotted underlines show existing notes in text
  - Subtle, non-intrusive indicators for easy note discovery
  - Theme-aware styling that adapts to all customization options
  - Hover previews showing note content snippets
- **Advanced Note Organization**: Full-featured note management system
  - Tag system for categorizing and organizing notes
  - Search functionality across all note content
  - Filter by tags, sort by date or alphabetical order
  - Note statistics and summary information
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation
  - `Ctrl+Shift+N` (Mac: `Cmd+Shift+N`) to toggle notes sidebar
  - `N` to create note from selected text
  - `Ctrl+Enter` (Mac: `Cmd+Enter`) to save notes
  - `Escape` to close notes interface
- **Collaborative Foundation**: Architecture ready for multi-user features
  - User-aware data structures for future sharing capabilities
  - Permission system framework for public/private notes
  - Real-time collaboration infrastructure in place

#### UI/UX Improvements
- **Settings Integration**: Moved customization settings to navigation sidebar
  - Removed floating settings button for cleaner interface
  - Settings pinned to bottom of navigation for easy access
  - Future-ready area for additional user controls
- **Enhanced Navigation**: Fixed chapter navigation conflicts
  - Improved event handling to separate navigation from note interactions
  - Better text selection filtering to avoid UI element interference
  - Smoother chapter switching and content loading

#### Technical Enhancements
- **Advanced Text Selection**: Sophisticated text range detection system
  - Precise character-level highlighting with DOM range persistence
  - Reliable element targeting using content area markers
  - Cross-browser compatibility for text selection and highlighting
- **State Management**: Comprehensive notes state management
  - React Context for centralized notes state
  - localStorage persistence with automatic save/restore
  - Export/import functionality for sharing notes between devices
- **Performance Optimizations**: Efficient rendering and event handling
  - Smart highlight application with minimal DOM manipulation
  - Optimized event listeners with proper cleanup
  - Lazy loading and caching for note-related operations

### 🔧 Bug Fixes
- Fixed chapter navigation interference from text selection events
- Improved text range persistence across content updates
- Enhanced mobile touch handling for note creation
- Better error handling for highlight application failures

## [2.1.0] - 2025-06-29

### 🎨 Major Color & Theme Enhancements

#### New Features
- **Vibrant Accent Color Palettes**: 8 new accent color options with interactive selection
  - Blue, Coral, Teal, Purple, Emerald, Orange, Pink, and Indigo
  - Each palette includes primary, hover, and active color variations
  - Visual color swatches with hover effects and mobile-responsive design
- **Enhanced Dark Mode**: Completely redesigned dark themes for better eye comfort
  - **Improved Dark Theme**: Warmer, deeper backgrounds with better contrast ratios
  - **New True Dark Theme**: Pure black backgrounds optimized for OLED screens
  - **Enhanced Blue Light Filter**: Warmer amber tones with reduced blue light exposure
- **Subtle Background Gradients**: 5 gradient options that adapt to light/dark themes
  - None, Subtle, Warm, Cool, and Vibrant gradient overlays
  - Theme-aware gradients that enhance visual depth without distraction
- **Enhanced Link Hover Effects**: Smooth animations and improved visual feedback
  - Cubic-bezier easing transitions with subtle lift animations
  - Animated underline effects that expand from center
  - Background color highlights and enhanced active states
- **Custom Text Selection Colors**: Selection colors that match active theme
  - Proper contrast ratios for readability across all themes
  - Special styling for links and content areas with cross-browser compatibility
- **Improved Focus Ring Styling**: Beautiful keyboard navigation indicators
  - Theme-matching focus colors with layered box-shadow effects
  - Focus-visible support for keyboard-only navigation
  - Skip link accessibility features

### ✍️ Advanced Typography Enhancements

#### New Typography Controls
- **Fine-tuned Line Height**: Expanded range from 1.0 to 2.5 with 0.05 step increments
  - Quick preset buttons: Compact (1.25), Normal (1.6), Relaxed (1.8), Spacious (2.0)
  - Better labeling with descriptive terms for optimal reading comfort
- **Heading Letter Spacing**: Separate controls specifically for headings (h1-h6)
  - Range from -0.1em to 0.2em with quick presets: Tight, Normal, Loose
  - Applied universally to all heading levels for consistent typography
- **Granular Font Weight Options**: 14 precise font weight variations
  - From 100 (Thin) to 900 (Black) including intermediate weights
  - 350 (Book), 450 (Medium Light), 550 (Demi Bold), 650 (Bold Light)
  - Quick preset buttons for common weights with proper numeric values
- **Advanced Text Shadow Effects**: 6 shadow options with theme-aware adaptation
  - None, Subtle, Soft, Crisp, Strong, and Glow effects
  - Live preview in settings panel with optimized readability enhancement
- **Perfect Heading Hierarchy**: Redesigned h1-h6 scale with modular proportions
  - Based on 1.25 ratio for harmonious visual relationships
  - Enhanced spacing, line heights, and font weights for each level
  - Mobile-responsive scaling that maintains hierarchy on all screen sizes
- **Enhanced Quote Styling**: Beautiful blockquote treatment with visual depth
  - Gradient backgrounds, decorative quote marks, and smooth hover animations
  - Citation support with proper attribution formatting
  - Pull quotes for emphasis and enhanced inline quote styling

### 🔧 Technical Improvements

#### Architecture Enhancements
- **RGB Color Variables**: Added for rgba() transparency effects throughout the UI
- **Theme-Aware Functions**: Dynamic color and gradient generation based on current theme
- **Settings Migration**: Automatic upgrade of old settings to include new properties
- **Error Handling**: Robust fallback values for undefined settings properties
- **Link Behavior**: All external links now open in new tabs with proper security attributes

#### Bug Fixes
- **Drop Caps Completely Removed**: Comprehensive CSS overrides to eliminate large first letters
  - Added global CSS rules with !important declarations
  - Prevents any external or browser default drop cap styling
- **Settings Panel Stability**: Fixed crashes when opening customization panel
  - Added fallback values for new properties in existing localStorage settings
  - Implemented settings migration for seamless upgrades
- **External Link Handling**: Links now open in new tabs to preserve reading session
  - Added target="_blank" and rel="noopener noreferrer" to all external links
  - Internal anchor links (#) remain in same tab for navigation

## [2.0.1] - 2025-06-29

### 🎨 UI/UX Improvements

#### Fixed
- **Drop Caps Removed**: Disabled decorative large first letters (drop caps) that were appearing at the start of paragraphs
  - Commented out CSS rules in `ParagraphRenderer.module.css` and `customization.css`
  - Improves text readability and reduces visual clutter
  - Maintains cleaner, more professional text presentation
- **Export/Import Settings**: Removed export/import functionality from customization UI as requested
  - Simplified settings interface by removing unnecessary complexity
  - Focused on core customization features that users actually need

#### Technical Changes
- Updated CSS styling system to disable `::first-letter` pseudo-element styling
- Maintained CSS rules as comments for potential future restoration
- Preserved all other customization functionality intact

## [2.0.0] - 2025-06-29

### 🎨 Revolutionary Customization System

This major release introduces a comprehensive customization system that transforms the AI Engineering Book Viewer into one of the most customizable reading applications available.

### ✨ Added

#### Comprehensive Customization Features
- **Typography Controls**: Complete control over font family, size, weight, line height, letter spacing, drop caps, and hyphenation
- **Layout Management**: Content width, paragraph spacing, text alignment, margins, and indentation options
- **Advanced Theme System**: Light, Dark, Sepia, High Contrast, Blue Light Filter themes plus custom theme builder
- **Reading Experience**: Focus mode, progress indicators, section highlighting, and background textures
- **Content Filtering**: Granular control over figures, tables, code blocks, and footnotes visibility
- **Visual Effects**: Text shadows, border styles, sidebar opacity, and background texture options

#### Settings Management
- **Persistent Storage**: Automatic save/restore of all preferences via localStorage
- **Export/Import**: JSON-based settings sharing between devices and users
- **Quick Presets**: One-click optimization for Reading Focus, Accessibility, and Compact modes
- **Live Preview**: Instant visual feedback for all customization changes
- **Reset Functionality**: One-click return to default settings

#### User Interface
- **Settings Panel**: Professional tabbed interface with Typography, Layout, Theme, and Reading tabs
- **Keyboard Shortcuts**: Ctrl+, to open settings, Escape to close
- **Mobile Optimized**: Full customization support on all device sizes
- **Responsive Design**: Settings panel adapts to screen size with touch-friendly controls

#### Technical Architecture
- **React Context**: Centralized customization state management
- **CSS Custom Properties**: Dynamic theming with 50+ CSS variables
- **Performance Optimized**: Debounced updates and efficient re-rendering
- **Type Safety**: Comprehensive TypeScript interfaces for all customization options
- **Accessibility**: ARIA labels, keyboard navigation, and high contrast support

### 🔧 Technical Implementation

#### New Components
- `CustomizationPanel`: Main settings panel with floating interface
- `SettingsPanel`: Tabbed settings interface with category organization
- `FontControls`: Typography customization controls
- `LayoutControls`: Layout and spacing controls
- `ThemeControls`: Theme selection and custom color controls
- `ReadingControls`: Reading preferences and content filtering

#### New Hooks
- `useCustomizationCSS`: Manages CSS variable updates for real-time theming
- Enhanced `useCustomization`: Comprehensive customization state management

#### New Context
- `CustomizationContext`: Centralized state management for all customization settings

#### CSS Architecture
- **CSS Variables**: 50+ customization variables for dynamic styling
- **Theme Presets**: Built-in theme configurations with instant switching
- **Background Textures**: SVG-based texture patterns for enhanced reading experience
- **Responsive Controls**: Mobile-optimized customization interface

### 🚀 Enhanced Features

#### Upgraded Components
- **ChapterReader**: Now respects all customization settings with live updates
- **ContentRenderer**: Content filtering support for granular control
- **AppLayout**: Focus mode support with dynamic opacity
- **All Renderers**: Typography and theme customization integration

#### Performance Improvements
- **Optimized Re-rendering**: Efficient updates with React.memo and useMemo
- **CSS Performance**: Hardware-accelerated theme switching
- **Debounced Interactions**: Smooth slider performance without lag

### 📱 Mobile & Accessibility

#### Mobile Enhancements
- **Touch-Optimized**: All customization controls work perfectly on mobile
- **Responsive Settings**: Settings panel adapts to screen size
- **Gesture Support**: Touch-friendly sliders and controls

#### Accessibility Improvements
- **High Contrast Themes**: Built-in accessibility theme options
- **Keyboard Navigation**: Full keyboard support for all customization
- **Screen Reader Support**: ARIA labels and proper focus management
- **Color Contrast**: WCAG AA compliant color combinations

### 🎯 User Experience

#### Customization Categories
1. **Typography**: 8 major typography controls with professional options
2. **Layout**: 5 layout controls for optimal reading experience
3. **Theme**: 6 built-in themes plus unlimited custom themes
4. **Reading**: 8 reading preferences and content filtering options

#### Quick Setup
- **Reading Focus Preset**: Sepia theme, larger fonts, focus mode
- **Accessibility Preset**: High contrast, larger fonts, bold borders
- **Compact Preset**: Smaller fonts, narrow content, reduced spacing

## [1.0.0] - 2025-06-27

### 🎉 Initial Release

This marks the first stable release of the AI Engineering Book Viewer, a modern React-based web application for viewing and navigating AI Engineering book content.

### ✨ Added

#### Core Features
- **Interactive Navigation**: Sidebar with expandable chapter and section navigation
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Reading Progress**: Track progress through chapters and sections
- **Content Rendering**: Support for paragraphs, headings, figures, and code blocks
- **Fast Loading**: Optimized with lazy loading and smart caching
- **Modern UI**: Clean, professional design with CSS modules

#### Technical Implementation
- **React 17.0.2**: UI library with classic JSX transform for stability
- **TypeScript**: Type safety with inline interfaces (nuclear option approach)
- **Vite**: Fast build tool and development server
- **React Router 6**: Client-side routing for navigation
- **CSS Modules**: Component-scoped styling
- **React Intersection Observer**: Lazy loading and scroll tracking

#### Components Architecture
- `AppLayout`: Main application layout with responsive sidebar
- `Sidebar`: Navigation component with expandable sections
- `NavItem`: Individual navigation items with nested support
- `ChapterReader`: Main content display component
- `ContentRenderer`: Renders different content types
- `ParagraphRenderer`: Handles paragraph content
- `HeadingRenderer`: Renders headings with proper hierarchy
- `FigureRenderer`: Displays figures and images
- `ErrorMessage`: User-friendly error display
- `LoadingSpinner`: Loading state indicator

#### Custom Hooks
- `useBookMetadata`: Fetches and manages book metadata
- `useChapterData`: Fetches and caches chapter content with smart caching
- `useReadingProgress`: Tracks reading progress and current section

#### Styling System
- CSS custom properties for consistent theming
- Mobile-first responsive design
- Professional color scheme and typography
- Accessibility-compliant color contrasts
- Smooth animations and transitions

### 🔧 Technical Decisions

#### React 17 Choice
- Chose React 17.0.2 over React 18+ for stability
- Used classic JSX transform (`jsx: "react"`) for compatibility
- Avoided new JSX runtime to prevent import issues

#### Type Safety Strategy
- Implemented "nuclear option" for type safety
- Used inline TypeScript interfaces in each component
- Avoided external type dependencies to prevent import errors
- Prioritized working code over complex type hierarchies

#### Directory Structure
- Consolidated all files in single directory (no nested structure)
- Organized components by feature (Content, Layout, Navigation, UI)
- Separated hooks and styles for maintainability

#### Build Configuration
- TypeScript with ES2020 target for modern features
- ESModuleInterop enabled for proper React imports
- Strict mode enabled for development safety
- Vite for fast development and optimized builds

### 🐛 Fixed

#### Critical Issues Resolved
- **Type Import Errors**: Resolved module resolution issues by using inline interfaces
- **Directory Structure**: Fixed nested directory problems by consolidating structure
- **React Compatibility**: Resolved JSX runtime issues with React 17 configuration
- **Content Loading**: Fixed JSON loading by ensuring proper content location
- **Build Errors**: Resolved TypeScript compilation issues with proper configuration

#### Development Experience
- Fixed hot module replacement for fast development
- Resolved dependency conflicts between React versions
- Fixed CSS module loading and scoping
- Corrected routing configuration for SPA behavior

### 📚 Documentation

#### Comprehensive Documentation Added
- **README.md**: Complete project overview with features and setup
- **DEVELOPMENT.md**: Detailed development guide with architecture details
- **TROUBLESHOOTING.md**: Common issues and solutions
- **DEPLOYMENT.md**: Deployment guide for various platforms
- **CHANGELOG.md**: This changelog documenting the journey

#### Development Resources
- Component architecture documentation
- Hook usage patterns
- Styling guidelines with CSS custom properties
- TypeScript configuration explanations
- Performance optimization strategies

### 🚀 Performance

#### Optimizations Implemented
- In-memory caching for chapter data
- Lazy loading for content sections
- Component memoization where appropriate
- Efficient re-rendering with React hooks
- Optimized bundle size with code splitting

#### Build Optimizations
- Vite for fast development server
- Hot module replacement for instant updates
- Optimized production builds
- Source maps for debugging (development only)

### 🎨 Design System

#### Visual Design
- Professional color scheme with CSS custom properties
- Consistent spacing and typography scale
- Modern border radius and shadow system
- Responsive breakpoints for all screen sizes

#### User Experience
- Intuitive navigation with clear hierarchy
- Smooth transitions and hover states
- Loading states for better perceived performance
- Error handling with user-friendly messages

### 🔒 Security

#### Security Measures
- No external dependencies for sensitive operations
- Client-side only (no server-side vulnerabilities)
- Content Security Policy ready
- Safe HTML rendering practices

### 📱 Browser Support

#### Compatibility
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+)
- ES2020 features supported
- Responsive design for all screen sizes
- Touch-friendly interface for mobile devices

### 🛠️ Development Tools

#### Developer Experience
- TypeScript for type safety
- ESLint for code quality
- Hot module replacement for fast development
- Comprehensive error messages
- Debug-friendly component structure

### 📦 Dependencies

#### Core Dependencies
```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^6.8.0",
  "react-intersection-observer": "^9.4.0"
}
```

#### Development Dependencies
```json
{
  "@types/react": "^17.0.0",
  "@types/react-dom": "^17.0.0",
  "@vitejs/plugin-react": "^4.3.4",
  "typescript": "^5.6.3",
  "vite": "^7.0.0"
}
```

### 🎯 Future Roadmap

#### Planned Features
- Search functionality across all content
- Bookmarking and note-taking capabilities
- Dark mode theme support
- Offline reading capabilities
- Export functionality (PDF, EPUB)

#### Technical Improvements
- Progressive Web App (PWA) features
- Advanced caching strategies
- Performance monitoring integration
- Accessibility enhancements
- Internationalization support

---

## Development Journey

### The Challenge
Started with a complex type system that caused numerous import errors and build failures. The original approach used external type definitions that created circular dependencies and module resolution issues.

### The Solution
Implemented a "nuclear option" approach:
1. Removed all external type dependencies
2. Used inline TypeScript interfaces in each component
3. Simplified the architecture for reliability
4. Prioritized working code over complex abstractions

### Lessons Learned
- Sometimes simpler solutions are more robust
- Type safety doesn't require complex hierarchies
- Developer experience matters more than perfect architecture
- Working code is better than perfect code that doesn't work

### Key Decisions
- **React 17 over 18**: Chose stability over latest features
- **Inline types**: Chose simplicity over reusability
- **Single directory**: Chose clarity over nested organization
- **CSS Modules**: Chose scoped styles over global CSS

This changelog will be updated with each release to track the evolution of the project.
