# Troubleshooting Guide

This document covers common issues and their solutions for the AI Engineering Book Viewer.

## 🚨 Common Issues

### 1. Type Import Errors

#### Problem
```
Uncaught SyntaxError: The requested module '/src/types/index.ts' does not provide an export named 'BookMetadata'
```

#### Root Cause
- TypeScript configuration issues with module resolution
- Circular dependencies in type definitions
- React import compatibility problems

#### Solution
**Use inline interfaces instead of external type imports:**

```typescript
// ❌ Don't do this
import { BookMetadata } from '../types'

// ✅ Do this instead
interface BookMetadata {
  title: string
  chapters: any[]
}
```

#### Prevention
- Define types locally in each component
- Avoid complex type hierarchies
- Use simple, flat interface structures

### 2. Content Loading Issues

#### Problem
```
Failed to load book
Unexpected token '<', "<!doctype "... is not valid JSON
```

#### Root Cause
- Missing `extracted-content` folder in `public/` directory
- Server returning HTML instead of JSON
- Incorrect file paths

#### Solution
**Ensure content is properly located:**

```bash
# Check if content exists
ls -la public/extracted-content/chapters/metadata/

# Copy content if missing
cp -r "../book ai engineering/extracted-content" ./public/

# Verify JSON is accessible
curl http://localhost:3001/extracted-content/chapters/metadata/book-metadata.json
```

#### Prevention
- Always verify content location after setup
- Add content validation in development scripts
- Document content requirements clearly

### 3. React Version Compatibility

#### Problem
```
Failed to resolve import "react/jsx-dev-runtime"
Cannot find module 'react/jsx-dev-runtime'
```

#### Root Cause
- Mixing React 17 and React 17+ JSX transforms
- Incorrect TypeScript JSX configuration
- Version mismatches between React and @types/react

#### Solution
**Use React 17 with classic JSX transform:**

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "jsx": "react",  // Not "react-jsx"
    "esModuleInterop": true
  }
}
```

```typescript
// main.tsx - React 17 style
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(<App />, document.getElementById('root'))
```

#### Prevention
- Stick to one React version consistently
- Match TypeScript configuration to React version
- Test after any dependency updates

### 4. Directory Structure Issues

#### Problem
- Nested project directories
- Dependencies in wrong location
- Source code separated from build configuration

#### Root Cause
- Incorrect Vite project initialization
- Manual file copying without proper structure

#### Solution
**Consolidate everything in one directory:**

```bash
# Move everything to parent directory
cp ai-engineering-viewer/package.json .
cp ai-engineering-viewer/tsconfig.* .
cp ai-engineering-viewer/vite.config.ts .
cp -r ai-engineering-viewer/node_modules .

# Remove nested directory
rm -rf ai-engineering-viewer/
```

#### Prevention
- Initialize Vite projects in current directory
- Verify structure before starting development
- Document expected directory layout

### 5. Build and Development Server Issues

#### Problem
```
Error: Cannot find module @rollup/rollup-darwin-arm64
Port 3000 is in use, trying another one...
```

#### Root Cause
- Corrupted node_modules
- Port conflicts
- Platform-specific dependency issues

#### Solution
**Clean installation:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Use different port
npm run dev -- --port 3001

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Prevention
- Regular dependency cleanup
- Use consistent Node.js versions
- Document port requirements

## 🔧 Debugging Strategies

### 1. TypeScript Issues

#### Check Configuration
```bash
# Validate TypeScript config
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/components/App.tsx
```

#### Common Fixes
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2015", "ES2020", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "jsx": "react",
    "strict": true,
    "skipLibCheck": true
  }
}
```

### 2. Content Loading Issues

#### Verify Content Structure
```bash
# Check metadata file
cat public/extracted-content/chapters/metadata/book-metadata.json | head -10

# Verify file permissions
ls -la public/extracted-content/

# Test HTTP access
curl -s http://localhost:3001/extracted-content/chapters/metadata/book-metadata.json
```

