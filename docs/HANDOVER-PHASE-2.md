# Phase 2 Handover - React Viewer Development

## 🎯 Phase 2 Objective

Build a custom React-based viewer for the AI Engineering book that surpasses standard EPUB readers with innovative features, perfect content rendering, and superior user experience for technical books.

## ✅ Phase 2A Implementation Decisions - APPROVED

### **Technology Stack (Final)**
- **React 18 + TypeScript + Vite** - Core framework
- **CSS Modules** - Component-scoped styling (chosen over Styled Components for performance)
- **React Router v6** - Chapter navigation and deep linking
- **React Context + useReducer** - State management (no external library needed)
- **React Intersection Observer** - Image lazy loading
- **Prism.js** - Code syntax highlighting (deferred to Phase 2B)
- **Fuse.js** - Search functionality (deferred to Phase 2B)

### **Architecture Approach (Final)**
- **Lazy Loading with Smart Caching** - Current chapter + preload adjacent
- **Collapsible Sidebar Navigation** - H1 sections collapsible, H2+ always visible
- **Dispatcher Pattern** - Type-safe content rendering with fallback to raw HTML
- **Classic Book Layout** - 300px sidebar, 800px max content width
- **Mobile-First Responsive** - Overlay sidebar on mobile, fixed on desktop

## ✅ Phase 1 Foundation - Ready for Integration

### **Perfect Data Foundation**
- **10 chapters** fully processed with zero data loss
- **162 images** extracted and perfectly referenced
- **Semantic hierarchy** with logical chapter/section structure
- **Advanced metadata** including cross-references and search data
- **Dual format** preservation (JSON + raw HTML fallback)

### **Data Integration Points**
```javascript
// Chapter loading
const chapter = await fetch('/extracted-content/chapters/structured/ch01.json')
  .then(res => res.json());

// Image rendering  
const imagePath = `/extracted-content/images/${section.image}`;

// Navigation data
const bookMetadata = await fetch('/extracted-content/chapters/metadata/book-metadata.json')
  .then(res => res.json());
```

## 🏗️ Recommended Technical Architecture

### **Technology Stack**
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (fast development, optimized builds)
- **Styling**: CSS Modules or Styled Components
- **State Management**: React Context + useReducer (or Zustand for complex state)
- **Routing**: React Router for chapter navigation
- **Image Handling**: Native React with lazy loading

### **Project Structure**
```
ai-engineering-viewer/
├── public/
│   └── extracted-content/     # Copy entire extracted-content folder here
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   ├── Content/
│   │   ├── Reader/
│   │   └── UI/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── data/
├── package.json
└── vite.config.ts
```

## 📋 Core Components Architecture

### **1. App-Level Components**

#### **BookViewer (Root Component)**
```typescript
interface BookViewerProps {
  bookMetadata: BookMetadata;
}

function BookViewer({ bookMetadata }: BookViewerProps) {
  const [currentChapter, setCurrentChapter] = useState<string>('ch01');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  return (
    <div className="book-viewer">
      <Navigation 
        chapters={bookMetadata.table_of_contents}
        currentChapter={currentChapter}
        onChapterSelect={setCurrentChapter}
        isOpen={sidebarOpen}
      />
      <ChapterReader 
        chapterId={currentChapter}
        onNavigate={setCurrentChapter}
      />
    </div>
  );
}
```

#### **Navigation Component**
```typescript
interface NavigationProps {
  chapters: ChapterTOC[];
  currentChapter: string;
  onChapterSelect: (chapterId: string) => void;
  isOpen: boolean;
}

function Navigation({ chapters, currentChapter, onChapterSelect, isOpen }: NavigationProps) {
  return (
    <nav className={`navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="chapter-list">
        {chapters.map(chapter => (
          <ChapterNavItem 
            key={chapter.id}
            chapter={chapter}
            isActive={chapter.id === currentChapter}
            onSelect={onChapterSelect}
          />
        ))}
      </div>
    </nav>
  );
}
```

### **2. Content Rendering Components**

#### **ChapterReader**
```typescript
interface ChapterReaderProps {
  chapterId: string;
  onNavigate: (chapterId: string) => void;
}

