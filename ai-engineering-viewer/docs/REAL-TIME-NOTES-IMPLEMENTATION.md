# Real-Time Notes Implementation Plan

## Overview
Implement immediate API requests for every note operation (save/edit/delete) using GitHub as backend with 5k API rate limit.

## API Usage Analysis
- **Rate Limit**: 5,000 requests/hour (~83/minute, ~1.4/second)
- **Team Usage**: 10 members × 8 operations/hour = 80 requests/hour
- **Safety Margin**: 98.4% headroom available
- **Conclusion**: Real-time operations are completely feasible

---

## Phase 1: Vercel API Routes Setup

### 1.1 Vercel Configuration
```json
// vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "env": {
    "GITHUB_TOKEN": "@github_token",
    "GITHUB_OWNER": "@github_owner",
    "GITHUB_REPO": "@github_repo"
  }
}
```

### 1.2 Environment Variables
```bash
# Add to Vercel Dashboard Environment Variables
GITHUB_TOKEN=your_personal_access_token
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo_name
GITHUB_NOTES_PATH=notes/

# For local development (.env.local)
GITHUB_TOKEN=your_personal_access_token
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo_name
```

### 1.3 API Route Structure
```
api/
├── notes/
│   ├── [chapterId].ts          # GET/PUT notes for specific chapter
│   ├── save.ts                 # POST save note operation
│   ├── delete.ts               # DELETE note operation
│   └── sync.ts                 # GET sync all notes
└── github/
    ├── rate-limit.ts           # GET current rate limit status
    └── health.ts               # GET API health check
```

### 1.4 Core API Routes

