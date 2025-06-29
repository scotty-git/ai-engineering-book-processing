# Phase 2A Implementation Plan - React Viewer MVP

## 🎯 Phase 2A Objective

Build the core React viewer with perfect content rendering for paragraphs, headings, and figures. Establish solid architecture foundation for Phase 2B advanced features.

## ✅ Approved Technical Decisions

### **Technology Stack**
- **React 18 + TypeScript + Vite** - Core framework
- **CSS Modules** - Component-scoped styling
- **React Router v6** - Navigation and deep linking
- **React Context + useReducer** - State management
- **React Intersection Observer** - Image lazy loading

### **Architecture Approach**
- **Lazy Loading** - Current chapter + preload adjacent chapters
- **Collapsible Navigation** - H1 expandable, H2+ visible when parent expanded
- **Dispatcher Pattern** - Type-safe content rendering with HTML fallback
- **Classic Book Layout** - 300px sidebar, 800px content max-width
- **Mobile-First Responsive** - Overlay sidebar on mobile

## 📋 Sequential Task Breakdown

### **Task 1: Project Setup & Configuration**
**Goal**: Create React project with proper configuration and dependencies

**Actions**:
1. Create Vite React TypeScript project
2. Install dependencies: react-router-dom, react-intersection-observer
3. Configure Vite for static asset serving
4. Set up basic project structure
5. Configure CSS Modules and global styles
6. Set up basic routing structure

**Deliverables**:
- Working React app with TypeScript
- Configured build system
- Basic routing setup
- Project structure established

### **Task 2: Copy Data & Define Types**
**Goal**: Integrate extracted content and create TypeScript interfaces

**Actions**:
1. Copy extracted-content/ to public/ directory
2. Create comprehensive TypeScript interfaces for all data structures
3. Define component prop types
4. Set up type exports and imports
5. Validate data structure compatibility

**Deliverables**:
- All 162 images accessible via /extracted-content/images/
- Complete TypeScript interfaces for JSON schemas
- Type-safe data access patterns

### **Task 3: Data Loading Infrastructure**
**Goal**: Implement efficient data loading with caching and preloading

**Actions**:
1. Create useChapterData hook with lazy loading
2. Create useBookMetadata hook for navigation data
3. Implement smart caching (current + 2 adjacent chapters)
4. Add loading states and error handling
5. Create data validation utilities

**Deliverables**:
- Efficient chapter loading system
- Smart preloading of adjacent chapters
- Robust error handling and loading states

### **Task 4: Basic Layout & Navigation**
**Goal**: Create app layout with hierarchical navigation

**Actions**:
1. Create AppLayout component with sidebar + main content
2. Implement hierarchical navigation with expand/collapse
3. Add current section highlighting
4. Create responsive sidebar (fixed desktop, overlay mobile)
5. Implement smooth scroll-to-section functionality

**Deliverables**:
- Complete app layout structure
- Working hierarchical navigation
- Responsive sidebar behavior

### **Task 5: Core Content Rendering**
**Goal**: Implement content renderer for paragraph, heading, and figure

**Actions**:
1. Create ContentRenderer dispatcher component
2. Implement ParagraphRenderer with rich text support
3. Implement HeadingRenderer with proper semantic levels
4. Implement FigureRenderer with lazy loading and captions
5. Add fallback to raw HTML for unsupported types

**Deliverables**:
- Perfect rendering of paragraphs, headings, figures
- Lazy loading images with proper captions
- Type-safe content rendering system

### **Task 6: Chapter Reader & Routing**
**Goal**: Build main content area with URL routing and progress tracking

**Actions**:
1. Create ChapterReader component
2. Implement URL routing for chapters and sections
3. Add reading progress tracking (scroll position)
4. Create chapter navigation (prev/next)
5. Implement deep linking to specific sections

**Deliverables**:
- Complete chapter reading experience
- URL-based navigation with deep linking
- Reading progress persistence

### **Task 7: Responsive Design & Mobile**
**Goal**: Optimize for all screen sizes with mobile-first approach

**Actions**:
1. Implement responsive breakpoints (mobile/tablet/desktop)
2. Create mobile navigation with slide-out sidebar
3. Optimize touch interactions for mobile
4. Test and refine typography for all screen sizes
5. Ensure images are responsive and properly sized

**Deliverables**:
- Perfect mobile experience
- Responsive design across all devices
- Touch-optimized interactions

### **Task 8: Testing & Polish**
**Goal**: Validate with all content and optimize performance

**Actions**:
1. Test with all 10 chapters (157K words, 161 figures)
2. Performance optimization and bundle size analysis
3. Fix bugs and edge cases
4. Validate perfect content rendering
5. Cross-browser testing and compatibility

**Deliverables**:
- Fully tested application with all chapters
- Optimized performance
- Bug-free core functionality

## 🎯 Phase 2A Success Criteria

### **Functional Requirements**
- ✅ Perfect rendering of paragraphs, headings, and figures
- ✅ Smooth navigation through all 10 chapters
- ✅ Responsive design working on mobile and desktop
- ✅ Image lazy loading with proper captions
- ✅ Reading progress tracking and persistence
- ✅ URL routing with deep linking to sections

