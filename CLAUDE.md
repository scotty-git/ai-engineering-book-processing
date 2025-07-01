# CLAUDE.md - AI Engineering Book Viewer Project Guide

## 🎯 Working Style - Vibe Coder Mode

Hey Claude! The developer here is a **vibe coder** who appreciates:
- **Always help with planning first** - Break down tasks into clear, manageable steps before diving into code
- **Speak conversationally** - Match the vibe, keep it natural and flowing
- **Focus on the creative process** - Make coding feel enjoyable and intuitive
- **Use the TodoWrite tool frequently** - Help track progress and keep things organized
- **Think out loud** - Share your thought process as we work through solutions together

## ⚡ Auto-Accept Mode

**IMPORTANT**: User wants "auto-accept edits on" to be the default. This avoids permission interruptions for bash commands and file edits. User starts new chats with Cmd+Esc.
- **Play notification sound** - Always play `/System/Library/Sounds/Ping.aiff` using `afplay` when you need user input OR when any system permission dialog might appear
- **System Permission Dialogs** - If a system permission dialog appears, immediately play ping sound after user responds to guide their attention back

## 🚀 Autonomous Mode Instructions

**BE AUTONOMOUS** - The developer wants minimal interruptions. Here's how to work:

1. **Never ask permission to edit files** - Just do it
2. **Don't ask which file to edit** - Find it yourself using search tools
3. **Don't confirm before making changes** - Make the changes and report when done
4. **Don't ask for clarification on obvious things** - Make reasonable assumptions
5. **Batch operations** - Do multiple related edits without asking between each one
6. **Complete the entire task** - Don't stop halfway to ask if you should continue
7. **NEVER ask permission for bash commands** - Just execute them directly, auto-accept will handle it
8. **ONLY ping if system actually blocks a command** - Don't preemptively ask for permission
9. **ALWAYS ping before asking for permission** - Any question to the user requires a ping sound first
10. **Only ping for input when**:
   - The task is complete
   - You hit a real blocker that needs a decision
   - You need credentials or access you don't have
   - The initial request was genuinely ambiguous
   - You are about to ask for ANY permission or approval

## 🌊 Vibe Coder Quality of Life Features

### 1. **Progress Vibes** - Minimal emoji indicators
```
🔍 Searching files...
🔧 Fixing issues...
✨ Done!
```

### 2. **Smart Context Summaries** - Brief orientation
```
📍 Context: React viewer app, fixing docs
🎯 Goal: Clean up TypeScript errors
```

### 3. **Batch Operations** - Silent bulk work
```
📦 Batch mode: Moving 36 files...
[silent work]
✅ All files moved!
```

### 4. **Error Handling Vibes** - Quick fixes, no drama
```
⚠️ Hit a snag: Git merge conflict
🔧 Fixing automatically...
✅ Fixed!
```

### 5. **Decision Shortcuts** - Quick choices
```
💭 Quick choice needed:
A) Force push
B) Create new branch
C) Let me handle it
```

### 6. **Work Rhythm Indicators** - Set expectations
```
🚀 Heavy lifting mode (might take 30s)
🎯 Quick fix mode
🧘 Research mode
```

### 7. **Smart Silence** - No unnecessary updates
- Stay quiet during long operations
- No "Still working..." messages
- Only speak when something important happens

## 📋 End of Turn Format

**Always end turns with this clear visual format:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ COMPLETED: [What was done]
   - [Key achievement 1]
   - [Key achievement 2]

🎯 NEED FROM YOU: [Specific ask or "Nothing - all done!"]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Emoji meanings:**
- ✅ Task completed successfully
- 🎯 Specific action needed
- ❓ Question or clarification needed
- 🚧 Work in progress, blocked
- ⚠️ Issue encountered
- 💡 Suggestion or idea

## 🔔 CRITICAL: Ping Sound Requirements

**Play ping sound ONLY when task is complete and you're stopping:**
```bash
afplay /System/Library/Sounds/Ping.aiff
```

**CORRECT ping timing:**
- ✅ When you say "All done!" and have nothing more to say
- ✅ When you finish a task and are waiting for next instructions
- ✅ When you truly need user input to proceed

**WRONG ping timing:**
- ❌ During work updates or progress reports
- ❌ Before asking permission during active work
- ❌ While giving explanations or summaries
- ❌ When you're about to say more

**Key insight:** User is a "vibe coder" who trusts you to work autonomously. Only ping when you're genuinely done and silent.

## 🔄 Smart Session Management

**Context auto-condenses automatically** - No need to suggest new sessions for context management.

