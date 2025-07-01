# AI Engineering Book Viewer

A modern React-based web application for viewing and navigating the AI Engineering book content with comprehensive customization options and advanced note-taking capabilities. Built with React 17, TypeScript, and Vite for optimal performance and developer experience.

## 🚀 Features

### 📖 Core Reading Experience
- **Interactive Navigation**: Sidebar with expandable chapter and section navigation
- **Responsive Design**: Mobile-friendly layout with collapsible sidebar
- **Reading Progress**: Track your progress through chapters and sections
- **Content Rendering**: Support for various content types including paragraphs, headings, figures, and code blocks
- **Fast Loading**: Optimized with lazy loading and smart caching

### 🎨 Advanced Customization System (60+ Options)
- **Vibrant Color Palettes**: 8 beautiful accent color themes (Coral, Teal, Purple, Emerald, etc.)
- **Enhanced Typography**: 14 granular font weights, advanced line height (1.0-2.5), heading letter spacing
- **Perfect Heading Hierarchy**: Modular scale typography (h1-h6) with optimal visual relationships
- **Theme Mastery**: 6 themes including True Dark for OLED and enhanced blue light filtering
- **Visual Depth**: Subtle background gradients and 6 text shadow effects with live preview
- **Smooth Interactions**: Enhanced hover effects, focus rings, and custom selection colors
- **Reading Comfort**: Fine-tuned spacing, enhanced quote styling, and smart link handling
- **Content Filtering**: Show/hide figures, tables, code blocks, footnotes
- **Layout Options**: Content width, paragraph spacing, text alignment, margins, indentation

### 📝 Advanced Note-Taking System
- **Highlight-to-Note**: Select any text to create contextual annotations with author attribution
- **Floating Notes Button**: One-click access button with note count badge (auto-hides when sidebar open)
- **Rich Hover Tooltips**: Preview note content, author, date, and tags by hovering over highlights
- **Elegant Visual Indicators**: Background highlights with colored borders for clear visibility
- **Collapsible Sidebar**: Right-side notes panel with full management capabilities
- **Interactive Highlights**: Hover effects with darkening and subtle lift animations
- **Rich Editor**: Color coding, tagging, search, and markdown support
- **Smart Organization**: Filter by tags, sort by date, search across all notes
- **Author Attribution**: All notes include author information (default: Scott)
- **Keyboard Shortcuts**: Ctrl+Shift+N (toggle sidebar), N (create note from selection)
- **Collaborative Ready**: Foundation for multi-user note sharing and real-time collaboration
- **Theme Integration**: Note indicators and tooltips respect all customization themes

### ⚙️ Advanced Features
- **Settings Persistence**: Automatic save/restore of all preferences via localStorage
- **Quick Presets**: One-click optimization for Reading Focus, Accessibility, and Compact modes
- **Keyboard Shortcuts**: Ctrl+Shift+N (notes), N (create note), Escape (close panels)
- **Live Preview**: All changes apply instantly without page refresh
- **Mobile Optimized**: Full customization support on all device sizes

## 🎯 **Current Status: Ready for Deployment**

✅ **Complete codebase committed to GitHub**
✅ **All images included via Git LFS (162 files, 29MB)**
✅ **React application fully functional**
✅ **Documentation and implementation plans complete**
✅ **Ready for immediate Vercel deployment**

**Repository**: https://github.com/scotty-git/ai-engineering-book-processing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git LFS (for image assets)

## 🛠️ Installation

1. **Install Git LFS** (required for images)
   ```bash
   # Install Git LFS if not already installed
   git lfs install
   ```

2. **Clone the repository** (includes Git LFS for images)
   ```bash
   git clone https://github.com/scotty-git/ai-engineering-book-processing.git
   cd ai-engineering-book-processing/ai-engineering-viewer
   ```

3. **Download LFS images**
   ```bash
   # Pull all LFS files (162 images, 29MB)
   git lfs pull
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Content is ready** ✅
   All book content and images are included in the repository:
   - ✅ Complete book metadata and chapter files
   - ✅ All 162 images managed via Git LFS (29MB)
   - ✅ Ready for immediate deployment

## 🚀 Development

**Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001` (or the next available port).

**Build for production**
```bash
npm run build
```

**Preview production build**
```bash
npm run preview
```

## 🎯 Customization Features

### Typography Controls
- **Font Families**: Inter, Georgia, Times New Roman, System UI, JetBrains Mono
- **Font Size**: 14-24px with precise slider control
- **Font Weight**: Light, Normal, Medium, Bold
- **Line Height**: 1.2-2.0 for optimal readability
- **Letter Spacing**: -0.05em to 0.1em fine-tuning
- **Drop Caps**: Elegant first letter styling
- **Text Rendering**: Optimization for speed or legibility
- **Hyphenation**: Automatic word breaking control

### Layout & Reading Experience
- **Content Width**: Narrow (600px), Medium (800px), Wide (1000px), or Full width
- **Custom Width**: 400-1200px slider for precise control
- **Paragraph Spacing**: Compact, Normal, or Relaxed
- **Text Alignment**: Left, Justified, or Center
- **Margins**: 0-100px horizontal margin adjustment
- **Focus Mode**: Dims sidebar for distraction-free reading
- **Reading Progress**: Progress bars and completion indicators
- **Section Highlighting**: Subtle current section emphasis