#### Debug Network Requests
```javascript
// Add to useBookMetadata hook
console.log('Fetching metadata from:', '/extracted-content/chapters/metadata/book-metadata.json')

fetch('/extracted-content/chapters/metadata/book-metadata.json')
  .then(response => {
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    return response.text()
  })
  .then(text => {
    console.log('Raw response:', text.substring(0, 200))
  })
```

### 3. Component Rendering Issues

#### Add Debug Logging
```typescript
// In components
useEffect(() => {
  console.log('Component mounted:', { props, state })
}, [])

// In hooks
const [data, setData] = useState(null)
useEffect(() => {
  console.log('Data changed:', data)
}, [data])
```

#### Check React DevTools
- Install React Developer Tools browser extension
- Inspect component props and state
- Track re-renders and performance

### 4. Styling Issues

#### CSS Module Problems
```typescript
// Verify CSS module import
import styles from './Component.module.css'
console.log('Styles object:', styles)

// Check class names
<div className={styles.container}>
  {/* Content */}
</div>
```

#### Global Style Conflicts
```css
/* Use CSS custom properties for consistency */
:root {
  --color-primary: #2563eb;
}

.component {
  color: var(--color-primary);
}
```

## 🛠️ Development Tools

### 1. Browser DevTools

#### Console Debugging
```javascript
// Add to any component
window.debugApp = {
  bookMetadata: metadata,
  currentChapter: chapterId,
  cache: chapterCache
}

// Access in browser console
console.log(window.debugApp)
```

#### Network Tab
- Monitor failed requests
- Check response content types
- Verify file paths

#### Performance Tab
- Identify slow components
- Monitor memory usage
- Track re-renders

### 2. VS Code Debugging

#### Launch Configuration (.vscode/launch.json)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug React App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 3. Command Line Tools

#### Useful Commands
```bash
# Check TypeScript errors
npx tsc --noEmit

# Lint code
npx eslint src/

# Check bundle size
npm run build && ls -lh dist/

# Test production build
npm run preview

# Clear all caches
rm -rf node_modules/.vite node_modules/.cache
```

## 📋 Diagnostic Checklist

When encountering issues, work through this checklist:

### Environment
- [ ] Node.js version 16+ installed
- [ ] npm/yarn up to date
- [ ] Correct working directory
- [ ] No conflicting global packages

### Dependencies
- [ ] `npm install` completed successfully
- [ ] No version conflicts in package-lock.json
- [ ] React 17.0.2 installed
- [ ] TypeScript configuration correct

### Content
- [ ] `public/extracted-content/` directory exists
- [ ] `book-metadata.json` file present and valid
- [ ] Chapter files accessible
- [ ] File permissions correct

### Configuration
- [ ] `tsconfig.app.json` has correct JSX setting
- [ ] Vite configuration valid
- [ ] No conflicting config files

### Network
- [ ] Development server running
- [ ] Correct port accessible
- [ ] No proxy/firewall issues
- [ ] Content files served correctly

### Browser
- [ ] JavaScript enabled
- [ ] No console errors
- [ ] React DevTools working
- [ ] Network requests successful

## 🆘 Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Search existing issues/documentation
3. Try the diagnostic checklist
4. Gather relevant error messages and logs

### Information to Include
- Operating system and version
- Node.js and npm versions
- Exact error messages
- Steps to reproduce
- Browser and version
- Screenshots if relevant

### Useful Commands for Bug Reports
```bash
# System information
node --version
npm --version
npx --version

# Project information
npm list react react-dom typescript
cat package.json | grep -A 10 -B 10 "dependencies"

# Error logs
npm run dev 2>&1 | tee debug.log
```

## 🎨 Customization Issues

### 1. Settings Not Persisting

#### Problem
Customization settings reset after page reload or browser restart.

#### Root Cause
- localStorage is disabled in browser
- Browser in private/incognito mode
- localStorage quota exceeded
- Browser security settings blocking storage