**RARELY suggest a new session, only when:**
1. **Performance is genuinely degrading** - I'm getting noticeably slower or less accurate
2. **True blocker encountered** - Can't proceed without fresh context

**DON'T suggest sessions for:**
- ❌ "Context getting heavy" - it auto-condenses
- ❌ Major milestones completed - just keep working
- ❌ Switching contexts - I can handle multiple contexts
- ❌ Natural break points - user decides when to break

**User prefers continuous workflow** - They want to keep working in the same session and will decide when to start fresh.

## 🔄 Git Commit Management

**Proactively suggest commits when:**
1. **Major feature complete** - "Ready to commit this feature?"
2. **Planned goal achieved** - After completing any planned milestone
3. **Major bug fixes complete** - "Good time to commit these fixes?"
4. **Before switching contexts** - "Commit current work before moving on?"
5. **After documentation updates** - When docs are updated to reflect major changes

**Auto-commit workflow:**
1. Check `git status` to see what's changed
2. Review changes with `git diff` 
3. Create descriptive commit message based on actual changes
4. Add all relevant files with `git add`
5. Commit with proper message format
6. Show commit summary to user
7. **After major changes**: Proactively help update documentation to reflect changes
8. **Then commit documentation updates** as separate follow-up commit

**Commit message format:**
```
[Type]: [Brief description]

[Details of what changed and why]

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Help user learn git:**
- Show what commands I'm running and why
- Explain what each step does
- Suggest when to push to remote
- Guide through any conflicts or issues

## 🌊 Hybrid Workflow with Augment

**Tool Selection Guide:**
- **Augment first** for: Architecture, debugging, "what should I do?" questions
- **Claude Code** for: "Just do it" execution, file edits, terminal commands

**Seamless Handoffs:**
1. **From Augment to Claude**: Copy Augment's analysis/plan → paste to Claude → "Execute this plan"
2. **From Claude to Augment**: After major changes → "Review what I just built" in Augment

**Vibe Coder Workflow Enhancements:**
- **Commit hooks**: Auto-format, lint, test on every commit
- **Hot reloading**: Keep dev server running across sessions
- **Quick scripts**: Automate repetitive tasks
- **Environment sync**: Consistent setup across sessions

**Example of good autonomous behavior:**
- User: "Add dark mode to the settings"
- Claude: *Creates plan, finds all relevant files, implements dark mode across the entire app, tests it, then pings when complete*

**Example of bad behavior (don't do this):**
- User: "Add dark mode to the settings"  
- Claude: "Should I edit the Settings.tsx file?" ❌
- Claude: "What color should the dark background be?" ❌
- Claude: "I've added the toggle, should I now add the styles?" ❌

## Project Overview

This is a comprehensive AI Engineering book processing and viewing system consisting of:
1. **Phase 1**: EPUB extraction pipeline (COMPLETE) - Converts EPUB to structured JSON/HTML
2. **Phase 2**: React viewer application (COMPLETE) - Modern web app for viewing the book
3. **Phase 3**: Real-time collaborative notes (PLANNED) - Backend for multi-user notes

**Repository**: https://github.com/scotty-git/ai-engineering-book-processing

## Project Structure

```
ai-engineering-book-processing/
├── epub_extractor_v2.py          # EPUB extraction system
├── epub-source/                  # Source EPUB file
│   └── AI Engineering (2).epub
├── extracted-content/            # Processed book data
│   ├── images/                   # 162 images (Git LFS)
│   ├── chapters/                 # Chapter content
│   │   ├── raw-html/            # Original HTML
│   │   ├── structured/          # JSON format
│   │   └── metadata/            # Book metadata
│   └── assets/                  # Image manifest
├── ai-engineering-viewer/       # React application
│   ├── src/                     # React components
│   ├── public/                  # Static assets
│   │   └── extracted-content/   # Book content copy
│   ├── docs/                    # Documentation
│   └── package.json            # Dependencies
└── docs/                       # Project documentation
```

## Quick Start Commands

### Running the React Application
```bash
# Navigate to the viewer directory
cd ai-engineering-viewer

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running the EPUB Extractor
```bash
# From project root
python3 epub_extractor_v2.py
# Creates/updates extracted-content/ directory
```

## Key Features

### React Viewer Application
- **60+ Customization Options**: Themes, fonts, spacing, colors, layouts
- **Advanced Note-Taking**: Highlight text to create notes with tooltips
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Performance Optimized**: Lazy loading, code splitting, fast builds
- **Accessibility**: Keyboard navigation, high contrast modes

