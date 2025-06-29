# Development Guide

This document provides detailed information for developers working on the AI Engineering Book Viewer.

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ (recommended: use nvm for version management)
- npm 7+ or yarn 1.22+
- Git
- Modern code editor (VS Code recommended)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd ai-engineering-viewer

# Install dependencies
npm install

# Copy content (if not already present)
cp -r "../book ai engineering/extracted-content" ./public/

# Start development server
npm run dev
```

## 🏗️ Project Architecture

### Component Architecture
The application follows a modular component architecture:

```
src/components/
├── Content/              # Content rendering components
│   ├── ChapterReader.tsx    # Main chapter display component
│   ├── ContentRenderer.tsx  # Renders different content types
│   ├── ParagraphRenderer.tsx
│   ├── HeadingRenderer.tsx
│   └── FigureRenderer.tsx
├── Customization/        # Customization system components
│   ├── CustomizationPanel.tsx  # Main settings panel
│   ├── SettingsPanel.tsx       # Tabbed settings interface
│   ├── FontControls.tsx        # Typography controls
│   ├── LayoutControls.tsx      # Layout and spacing controls
│   ├── ThemeControls.tsx       # Theme and color controls
│   └── ReadingControls.tsx     # Reading preferences and content filtering
├── Layout/               # Layout components
│   └── AppLayout.tsx        # Main application layout
├── Notes/                # Note-taking system components
│   ├── NotesSidebar.tsx     # Main notes interface
│   ├── NoteEditor.tsx       # Rich note creation and editing
│   ├── NotesList.tsx        # Browse and manage notes
│   ├── TextHighlighter.tsx  # Text highlighting and visual indicators
│   ├── SelectionPopup.tsx   # Quick note creation popup
│   └── NotesToggle.tsx      # Floating notes toggle button
├── Navigation/           # Navigation components
│   ├── Sidebar.tsx          # Main navigation sidebar
│   └── NavItem.tsx          # Individual navigation items
└── UI/                   # Reusable UI components
    ├── ErrorMessage.tsx
    └── LoadingSpinner.tsx
```

### Hook Architecture
Custom hooks provide reusable logic:

```
src/hooks/
├── useBookMetadata.ts       # Fetches and manages book metadata
├── useChapterData.ts        # Fetches and caches chapter content
├── useReadingProgress.ts    # Tracks reading progress
├── useCustomizationCSS.ts   # Manages CSS variable updates for customization
├── useTextSelection.ts      # Handles text selection for note creation
└── useNotesKeyboardShortcuts.ts  # Manages keyboard shortcuts for notes
```

### Customization Architecture
The application features a comprehensive customization system built with React Context and CSS custom properties:

```
src/contexts/
├── CustomizationContext.tsx  # Centralized customization state management
└── NotesContext.tsx          # Centralized notes state management

Customization Flow:
1. CustomizationProvider wraps the entire app
2. Settings are stored in React Context with localStorage persistence
3. useCustomizationCSS hook applies settings as CSS variables
4. Components use CSS variables for dynamic styling
5. Settings panel provides UI for all customization options

