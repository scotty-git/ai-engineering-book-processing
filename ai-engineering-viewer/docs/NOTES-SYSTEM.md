# Note-Taking System Documentation

## Overview

The AI Engineering Book Viewer features a comprehensive note-taking system designed for collaborative learning and knowledge sharing. The system allows users to create contextual annotations by highlighting text, with elegant visual indicators and hover tooltips showing where notes exist for easy discovery by future readers. All notes include author attribution (default: Scott) and provide multiple access methods including a floating notes button and hover previews.

## Core Features

### 🎯 Highlight-to-Note Workflow

1. **Text Selection**: Select any text in the book content
2. **Note Creation**: Click "Add Note" in the popup that appears
3. **Rich Editing**: Use the sidebar editor to write detailed notes
4. **Visual Feedback**: See dotted underlines where notes exist

### 📝 Note Management

- **Rich Text Editor**: Full formatting with colors, tags, and content
- **Color Coding**: 8 color options for categorizing notes
- **Tag System**: Organize notes with custom tags
- **Search & Filter**: Find notes by content, tags, or date
- **Sort Options**: Recently modified, recently created, or alphabetical

### 🎨 Visual Integration

- **Elegant Highlighting**: Background color with bottom border for clear visibility
- **Hover Effects**: Highlights darken and lift slightly on hover for better interactivity
- **Rich Tooltips**: Comprehensive hover tooltips showing note content, author, and date
- **Theme Compatibility**: Note indicators respect all customization themes
- **Click to Edit**: Click any highlighted text to edit the note
- **Smart Positioning**: Tooltips position intelligently to avoid screen edges

## User Interface

### Floating Notes Button

A floating button positioned on the right side of the screen provides one-click access to notes:

- **Always Visible**: Shows when notes sidebar is closed
- **Note Count Badge**: Displays number of notes in current chapter
- **Auto-Hide**: Disappears when notes sidebar is open (use X to close)
- **Hover Effects**: Smooth animations and visual feedback
- **Mobile Responsive**: Adapts to different screen sizes

### Notes Sidebar

The collapsible notes sidebar appears on the right side and includes:

- **Note Editor**: Rich text editor with formatting options
- **Notes List**: Browse all notes for the current chapter
- **Search Bar**: Find specific notes quickly
- **Filter Controls**: Sort and filter by tags or date

### Visual Indicators

- **Elegant Highlighting**: Background color (20% opacity) with solid bottom border
- **Color Coding**: Each note can have a custom color for both background and border
- **Interactive Hover**: Highlights darken (40% opacity) and lift on hover
- **Hover Tooltips**: Rich tooltips with note content, author, date, and tags
- **Accessibility**: High contrast support and screen reader compatibility
- **Mobile Optimized**: Touch-friendly indicators on mobile devices

### Hover Tooltip System

Rich tooltips appear when hovering over highlighted text, providing instant access to note information:

- **Content Preview**: Full note content with scrolling for long notes
- **Author Information**: Shows who created the note (default: Scott)
- **Creation Date**: Formatted timestamp of when the note was created
- **Tag Display**: Visual tags if the note has any assigned
- **Context Quote**: Shows the original highlighted text for reference
- **Smart Positioning**: Appears on the right side, adjusts to avoid screen edges
- **Delay Timer**: 500ms hover delay prevents accidental triggers
- **Theme Aware**: Adapts to light/dark mode automatically
- **Mobile Responsive**: Adjusts size and positioning on smaller screens

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+N` (Mac: `Cmd+Shift+N`) | Toggle notes sidebar |
| `N` | Create note from selected text |
| `Ctrl+Enter` (Mac: `Cmd+Enter`) | Save note when editing |
| `Escape` | Close notes sidebar |

## Technical Architecture

### Data Structure

```typescript
interface Note {
  id: string;
  chapterId: string;
  textRange: TextRange;
  highlightedText: string;
  content: string;
  author: string; // Author name (default: "Scott")
  tags: string[];
  color: string;
  created: Date;
  modified: Date;
}
```

### Key Components

- **NotesContext**: Centralized state management for all notes with author attribution
- **TextHighlighter**: Wraps content and applies visual highlights with hover tooltips
- **NoteTooltip**: Rich hover tooltips showing note content, author, and metadata
- **FloatingNotesButton**: One-click access button with note count badge
- **NotesSidebar**: Main notes interface with responsive design
- **NoteEditor**: Rich note creation and editing interface
- **NotesList**: Browse, search, and manage existing notes

### Storage

- **Local Storage**: All notes are saved locally in the browser
- **Persistence**: Notes survive page refresh and navigation
- **Export/Import**: JSON format for sharing notes between devices

## Collaborative Foundation

The system is architected for future collaborative features:

### Multi-User Support (Future)
- User profiles and authentication
- Real-time note sharing
- Permission levels (public, private, group)
- Note discussions and replies

### Social Learning (Future)
- Community note recommendations
- Expert annotations
- Study groups and shared workspaces
- Note quality voting system

## Customization Integration

The note-taking system fully integrates with the existing customization system:

### Theme Compatibility
- Note indicators work with all 6 themes
- Automatic color adjustments for dark/light modes
- High contrast support for accessibility
- Sepia and blue light filter compatibility

### Visual Settings
- Customizable indicator styles (underline, highlight, both)
- Adjustable sidebar width
- Show/hide note indicators
- Hover preview toggle

## Mobile Experience

The note-taking system is fully optimized for mobile devices:

### Touch Interface
- Large touch targets for note indicators
- Swipe gestures for sidebar navigation
- Mobile-optimized editor interface
- Responsive design for all screen sizes

### Performance
- Efficient text selection on touch devices
- Optimized rendering for mobile browsers
- Minimal impact on reading performance
- Smart caching for quick note access

## Best Practices

### For Readers
- Use descriptive tags for better organization
- Keep notes concise but informative
- Use different colors for different types of notes
- Regularly review and update your notes

### For Collaborative Use (Future)
- Follow community guidelines for public notes
- Provide constructive and helpful annotations
- Respect others' perspectives in note discussions
- Use appropriate tags for discoverability

## Troubleshooting

### Common Issues

**Notes not appearing after creation:**
- Check if note indicators are enabled in settings
- Verify the text was properly selected
- Try refreshing the page to reload highlights

**Sidebar not opening:**
- Use Ctrl+Shift+N to manually toggle
- Check if there are any JavaScript errors in console
- Ensure the notes toggle button is visible

**Performance issues:**
- Clear old notes if you have many accumulated
- Check browser storage limits
- Consider exporting and reimporting notes

### Browser Compatibility

The note-taking system works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Roadmap

### Phase 1 (Current)
- ✅ Personal note-taking with rich editor
- ✅ Visual indicators and sidebar interface
- ✅ Local storage and persistence
- ✅ Theme integration and mobile support

### Phase 2 (Planned)
- Multi-user authentication and profiles
- Real-time collaborative note editing
- Note sharing and permissions
- Cloud storage and synchronization

### Phase 3 (Future)
- Community features and note discovery
- Advanced search and AI-powered suggestions
- Integration with external note-taking tools
- Analytics and learning insights

The note-taking system represents a significant enhancement to the AI Engineering Book Viewer, transforming it from a reading application into a collaborative learning platform.