### **Performance Requirements**
- ✅ Initial bundle < 200KB gzipped
- ✅ Chapter switching < 500ms
- ✅ Image lazy loading working smoothly
- ✅ No memory leaks with chapter navigation
- ✅ Smooth scrolling and interactions

### **Quality Requirements**
- ✅ TypeScript with no any types
- ✅ Clean component architecture
- ✅ Proper error handling and loading states
- ✅ Accessible navigation and content
- ✅ Cross-browser compatibility

## 🚀 Phase 2A Deliverable

**A fully functional React book viewer that:**
- Renders 157,371 words of content perfectly
- Displays 161 figures with proper captions
- Provides smooth navigation through 362 headings
- Works beautifully on mobile and desktop
- Serves as solid foundation for Phase 2B advanced features

**Ready for Phase 2B discussion:** Table rendering, code syntax highlighting, search functionality, cross-reference linking, and advanced theming.

## 🔧 Technical Implementation Details

### **Project Structure (Recommended)**
```
ai-engineering-viewer/
├── public/
│   └── extracted-content/     # Copy entire folder here
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── Navigation/
│   │   │   ├── ChapterNav.tsx
│   │   │   ├── SectionNav.tsx
│   │   │   └── NavItem.tsx
│   │   ├── Content/
│   │   │   ├── ChapterReader.tsx
│   │   │   ├── ContentRenderer.tsx
│   │   │   ├── ParagraphRenderer.tsx
│   │   │   ├── HeadingRenderer.tsx
│   │   │   ├── FigureRenderer.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── UI/
│   │       ├── Button.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useChapterData.ts
│   │   ├── useBookMetadata.ts
│   │   └── useReadingProgress.ts
│   ├── context/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── dataLoaders.ts
│   └── styles/
│       ├── globals.css
│       ├── variables.css
│       └── components/
├── package.json
└── vite.config.ts
```

### **Key Dependencies to Install**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "react-intersection-observer": "^9.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "typescript": "^4.9.3",
    "vite": "^4.1.0"
  }
}
```

### **Critical TypeScript Interfaces**
```typescript
// Core data structures from extracted content
interface ContentSection {
  type: 'paragraph' | 'heading' | 'figure' | 'table' | 'code' | 'list' | 'aside' | 'callout' | 'chapter_title';
  content?: string;
  level?: number;
  id?: string;
  raw_html: string;
}

interface FigureSection extends ContentSection {
  type: 'figure';
  image: string;
  alt: string;
  caption: {
    label: string;
    text: string;
  };
}

interface ChapterData {
  id: string;
  title: string;
  sections: ContentSection[];
  metadata: {
    word_count: number;
    reading_time_minutes: number;
  };
}

interface BookMetadata {
  title: string;
  total_chapters: number;
  table_of_contents: ChapterTOC[];
}

interface ChapterTOC {
  id: string;
  title: string;
  sections: SectionTOC[];
}

interface SectionTOC {
  title: string;
  level: number;
  id: string;
  children: SectionTOC[];
}
```

### **CSS Variables Setup**
```css
/* variables.css */
:root {
  --sidebar-width: 300px;
  --content-max-width: 800px;
  --font-size-base: 18px;
  --line-height-base: 1.6;
  --color-text: #2d3748;
  --color-accent: #3182ce;
  --color-bg: #ffffff;
  --color-sidebar-bg: #f7fafc;
  --border-color: #e2e8f0;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  :root {
    --sidebar-width: 280px;
    --font-size-base: 16px;
  }
}
```

### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    port: 3000
  }
})
```

## 🎯 Implementation Commands for New Agent

### **Step 1: Project Setup**
```bash
# Create project
npm create vite@latest ai-engineering-viewer -- --template react-ts
cd ai-engineering-viewer

# Install dependencies
npm install react-router-dom react-intersection-observer

# Copy data
cp -r ../extracted-content ./public/
```

### **Step 2: Start Development**
```bash
npm run dev
```

### **Step 3: Validation Commands**
```bash
# Test build
npm run build

# Preview production build
npm run preview
```

## 📋 Handover Checklist for New Agent

### **Before Starting Implementation**
- [ ] Read `docs/DATA-STRUCTURE-REFERENCE.md` for complete JSON schemas
- [ ] Examine `extracted-content/chapters/structured/ch01.json` for real data structure
- [ ] Review `extracted-content/chapters/metadata/book-metadata.json` for navigation data
- [ ] Check `extracted-content/images/` directory (162 images available)

### **During Implementation**
- [ ] Test with Chapter 1 first (most complex: 374 sections, 16 figures)
- [ ] Validate image loading with `/extracted-content/images/aien_0101.png`
- [ ] Ensure TypeScript strict mode with no `any` types
- [ ] Test responsive design on mobile and desktop
- [ ] Verify all 10 chapters load correctly

### **Success Criteria Validation**
- [ ] Perfect rendering of paragraphs, headings, and figures
- [ ] Smooth navigation through all 10 chapters (157K words)
- [ ] All 161 figures display with proper captions
- [ ] Mobile responsive design working
- [ ] Reading progress tracking functional
- [ ] URL routing with deep linking operational

## 🚀 Ready for Autonomous Execution

This documentation provides everything needed for a new agent to execute Phase 2A completely autonomously from start to finish. All technical decisions are made, architecture is defined, and implementation path is clear.