#### Save Notes API (`api/notes/save.ts`)
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubNotesAPI } from '../../lib/github-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { chapterId, notes, operation } = req.body;

    if (!chapterId || !notes) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const githubAPI = new GitHubNotesAPI();
    await githubAPI.saveNotes(chapterId, notes);

    // Log operation for monitoring
    console.log(`✅ ${operation || 'SAVE'} operation completed for ${chapterId}`);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      operation: operation || 'SAVE'
    });

  } catch (error) {
    console.error('❌ Save operation failed:', error);

    res.status(500).json({
      error: 'Failed to save notes',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

#### Load Notes API (`api/notes/[chapterId].ts`)
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubNotesAPI } from '../../lib/github-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chapterId } = req.query;

  if (typeof chapterId !== 'string') {
    return res.status(400).json({ error: 'Invalid chapter ID' });
  }

  try {
    const githubAPI = new GitHubNotesAPI();

    if (req.method === 'GET') {
      // Load notes
      const notes = await githubAPI.loadNotes(chapterId);
      res.status(200).json({ notes, chapterId });

    } else if (req.method === 'PUT') {
      // Save notes (alternative endpoint)
      const { notes } = req.body;
      await githubAPI.saveNotes(chapterId, notes);
      res.status(200).json({ success: true });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error(`❌ Operation failed for ${chapterId}:`, error);
    res.status(500).json({
      error: 'Operation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

#### Rate Limit Monitor (`api/github/rate-limit.ts`)
```typescript
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'AI-Engineering-Viewer'
      }
    });

    const rateLimit = await response.json();

    res.status(200).json({
      core: rateLimit.resources.core,
      remaining: rateLimit.resources.core.remaining,
      resetTime: new Date(rateLimit.resources.core.reset * 1000).toISOString(),
      percentageUsed: ((5000 - rateLimit.resources.core.remaining) / 5000) * 100
    });

  } catch (error) {
    console.error('❌ Rate limit check failed:', error);
    res.status(500).json({ error: 'Failed to check rate limit' });
  }
}
```

### 1.5 GitHub API Library (`lib/github-api.ts`)
```typescript
interface GitHubFile {
  content: string;
  sha?: string;
  encoding?: string;
}

export class GitHubNotesAPI {
  private baseURL = 'https://api.github.com';
  private token = process.env.GITHUB_TOKEN;
  private owner = process.env.GITHUB_OWNER;
  private repo = process.env.GITHUB_REPO;

  constructor() {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error('Missing required GitHub configuration');
    }
  }

  async saveNotes(chapterId: string, notes: any[]): Promise<void> {
    const path = `notes/${chapterId}.json`;
    const content = JSON.stringify({
      chapterId,
      notes,
      lastUpdated: new Date().toISOString(),
      version: '1.0'
    }, null, 2);

    // Get current file SHA (required for updates)
    const currentFile = await this.getFile(path);

    const response = await fetch(`${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Engineering-Viewer'
      },
      body: JSON.stringify({
        message: `Update notes for ${chapterId} - ${notes.length} notes`,
        content: Buffer.from(content).toString('base64'),
        sha: currentFile?.sha,
        committer: {
          name: 'AI Engineering Viewer',
          email: 'notes@ai-engineering-viewer.app'
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  async loadNotes(chapterId: string): Promise<any[]> {
    const path = `notes/${chapterId}.json`;
    const file = await this.getFile(path);

    if (!file) return [];

    try {
      const content = Buffer.from(file.content, 'base64').toString('utf-8');
      const data = JSON.parse(content);
      return data.notes || [];
    } catch (error) {
      console.error(`Failed to parse notes for ${chapterId}:`, error);
      return [];
    }
  }

  private async getFile(path: string): Promise<GitHubFile | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${this.token}`,
            'User-Agent': 'AI-Engineering-Viewer'
          },
        }
      );

      if (response.status === 404) return null;

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to get file ${path}:`, error);
      return null;
    }
  }
}
```

### 1.6 Client-Side API Service (`lib/notes-api.ts`)
```typescript
export class NotesAPIClient {
  private baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://your-app.vercel.app';

  async saveNotes(chapterId: string, notes: any[], operation = 'SAVE'): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/notes/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, notes, operation })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to save notes');
    }
  }

  async loadNotes(chapterId: string): Promise<any[]> {
    const response = await fetch(`${this.baseURL}/api/notes/${chapterId}`);

    if (!response.ok) {
      throw new Error('Failed to load notes');
    }

    const data = await response.json();
    return data.notes;
  }

  async getRateLimit(): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/github/rate-limit`);
    return response.json();
  }
}

export const notesAPI = new NotesAPIClient();
```

---

## Phase 2: GitHub API Integration Setup

### 2.1 Rate Limiting & Error Handling (Moved from Vercel)
Create `src/services/githubNotesAPI.ts`:

```typescript
interface GitHubFile {
  content: string;
  sha?: string;
}

class GitHubNotesAPI {
  private baseURL = 'https://api.github.com';
  private token = process.env.GITHUB_TOKEN;
  private owner = process.env.GITHUB_OWNER;
  private repo = process.env.GITHUB_REPO;

  async saveNotes(chapterId: string, notes: Note[]): Promise<void> {
    const path = `notes/${chapterId}.json`;
    const content = JSON.stringify(notes, null, 2);
    
    // Get current file SHA (required for updates)
    const currentFile = await this.getFile(path);
    
    await fetch(`${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Update notes for ${chapterId}`,
        content: btoa(content), // Base64 encode
        sha: currentFile?.sha, // Required for updates
      }),
    });
  }

  async loadNotes(chapterId: string): Promise<Note[]> {
    const path = `notes/${chapterId}.json`;
    const file = await this.getFile(path);
    
    if (!file) return [];
    
    const content = atob(file.content);
    return JSON.parse(content);
  }

  private async getFile(path: string): Promise<GitHubFile | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/repos/${this.owner}/${this.repo}/contents/${path}`,
        {
          headers: { 'Authorization': `token ${this.token}` },
        }
      );
      
      if (response.status === 404) return null;
      return await response.json();
    } catch {
      return null;
    }
  }
}

export const githubAPI = new GitHubNotesAPI();
```

### 1.3 Rate Limiting & Error Handling
```typescript
class RateLimitedAPI {
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private requestCount = 0;
  private windowStart = Date.now();

  async enqueue<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      // Reset counter every hour
      if (Date.now() - this.windowStart > 3600000) {
        this.requestCount = 0;
        this.windowStart = Date.now();
      }
      
      // Check rate limit (leave 20% buffer)
      if (this.requestCount >= 4000) {
        console.warn('Approaching rate limit, queuing requests...');
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
        continue;
      }
      
      const operation = this.requestQueue.shift()!;
      this.requestCount++;
      
      try {
        await operation();
      } catch (error) {
        console.error('API operation failed:', error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isProcessing = false;
  }
}

export const rateLimitedGitHubAPI = new RateLimitedAPI();
```

---

## Phase 3: Notes Context Refactoring

### 3.1 Update NotesContext for Immediate Saves
```typescript
// Update src/contexts/NotesContext.tsx

const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  // Immediate save function using Vercel API
  const saveToAPI = async (notes: Note[], chapterId: string, operation = 'SAVE') => {
    setSaveStatus('saving');
    try {
      await notesAPI.saveNotes(chapterId, notes, operation);
      setSaveStatus('idle');
    } catch (error) {
      setSaveStatus('error');
      console.error('Failed to save notes:', error);
      // Show user notification
    }
  };