Notes System Flow:
1. NotesProvider manages all note-related state
2. TextHighlighter wraps content and applies visual highlights
3. Text selection triggers note creation workflow
4. Notes are stored in localStorage with real-time updates
5. Visual indicators show existing notes in the text
```

#### Customization Categories
- **Typography**: Font family, size, weight, line height, letter spacing, drop caps
- **Layout**: Content width, paragraph spacing, text alignment, margins
- **Theme**: Color schemes, background textures, border styles
- **Reading**: Focus mode, progress indicators, content filtering

#### CSS Variable System
All customization is applied through CSS custom properties:
```css
:root {
  --customization-font-family: var(--font-family-inter);
  --customization-font-size: 18px;
  --customization-line-height: 1.6;
  --customization-content-width-px: 800px;
  --customization-bg-color: #ffffff;
  --customization-text-color: #2d3748;
  /* ... 50+ customization variables */
}
```

### State Management
- **Customization Context**: Centralized customization state with React Context
- **Local State**: React useState for component-specific state
- **Persistent State**: localStorage for settings persistence
- **CSS Variables**: Dynamic styling with CSS custom properties
- **Caching**: In-memory caching for chapter data
- **URL State**: React Router for navigation state

## 🔧 Configuration Details

### TypeScript Configuration

#### tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2015", "ES2020", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

Key configuration decisions:
- **jsx: "react"**: Uses classic JSX transform for React 17 compatibility
- **esModuleInterop: true**: Enables proper React imports
- **lib: ["ES2015", "ES2020", "DOM"]**: Includes necessary APIs (Map, Set, WeakMap)

### Vite Configuration

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🎨 Styling Guidelines

### CSS Modules
Each component has its own CSS module:

```css
/* Component.module.css */
.container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}
```

### CSS Variables
Global CSS variables for consistency:

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  --color-text-primary: #1e293b;
  --color-text-secondary: #64748b;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  --border-radius: 0.375rem;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Responsive Design
Mobile-first approach with breakpoints:

```css
/* Mobile first */
.container {
  padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: var(--spacing-md);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-lg);
  }
}
```

## 🔍 Data Flow

### Content Loading Flow
1. **App.tsx** initializes and loads book metadata
2. **useBookMetadata** hook fetches `/extracted-content/chapters/metadata/book-metadata.json`
3. **Sidebar** renders navigation from metadata
4. **ChapterReader** loads specific chapter data when route changes
5. **useChapterData** hook fetches and caches chapter content
6. **ContentRenderer** renders different content types

### Navigation Flow
1. User clicks chapter/section in sidebar
2. **NavItem** calls `onChapterSelect` or `onSectionSelect`
3. **App.tsx** updates route via React Router
4. **ChapterReader** detects route change and loads new content
5. **useReadingProgress** tracks current position

## 🧪 Testing Strategy

### Component Testing
```typescript
// Example test structure
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ChapterReader } from './ChapterReader'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