### Theme System
- **Built-in Themes**: Light, Dark, Sepia, High Contrast, Blue Light Filter
- **Custom Theme Builder**: Full color picker for background, text, and accent colors
- **Auto Theme**: Follow system dark/light mode preference
- **Scheduled Theme**: Automatic time-based theme switching
- **Code Block Themes**: Default, GitHub, Monokai, Solarized variants

### Content Filtering & Visual Effects
- **Content Types**: Toggle visibility of figures, tables, code blocks, footnotes
- **Background Textures**: None, Paper, Linen, Canvas
- **Text Shadow**: Subtle shadow for improved readability
- **Border Styles**: None, Subtle, Bold, Rounded
- **Sidebar Opacity**: 30-100% transparency control

## 🏗️ Architecture

### Technology Stack
- **React 17**: Modern UI library with concurrent features
- **TypeScript**: Type safety and enhanced developer experience
- **Vite**: Fast build tool and development server
- **React Router 6**: Client-side routing
- **CSS Modules**: Scoped styling with CSS custom properties
- **React Context**: Centralized customization state management
- **React Intersection Observer**: Lazy loading and scroll tracking

### Project Structure
```
src/
├── components/           # React components
│   ├── Content/         # Content rendering components
│   ├── Customization/   # Settings and customization controls
│   ├── Layout/          # Layout components (AppLayout)
│   ├── Navigation/      # Navigation components (Sidebar, NavItem)
│   └── UI/              # Reusable UI components
├── contexts/            # React Context providers
│   └── CustomizationContext.tsx  # Customization state management
├── hooks/               # Custom React hooks
│   ├── useCustomizationCSS.ts   # CSS variable management
│   └── ...              # Other utility hooks
├── styles/              # Global styles and CSS modules
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and CSS variables
```

## 🎮 Usage Guide

### Opening Customization Settings
- **Click**: Settings gear icon (⚙️) in the interface
- **Keyboard**: Press `Ctrl+,` (or `Cmd+,` on Mac)
- **Close**: Press `Escape` or click outside the panel

### Quick Setup with Presets
1. **Reading Focus**: Optimized for distraction-free reading
   - Sepia theme, larger fonts, focus mode enabled
2. **Accessibility**: High contrast and readability
   - High contrast theme, larger fonts, bold borders
3. **Compact**: Space-efficient layout
   - Smaller fonts, narrow content, reduced spacing

### Customizing Your Experience
1. **Typography Tab**: Adjust fonts, sizes, spacing, and text rendering
2. **Layout Tab**: Control content width, alignment, and margins
3. **Theme Tab**: Choose colors, themes, and visual appearance
4. **Reading Tab**: Configure focus mode, progress, and content filtering

### Saving and Sharing Settings
- **Auto-Save**: All changes are automatically saved to your browser
- **Export**: Download your settings as a JSON file
- **Import**: Upload a settings file to restore preferences
- **Reset**: Return to default settings with one click

## 🔧 Configuration

### TypeScript Configuration
The project uses TypeScript with the following key configurations:
- **Target**: ES2020 for modern JavaScript features
- **JSX**: React JSX transform (React 17)
- **Module Resolution**: Bundler mode for Vite compatibility
- **Strict Mode**: Enabled for type safety

### Vite Configuration
- **Port**: Defaults to 3000, falls back to 3001 if occupied
- **HMR**: Hot module replacement for fast development
- **Build**: Optimized production builds with code splitting

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full sidebar navigation with content area and floating settings panel
- **Tablet**: Collapsible sidebar with overlay and responsive settings
- **Mobile**: Hidden sidebar with hamburger menu and mobile-optimized customization

## 🎨 Styling System

- **CSS Custom Properties**: Dynamic theming with CSS variables
- **CSS Modules**: Component-scoped styling
- **Global Styles**: Consistent typography and layout system
- **Design System**: Professional color schemes and spacing scales
- **Accessibility**: WCAG compliant color contrasts and focus states
- **Live Updates**: Instant preview of all customization changes

## 🛠️ Development Notes

### Customization Architecture
- **React Context**: Centralized state management for all customization settings
- **CSS Custom Properties**: Dynamic theming with real-time CSS variable updates
- **localStorage**: Persistent settings storage with automatic save/restore
- **Type Safety**: Comprehensive TypeScript interfaces for all customization options

### Performance Optimizations
- **Lazy Loading**: Content sections load on demand
- **Intersection Observer**: Efficient scroll tracking and progress calculation
- **Memoization**: Optimized re-rendering with React.memo and useMemo
- **CSS Variables**: Hardware-accelerated theme switching
- **Debounced Updates**: Smooth slider interactions without performance impact

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for all customization controls
- **ARIA Labels**: Screen reader friendly interface
- **High Contrast**: Built-in high contrast theme option
- **Focus Management**: Proper focus handling in modal dialogs
- **Color Contrast**: WCAG AA compliant color combinations

### Browser Support
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **ES2020 Features**: Full modern JavaScript support
- **CSS Custom Properties**: Native CSS variable support
- **localStorage**: Persistent settings storage
- **Responsive Design**: All screen sizes from mobile to desktop

## 🔍 Troubleshooting

### Settings Not Saving
- Check if localStorage is enabled in your browser
- Clear browser cache and reload the application
- Try exporting/importing settings as a backup

### Performance Issues
- Disable background textures if experiencing lag
- Reduce sidebar opacity for better performance
- Use system fonts instead of custom web fonts

### Theme Not Applying
- Refresh the page to reload CSS variables
- Check if browser supports CSS custom properties
- Try resetting to default settings and reapplying

## 📄 License

This project is part of the AI Engineering book processing workflow and is intended for educational and research purposes.