  const addNote = async (noteData: CreateNoteData) => {
    const newNote: Note = {
      ...noteData,
      id: generateId(),
      author: 'Scott',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    // Optimistic update
    dispatch({ type: 'ADD_NOTE', payload: newNote });
    
    // Immediate save
    const updatedNotes = [...Object.values(state.notes), newNote];
    await saveToAPI(updatedNotes, getCurrentChapterId(), 'ADD');
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    // Optimistic update
    dispatch({ type: 'UPDATE_NOTE', payload: { id, updates } });
    
    // Immediate save
    const updatedNotes = Object.values({
      ...state.notes,
      [id]: { ...state.notes[id], ...updates, modified: new Date().toISOString() }
    });
    await saveToAPI(updatedNotes, getCurrentChapterId(), 'UPDATE');
  };

  const deleteNote = async (id: string) => {
    // Optimistic update
    dispatch({ type: 'DELETE_NOTE', payload: id });
    
    // Immediate save
    const { [id]: deleted, ...remainingNotes } = state.notes;
    await saveToAPI(Object.values(remainingNotes), getCurrentChapterId(), 'DELETE');
  };

  return (
    <NotesContext.Provider value={{
      state: { ...state, saveStatus },
      addNote,
      updateNote,
      deleteNote,
      // ... other methods
    }}>
      {children}
    </NotesContext.Provider>
  );
};
```

### 3.2 Add Save Status Indicators
```typescript
// src/components/Notes/SaveStatusIndicator.tsx
interface SaveStatusProps {
  status: 'idle' | 'saving' | 'error';
}

export const SaveStatusIndicator: React.FC<SaveStatusProps> = ({ status }) => {
  const statusConfig = {
    idle: { icon: '✅', text: 'Saved', className: 'saved' },
    saving: { icon: '💾', text: 'Saving...', className: 'saving' },
    error: { icon: '❌', text: 'Save failed', className: 'error' }
  };

  const config = statusConfig[status];

  return (
    <div className={`save-status ${config.className}`}>
      <span className="save-icon">{config.icon}</span>
      <span className="save-text">{config.text}</span>
    </div>
  );
};
```

---

## Phase 4: Optimistic Updates & Error Recovery

### 4.1 Optimistic Update Pattern
```typescript
// Pattern for all note operations:
const performNoteOperation = async (
  optimisticUpdate: () => void,
  serverOperation: () => Promise<void>,
  rollbackUpdate: () => void
) => {
  // 1. Show change immediately
  optimisticUpdate();
  
  try {
    // 2. Save to server
    await serverOperation();
  } catch (error) {
    // 3. Rollback on failure
    rollbackUpdate();
    
    // 4. Show error to user
    showErrorNotification('Failed to save. Please try again.');
  }
};
```

### 4.2 Conflict Resolution
```typescript
// Handle concurrent edits
const handleConflict = async (localNotes: Note[], serverNotes: Note[]) => {
  const conflicts = detectConflicts(localNotes, serverNotes);
  
  if (conflicts.length > 0) {
    // Show conflict resolution UI
    const resolution = await showConflictDialog(conflicts);
    return mergeNotes(localNotes, serverNotes, resolution);
  }
  
  return serverNotes;
};

const detectConflicts = (local: Note[], server: Note[]): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  local.forEach(localNote => {
    const serverNote = server.find(n => n.id === localNote.id);
    if (serverNote && serverNote.modified !== localNote.modified) {
      conflicts.push({
        id: localNote.id,
        local: localNote,
        server: serverNote
      });
    }
  });
  
  return conflicts;
};
```

---

## Phase 5: User Experience Enhancements

### 5.1 Loading States
```typescript
// Show loading states during operations
const NoteEditor: React.FC = () => {
  const { saveStatus } = useNotes();
  
  return (
    <div className="note-editor">
      <textarea 
        placeholder="Add your note..."
        disabled={saveStatus === 'saving'}
      />
      <div className="note-actions">
        <SaveStatusIndicator status={saveStatus} />
        <button 
          disabled={saveStatus === 'saving'}
          className={saveStatus === 'saving' ? 'saving' : ''}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
};
```

### 5.2 Error Notifications
```typescript
// src/components/UI/NotificationSystem.tsx
export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <div className="notifications">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
};
```

---

## Phase 6: Testing & Monitoring

### 6.1 API Usage Monitoring
```typescript
// Track API usage
class APIMonitor {
  private usage: { timestamp: number; operation: string }[] = [];