#### Solution
```javascript
// Check if localStorage is available
if (typeof(Storage) !== "undefined") {
  console.log("localStorage is supported");
} else {
  console.log("localStorage is not supported");
}

// Check current storage usage
console.log("localStorage usage:", JSON.stringify(localStorage).length);
```

#### Prevention
- Enable localStorage in browser settings
- Use regular browsing mode (not private/incognito)
- Clear old localStorage data if quota exceeded
- Implement fallback for browsers without localStorage support

### 2. Theme Not Applying

#### Problem
Theme changes don't take effect or only partially apply.

#### Root Cause
- CSS custom properties not supported
- Browser cache issues
- CSS specificity conflicts
- JavaScript errors preventing updates

#### Solution
```css
/* Check if CSS custom properties are supported */
:root {
  --test-property: red;
}

.test {
  color: var(--test-property, blue); /* Should be red if supported */
}
```

```javascript
// Force CSS variable update
document.documentElement.style.setProperty('--customization-bg-color', '#ffffff');

// Clear browser cache
// Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

#### Prevention
- Use modern browsers that support CSS custom properties
- Clear browser cache regularly during development
- Check browser console for JavaScript errors

### 3. Performance Issues with Customization

#### Problem
App becomes slow or unresponsive when changing settings.

#### Root Cause
- Too many CSS variable updates
- Expensive re-renders
- Memory leaks in customization hooks
- Large DOM with many elements

#### Solution
```typescript
// Debounce slider updates
const debouncedUpdate = useMemo(
  () => debounce((value: number) => {
    updateTypography({ fontSize: value });
  }, 100),
  [updateTypography]
);

// Memoize expensive calculations
const cssVariables = useMemo(() => {
  return generateCSSVariables(settings);
}, [settings]);
```

#### Prevention
- Use debounced updates for sliders
- Memoize expensive calculations
- Avoid inline styles; use CSS variables
- Monitor performance with React DevTools

### 4. Mobile Customization Issues

#### Problem
Customization controls don't work properly on mobile devices.

#### Root Cause
- Touch events not properly handled
- Viewport scaling issues
- Small touch targets
- iOS Safari specific issues

#### Solution
```css
/* Ensure proper touch targets */
.control {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

/* Fix iOS Safari issues */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}
```

#### Prevention
- Test on actual mobile devices
- Use touch-friendly control sizes
- Implement proper touch event handling
- Test on multiple mobile browsers

### 5. Export/Import Settings Issues

#### Problem
Settings export/import functionality not working.

#### Root Cause
- File API not supported
- JSON parsing errors
- Invalid settings format
- Browser security restrictions

#### Solution
```typescript
// Validate settings before import
const validateSettings = (settings: any): boolean => {
  try {
    // Check required properties
    if (!settings.typography || !settings.theme) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Settings validation failed:', error);
    return false;
  }
};

// Handle import errors gracefully
const importSettings = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const settings = JSON.parse(e.target?.result as string);
      if (validateSettings(settings)) {
        applySettings(settings);
      } else {
        showError('Invalid settings file');
      }
    } catch (error) {
      showError('Failed to parse settings file');
    }
  };
  reader.readAsText(file);
};
```

#### Prevention
- Validate settings format before applying
- Provide clear error messages
- Test export/import functionality regularly
- Handle edge cases gracefully

### 6. Accessibility Issues

#### Problem
Customization controls not accessible with keyboard or screen readers.

#### Root Cause
- Missing ARIA labels
- Poor focus management
- Insufficient color contrast
- Missing keyboard navigation

#### Solution
```typescript
// Add proper ARIA labels
<input
  type="range"
  aria-label="Font size"
  aria-valuemin={14}
  aria-valuemax={24}
  aria-valuenow={fontSize}
  aria-valuetext={`${fontSize} pixels`}
/>

// Ensure keyboard navigation
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Apply Theme
</button>
```

#### Prevention
- Test with keyboard navigation only
- Use screen reader testing tools
- Follow WCAG accessibility guidelines
- Provide high contrast theme options

This troubleshooting guide should help resolve most common issues including customization-related problems. Keep it updated as new problems and solutions are discovered.