function ChapterReader({ chapterId, onNavigate }: ChapterReaderProps) {
  const { data: chapter, loading, error } = useChapterData(chapterId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  
  return (
    <main className="chapter-reader">
      <ChapterHeader title={chapter.title} />
      <ChapterContent sections={chapter.sections} />
      <ChapterNavigation 
        currentChapter={chapterId}
        onNavigate={onNavigate}
      />
    </main>
  );
}
```

#### **ContentRenderer (Section Dispatcher)**
```typescript
interface ContentRendererProps {
  section: ContentSection;
}

function ContentRenderer({ section }: ContentRendererProps) {
  switch (section.type) {
    case 'heading':
      return <HeadingRenderer section={section} />;
    case 'paragraph':
      return <ParagraphRenderer section={section} />;
    case 'figure':
      return <FigureRenderer section={section} />;
    case 'table':
      return <TableRenderer section={section} />;
    case 'code':
      return <CodeRenderer section={section} />;
    case 'list':
      return <ListRenderer section={section} />;
    default:
      return <div dangerouslySetInnerHTML={{ __html: section.raw_html }} />;
  }
}
```

### **3. Specialized Content Components**

#### **FigureRenderer**
```typescript
interface FigureRendererProps {
  section: FigureSection;
}

function FigureRenderer({ section }: FigureRendererProps) {
  const imagePath = `/extracted-content/images/${section.image}`;
  
  return (
    <figure className="content-figure" id={section.id}>
      <img 
        src={imagePath}
        alt={section.alt}
        loading="lazy"
        className="figure-image"
      />
      {section.caption && (
        <figcaption className="figure-caption">
          <span className="caption-label">{section.caption.label}</span>
          <span className="caption-text">{section.caption.text}</span>
        </figcaption>
      )}
    </figure>
  );
}
```

#### **TableRenderer**
```typescript
interface TableRendererProps {
  section: TableSection;
}

function TableRenderer({ section }: TableRendererProps) {
  return (
    <div className="table-container">
      {section.caption && (
        <div className="table-caption">
          <span className="caption-label">{section.caption.label}</span>
          <span className="caption-text">{section.caption.text}</span>
        </div>
      )}
      <table className="content-table">
        {section.headers.length > 0 && (
          <thead>
            <tr>
              {section.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {section.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## 🔧 Data Loading Strategy

### **Custom Hooks for Data Management**

#### **useChapterData Hook**
```typescript
function useChapterData(chapterId: string) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        const response = await fetch(`/extracted-content/chapters/structured/${chapterId}.json`);
        const chapterData = await response.json();
        setData(chapterData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    
    loadChapter();
  }, [chapterId]);
  
  return { data, loading, error };
}
```

#### **useBookMetadata Hook**
```typescript
function useBookMetadata() {
  const [metadata, setMetadata] = useState<BookMetadata | null>(null);
  
  useEffect(() => {
    async function loadMetadata() {
      const response = await fetch('/extracted-content/chapters/metadata/book-metadata.json');
      const data = await response.json();
      setMetadata(data);
    }
    
    loadMetadata();
  }, []);
  
  return metadata;
}
```

## 📱 Phase 2A Implementation Plan - APPROVED SCOPE

### **Phase 2A: Core Functionality (MVP)**
1. **Chapter Navigation** - Hierarchical sidebar with expand/collapse
2. **Core Content Rendering** - Paragraph, heading, figure (tables deferred to 2B)
3. **Image Display** - Lazy loading with proper captions
4. **Responsive Design** - Mobile overlay, desktop fixed sidebar
5. **Reading Progress** - Scroll position tracking (search deferred to 2B)

### **Phase 2A Sequential Tasks**
1. **Project Setup** - Vite + TypeScript + dependencies + routing
2. **Data Integration** - Copy extracted-content + TypeScript interfaces
3. **Data Loading** - Custom hooks with caching and preloading
4. **Layout & Navigation** - Sidebar with hierarchical TOC
5. **Content Rendering** - Dispatcher + paragraph/heading/figure renderers
6. **Chapter Reader** - Main content area with URL routing
7. **Responsive Design** - Mobile navigation and touch interactions
8. **Testing & Polish** - Validate with all 10 chapters

### **Phase 2B: Enhanced Features**
1. **Cross-References** - Clickable figure/table references
2. **Bookmarks** - Save reading position
3. **Reading Progress** - Track progress through book
4. **Theme Support** - Light/dark modes
5. **Print Styles** - Optimized printing

### **Phase 2C: Advanced Features**
1. **Full-Text Search** - Search across all chapters
2. **Annotations** - User notes and highlights
3. **Export Features** - PDF generation, sharing
4. **Offline Support** - Service worker caching
5. **Accessibility** - Screen reader optimization

## 🎨 Design Considerations

### **Layout Strategy**
- **Sidebar Navigation**: Collapsible TOC with chapter/section hierarchy
- **Main Content**: Clean reading area with optimal typography
- **Responsive Breakpoints**: Mobile-first design with desktop enhancements
- **Visual Hierarchy**: Clear distinction between content types

### **Typography & Spacing**
- **Reading Optimization**: Comfortable line height, font size, margins
- **Code Blocks**: Syntax highlighting with proper monospace fonts
- **Figure Captions**: Clear visual association with images
- **Table Styling**: Clean, readable data presentation

### **Performance Optimization**
- **Lazy Loading**: Images and chapters loaded on demand
- **Code Splitting**: Route-based component splitting
- **Caching**: Aggressive caching of chapter data
- **Image Optimization**: Responsive images with proper sizing

## 🚀 Development Workflow

### **Setup Steps**
1. **Create Vite React project** with TypeScript template
2. **Copy extracted-content** to public directory
3. **Define TypeScript interfaces** for all data structures
4. **Implement core components** (BookViewer, Navigation, ChapterReader)
5. **Add content renderers** for each section type
6. **Style components** with responsive design
7. **Test with all chapters** to ensure compatibility

### **Testing Strategy**
- **Component Testing**: Individual content renderers
- **Integration Testing**: Full chapter rendering
- **Cross-Browser Testing**: Ensure compatibility
- **Performance Testing**: Large chapter loading
- **Accessibility Testing**: Screen reader compatibility

### **Deployment Considerations**
- **Static Hosting**: Vercel, Netlify, or GitHub Pages
- **Asset Optimization**: Image compression, bundle optimization
- **CDN Setup**: Fast global content delivery
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📊 Success Metrics

### **Technical Goals**
- **Perfect Rendering**: All 161 figures, 48 tables, 54 code blocks display correctly
- **Fast Loading**: < 2s initial load, < 500ms chapter switching
- **Responsive Design**: Optimal experience on all device sizes
- **Accessibility**: WCAG 2.1 AA compliance

### **User Experience Goals**
- **Intuitive Navigation**: Easy chapter/section jumping
- **Reading Comfort**: Optimized typography and spacing
- **Feature Discovery**: Clear UI for advanced features
- **Performance**: Smooth scrolling and interactions

## 🎯 Next Steps

1. **Initialize React project** with recommended tech stack
2. **Set up data loading** infrastructure with custom hooks
3. **Implement core navigation** and chapter rendering
4. **Build content renderers** for all section types
5. **Add responsive styling** and theme support
6. **Test thoroughly** with all extracted content
7. **Deploy and iterate** based on usage feedback

The Phase 1 extraction provides a perfect foundation for building an exceptional React viewer that will showcase technical content better than any standard EPUB reader.