  logRequest(operation: string) {
    this.usage.push({ timestamp: Date.now(), operation });
    
    // Keep only last hour
    const oneHourAgo = Date.now() - 3600000;
    this.usage = this.usage.filter(u => u.timestamp > oneHourAgo);
  }

  getCurrentUsage() {
    return {
      requestsLastHour: this.usage.length,
      remainingQuota: 5000 - this.usage.length,
      percentageUsed: (this.usage.length / 5000) * 100
    };
  }

  getUsageByOperation() {
    return this.usage.reduce((acc, { operation }) => {
      acc[operation] = (acc[operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const apiMonitor = new APIMonitor();
```

### 6.2 Testing Strategy
```typescript
// Test immediate saves via Vercel API
describe('Real-time Notes', () => {
  test('saves note immediately after creation', async () => {
    const { addNote } = renderNotesProvider();

    await addNote({ content: 'Test note', selection: 'test' });

    // Verify Vercel API was called
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/notes/save'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Test note')
      })
    );
  });

  test('handles save failures gracefully', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const { addNote } = renderNotesProvider();
    await addNote({ content: 'Test note', selection: 'test' });

    // Verify error state
    expect(screen.getByText('Save failed')).toBeInTheDocument();
  });

  test('shows correct operation type in API calls', async () => {
    const { addNote, updateNote, deleteNote } = renderNotesProvider();

    await addNote({ content: 'Test note', selection: 'test' });
    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"operation":"ADD"')
      })
    );

    await updateNote('note-1', { content: 'Updated' });
    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"operation":"UPDATE"')
      })
    );

    await deleteNote('note-1');
    expect(fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        body: expect.stringContaining('"operation":"DELETE"')
      })
    );
  });
});
```

---

## Implementation Timeline

### ✅ **COMPLETED: Repository Setup**
- [x] **Complete React application committed to GitHub**
- [x] **Git LFS configured for image files (162 images, 29MB)**
- [x] **All source code, documentation, and assets uploaded**
- [x] **Repository ready for deployment at: https://github.com/scotty-git/ai-engineering-book-processing**

### Week 1: Vercel Backend Setup
- [ ] Create Vercel API routes structure
- [ ] Set up environment variables and GitHub integration
- [ ] Implement core save/load API endpoints
- [ ] Add rate limiting and error handling
- [ ] Create client-side API service

### Week 2: GitHub Integration
- [ ] Complete GitHub API library
- [ ] Add advanced rate limiting with queuing
- [ ] Implement conflict detection
- [ ] Add API monitoring endpoints

### Week 3: Frontend Integration
- [ ] Update NotesContext for immediate saves
- [ ] Implement optimistic updates
- [ ] Add error handling and rollback
- [ ] Create save status indicators

### Week 4: UX Polish & Testing
- [ ] Add loading states and notifications
- [ ] Implement conflict resolution UI
- [ ] Add comprehensive tests
- [ ] Performance optimization and monitoring

### Week 5: Deployment & Monitoring
- [ ] Deploy to Vercel with environment variables
- [ ] Set up monitoring and alerting
- [ ] Load testing and optimization
- [ ] Documentation and team training

## 🚀 **Current Status: Ready for Implementation**

### **Repository Status**
- ✅ **Complete codebase committed to GitHub**
- ✅ **Git LFS handling large image files properly**
- ✅ **All 162 book images included and accessible**
- ✅ **React application fully functional locally**
- ✅ **Documentation and implementation plans complete**

### **Next Immediate Steps**
1. **Deploy to Vercel** - Repository is ready for immediate deployment
2. **Set up environment variables** for GitHub API integration
3. **Begin Phase 1** - Vercel API routes implementation
4. **Team access** - Share repository with team members

### **Repository Information**
- **GitHub URL**: https://github.com/scotty-git/ai-engineering-book-processing
- **Main Application**: `/ai-engineering-viewer/` directory
- **Images**: Managed via Git LFS (29MB, 162 files)
- **Documentation**: `/ai-engineering-viewer/docs/` and `/docs/`

## Success Metrics
- ✅ Notes save within 500ms of user action
- ✅ Zero data loss during normal operations  
- ✅ Graceful handling of network failures
- ✅ API usage stays under 80% of rate limit
- ✅ Conflicts resolved automatically or with clear user guidance

## Risk Mitigation
- **Rate Limits**: Monitor usage, implement queuing
- **Network Failures**: Optimistic updates + rollback
- **Conflicts**: Automatic detection + resolution UI
- **Data Loss**: Local backup + recovery mechanisms