test('renders chapter content', () => {
  renderWithRouter(<ChapterReader chapterId="chapter-1" />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

### Hook Testing
```typescript
import { renderHook } from '@testing-library/react'
import { useBookMetadata } from './useBookMetadata'

test('loads book metadata', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useBookMetadata())
  
  expect(result.current.loading).toBe(true)
  await waitForNextUpdate()
  expect(result.current.data).toBeDefined()
})
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const ChapterReader = lazy(() => import('./components/Content/ChapterReader'))

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <ChapterReader chapterId={chapterId} />
</Suspense>
```

### Memoization
```typescript
// Memoize expensive calculations
const processedContent = useMemo(() => {
  return content.map(section => processSection(section))
}, [content])

// Memoize components
const NavItem = memo(({ section, onSelect }) => {
  return <div onClick={() => onSelect(section.id)}>{section.title}</div>
})
```

### Caching Strategy
```typescript
// In-memory cache for chapter data
const chapterCache = new Map<string, ChapterData>()

const useChapterData = (chapterId: string) => {
  const [data, setData] = useState(() => chapterCache.get(chapterId))
  
  useEffect(() => {
    if (!data) {
      fetchChapter(chapterId).then(chapter => {
        chapterCache.set(chapterId, chapter)
        setData(chapter)
      })
    }
  }, [chapterId, data])
  
  return data
}
```

## 🐛 Debugging

### Common Issues

#### Type Import Errors
**Problem**: `The requested module does not provide an export named 'X'`
**Solution**: Use inline interfaces instead of external type imports

```typescript
// Instead of importing types
import { BookMetadata } from '../types'

// Define inline
interface BookMetadata {
  title: string
  chapters: any[]
}
```

#### Content Not Loading
**Problem**: 404 errors for content files
**Solution**: Ensure `extracted-content` is in `public/` directory

```bash
# Check content location
ls -la public/extracted-content/chapters/metadata/

# Copy if missing
cp -r "../book ai engineering/extracted-content" ./public/
```

#### Build Errors
**Problem**: TypeScript compilation errors
**Solution**: Check tsconfig.json settings

```json
{
  "compilerOptions": {
    "jsx": "react",           // Not "react-jsx" for React 17
    "esModuleInterop": true,  // Required for React imports
    "lib": ["ES2015", "ES2020", "DOM"] // Include necessary APIs
  }
}
```

### Development Tools

#### VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- CSS Modules
- Auto Rename Tag
- Bracket Pair Colorizer

#### Browser DevTools
- React Developer Tools
- Redux DevTools (if added later)
- Lighthouse for performance auditing

## 🎨 Developing Customization Features

### Adding New Customization Options

#### 1. Update CustomizationContext Interface
```typescript
// Add new setting to appropriate interface
interface TypographySettings {
  // existing settings...
  newTypographySetting: string;
}
```

#### 2. Update Default Settings
```typescript
const defaultSettings: CustomizationSettings = {
  typography: {
    // existing defaults...
    newTypographySetting: 'default-value',
  },
};
```

#### 3. Add CSS Variable Mapping
```typescript
// In useCustomizationCSS.ts
root.style.setProperty('--customization-new-setting', settings.typography.newTypographySetting);
```

#### 4. Create UI Control
```typescript
// In appropriate control component
<div className={styles.control}>
  <label>New Setting</label>
  <select
    value={settings.typography.newTypographySetting}
    onChange={(e) => updateTypography({ newTypographySetting: e.target.value })}
  >
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
  </select>
</div>
```

#### 5. Apply in Component CSS
```css
.component {
  new-property: var(--customization-new-setting, default-value);
}
```

### Customization Best Practices

#### Performance Considerations
- Use CSS custom properties for all dynamic styling
- Debounce slider updates to prevent excessive re-renders
- Memoize expensive calculations in customization hooks
- Avoid inline styles; prefer CSS variables

#### Accessibility Guidelines
- Ensure all controls have proper ARIA labels
- Maintain keyboard navigation support
- Test with screen readers
- Provide high contrast theme options
- Include focus indicators for all interactive elements

#### CSS Variable Naming Convention
```css
--customization-{category}-{property}: value;

Examples:
--customization-font-size: 18px;
--customization-bg-color: #ffffff;
--customization-content-width-px: 800px;
--customization-sidebar-opacity: 1;
```

#### State Management Patterns
- Use React Context for global customization state
- Implement localStorage persistence for all settings
- Provide export/import functionality for settings
- Use TypeScript interfaces for type safety
- Implement proper error handling for invalid settings

### Testing Customization Features

#### Manual Testing Checklist
- [ ] All controls update live preview
- [ ] Settings persist after page reload
- [ ] Export/import functionality works
- [ ] Mobile responsive design
- [ ] Keyboard navigation works
- [ ] High contrast themes are accessible
- [ ] Performance remains smooth with all options

#### Automated Testing
```typescript
// Example test for customization context
describe('CustomizationContext', () => {
  it('should update typography settings', () => {
    const { result } = renderHook(() => useCustomization());
    act(() => {
      result.current.updateTypography({ fontSize: 20 });
    });
    expect(result.current.settings.typography.fontSize).toBe(20);
  });
});
```

## 📦 Build and Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### Deployment Checklist
- [ ] All content files copied to `public/extracted-content/`
- [ ] Environment variables configured (if any)
- [ ] Build completes without errors
- [ ] All routes work correctly
- [ ] Performance metrics acceptable
- [ ] Accessibility standards met

### Static Hosting Configuration

#### Vercel (vercel.json)
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify (_redirects)
```
/*    /index.html   200
```

## 🔄 Maintenance

### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install react@latest react-dom@latest
```

### Performance Monitoring
- Monitor bundle size with each release
- Track Core Web Vitals in production
- Regular accessibility audits
- User feedback collection

## 📚 Additional Resources

- [React 17 Documentation](https://17.reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [React Router Documentation](https://reactrouter.com/)

## 🔄 Changelog

### Recent Changes
- **2025-06-27**: Initial setup with React 17, TypeScript, and Vite
- **2025-06-27**: Implemented nuclear option for type safety (inline interfaces)
- **2025-06-27**: Fixed directory structure and content loading
- **2025-06-27**: Added comprehensive documentation

This development guide should be updated as the project evolves and new patterns emerge.