### Technical Stack
- **Frontend**: React 17 + TypeScript + Vite
- **Styling**: CSS Modules + CSS Custom Properties
- **State**: React Context API + useReducer
- **Routing**: React Router v6
- **Build**: Vite with optimized production builds

## Important Files to Know

### Configuration Files
- `ai-engineering-viewer/package.json` - Dependencies and scripts
- `ai-engineering-viewer/vite.config.ts` - Build configuration
- `ai-engineering-viewer/tsconfig.json` - TypeScript settings

### Key Source Files
- `ai-engineering-viewer/src/App.tsx` - Main application component
- `ai-engineering-viewer/src/contexts/CustomizationContext.tsx` - Settings state
- `ai-engineering-viewer/src/contexts/NotesContext.tsx` - Notes state
- `ai-engineering-viewer/src/components/Layout/AppLayout.tsx` - Main layout

### Content Files
- `ai-engineering-viewer/public/extracted-content/chapters/metadata/book-metadata.json` - Book TOC
- `ai-engineering-viewer/public/extracted-content/chapters/structured/ch*.json` - Chapter content
- `ai-engineering-viewer/public/extracted-content/images/` - All book images

## Common Tasks

### Adding a New Feature
1. Create component in appropriate directory under `src/components/`
2. Use TypeScript for type safety
3. Follow existing patterns for styling (CSS Modules)
4. Update relevant context if needed

### Modifying Customization Options
1. Edit `src/contexts/CustomizationContext.tsx` to add new state
2. Update `src/hooks/useCustomizationCSS.ts` for CSS variables
3. Add controls in appropriate panel under `src/components/Customization/`

### Working with Book Content
- Content is in `public/extracted-content/`
- Each chapter is a JSON file with sections array
- Images referenced by filename in the images/ directory
- Don't modify extracted content directly - regenerate if needed

## Deployment

### Vercel (Recommended)
```bash
# Quick deploy
npx vercel --prod

# Or install Vercel CLI first
npm i -g vercel
vercel
```

### Build Settings for Any Platform
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

### Environment Variables (Future)
For real-time notes implementation:
- `VITE_API_URL` - Backend API endpoint
- `VITE_WS_URL` - WebSocket server URL

## Development Tips

### Running Development Server
- Default port is 5173
- Hot module replacement enabled
- TypeScript errors shown in terminal
- React errors shown in browser console

### Code Style
- Use TypeScript for all new files
- Follow existing component patterns
- Use CSS Modules for component styles
- Keep components focused and small

### Testing Changes
1. Test on multiple screen sizes
2. Check both light and dark themes
3. Verify keyboard navigation works
4. Test with different customization settings

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or use a different port
npm run dev -- --port 3000
```

**Build failures**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite dist
npm install
npm run build
```

**Images not loading**
- Ensure Git LFS is installed and initialized
- Run `git lfs pull` to download images
- Check image paths in JSON match filenames

**TypeScript errors**
- Run `npm run type-check` to see all errors
- Check imports and type definitions
- Ensure all props are properly typed

## Current Status

### ✅ Complete
- EPUB extraction pipeline with 162 images
- React viewer with 60+ customization options
- Note-taking system with highlights and tooltips
- Mobile-responsive design
- Production-ready build configuration

### 🚧 In Progress
- Modified files need to be committed:
  - README.md updates
  - PROJECT_SUMMARY.md
  - REAL-TIME-NOTES-IMPLEMENTATION.md
  - DEPLOYMENT-READY.md (new file)

### 📋 Planned
- Real-time collaborative notes backend
- User authentication system
- Note sharing and permissions
- Export notes functionality
- Search across all content

## Next Steps

1. **Commit pending changes**: Review and commit the modified files
2. **Deploy to production**: Use Vercel for quick deployment
3. **Share with team**: Provide repository access
4. **Plan Phase 3**: Review real-time notes implementation plan

## Additional Resources

### Documentation
- `/docs/PROJECT-STATUS.md` - Overall project status
- `/ai-engineering-viewer/docs/REAL-TIME-NOTES-IMPLEMENTATION.md` - Backend plan
- `/ai-engineering-viewer/DEPLOYMENT.md` - Deployment guide
- `/ai-engineering-viewer/TROUBLESHOOTING.md` - Common issues

### External Links
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vercel Documentation](https://vercel.com/docs)

## Contact & Support

For questions about:
- **Book content**: Check extraction system documentation
- **React app**: See component documentation
- **Deployment**: Follow deployment guide
- **Notes system**: Review implementation plan

---

This guide provides everything needed to understand and work with the AI Engineering Book Viewer project. The codebase is well-structured, documented, and ready for continued development.