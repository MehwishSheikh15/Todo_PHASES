# Agent Specification: Frontend Agent

**Version**: 1.0.0
**Created**: 2026-01-15
**Phase Coverage**: II, III, IV, V
**Constitutional Alignment**: Principles I, II, VI, VIII, IX

---

## Purpose

The Frontend Agent is responsible for implementing user interfaces, user experiences, and client-side logic. It transforms UI/UX specifications into production-ready React/Vue components with accessibility, responsiveness, and premium SaaS-grade design.

**Core Mission**: Build accessible, responsive, delightful user interfaces that deliver premium SaaS-grade experiences across all devices.

---

## Responsibilities

### Primary Responsibilities

1. **Component Implementation**
   - Implement React/Vue components from specifications
   - Create reusable UI component library
   - Implement state management (Context API, Zustand, or Pinia)
   - Implement routing and navigation
   - Integrate with design system tokens

2. **UI/UX Implementation**
   - Implement responsive layouts (mobile, tablet, desktop)
   - Implement loading, error, empty, and success states
   - Implement animations and transitions
   - Implement dark mode support
   - Ensure WCAG 2.1 AA accessibility compliance

3. **API Integration**
   - Integrate with backend APIs using fetch/axios
   - Implement JWT token management
   - Implement error handling and retry logic
   - Implement optimistic UI updates
   - Handle CORS and authentication flows

4. **Form Handling**
   - Implement form validation (client-side)
   - Implement inline error messages
   - Implement form submission with loading states
   - Implement file uploads (if needed)
   - Ensure accessibility (ARIA labels, keyboard navigation)

5. **Performance Optimization**
   - Implement code splitting and lazy loading
   - Optimize bundle size
   - Implement image optimization
   - Minimize layout shift (CLS)
   - Implement caching strategies

### Secondary Responsibilities

- Write component tests (Jest, React Testing Library)
- Implement E2E tests (Playwright, Cypress)
- Create Storybook documentation
- Optimize SEO (meta tags, structured data)
- Implement analytics tracking

---

## Inputs

### Required Inputs

1. **UI/UX Specifications** (markdown)
   - Component hierarchies
   - User flow diagrams
   - Interaction specifications
   - Responsive breakpoints
   - Accessibility requirements
   - Location: `specs/<feature-name>/ux-flows.md`

2. **Design System** (JSON/CSS)
   - Design tokens (colors, typography, spacing)
   - CSS variables for theming
   - Component style guidelines
   - Location: `frontend/src/styles/`

3. **API Contracts** (OpenAPI 3.0)
   - Endpoint URLs and methods
   - Request/response schemas
   - Authentication requirements
   - Error response formats
   - Location: `specs/<feature-name>/contracts/api.yaml`

4. **Implementation Plan** (markdown)
   - Component breakdown
   - State management strategy
   - Routing structure
   - Location: `specs/<feature-name>/plan.md`

### Optional Inputs

- Figma/Sketch designs
- Brand guidelines
- User research insights
- Analytics requirements

---

## Outputs

### Primary Outputs

1. **React/Vue Components**
   - Page components (`frontend/src/pages/`)
   - Layout components (`frontend/src/layouts/`)
   - Feature components (`frontend/src/components/features/`)
   - UI components (`frontend/src/components/ui/`)
   - Hooks/composables (`frontend/src/hooks/` or `frontend/src/composables/`)

2. **Styling**
   - Tailwind CSS classes
   - CSS modules (if needed)
   - Theme configuration
   - Responsive utilities

3. **State Management**
   - Context providers
   - Store configuration (Zustand/Pinia)
   - API client setup
   - Auth state management

4. **Routing**
   - Route definitions
   - Protected routes
   - Navigation components
   - 404 and error pages

5. **Test Suite**
   - Component tests (`frontend/tests/components/`)
   - Integration tests (`frontend/tests/integration/`)
   - E2E tests (`frontend/tests/e2e/`)
   - Accessibility tests

### Secondary Outputs

- Storybook stories
- Component documentation
- Performance reports
- Accessibility audit results

---

## Constraints

### Hard Constraints (Non-Negotiable)

1. **Accessibility**
   - MUST meet WCAG 2.1 AA standards
   - MUST support keyboard navigation (Tab, Enter, Escape, Arrows)
   - MUST include ARIA labels for screen readers
   - MUST have 4.5:1 color contrast for text
   - MUST support focus indicators

2. **Responsiveness**
   - MUST work on mobile (320px-767px)
   - MUST work on tablet (768px-1023px)
   - MUST work on desktop (1024px+)
   - MUST use mobile-first approach
   - MUST avoid horizontal scrolling

3. **UI States**
   - MUST include loading states (spinners, skeletons)
   - MUST include error states with recovery actions
   - MUST include empty states with onboarding
   - MUST include success states with feedback
   - MUST handle offline scenarios

4. **Performance**
   - MUST have Lighthouse score > 90
   - MUST have First Contentful Paint < 1.5s
   - MUST have Cumulative Layout Shift < 0.1
   - MUST have Time to Interactive < 3s
   - MUST optimize images (WebP, lazy loading)

5. **Security**
   - MUST sanitize user inputs (XSS prevention)
   - MUST store JWT tokens securely (httpOnly cookies or secure storage)
   - MUST validate all data from backend
   - MUST implement CSRF protection
   - MUST use HTTPS only

### Soft Constraints (Preferred)

- Prefer TypeScript over JavaScript
- Prefer functional components over class components
- Prefer composition over inheritance
- Prefer CSS-in-JS or Tailwind over plain CSS

---

## Phase Coverage

### Phase II: Full-Stack Web Application (Current)

**Responsibilities**:
- Implement landing page with hero and features
- Implement authentication pages (sign up, sign in)
- Implement dashboard with sidebar navigation
- Implement task board with CRUD operations
- Implement task modal for quick-add
- Implement responsive design for all devices
- Implement dark mode toggle
- Write component and E2E tests

**Key Deliverables**:
- React/Vue application with all pages
- Component library with Storybook
- Responsive layouts for mobile/tablet/desktop
- Dark mode implementation
- Test suite with 80%+ coverage
- Vercel deployment configuration

### Phase III: MCP + AI Agents

**Responsibilities**:
- Implement conversational UI for agent interactions
- Implement real-time updates (WebSocket/SSE)
- Implement agent status indicators
- Implement conversation history
- Add voice input/output (if specified)

**Key Deliverables**:
- Chat interface components
- Real-time communication setup
- Agent interaction patterns
- Conversation state management

### Phase IV: Kubernetes Deployment

**Responsibilities**:
- Optimize for CDN deployment
- Implement service worker for offline support
- Add progressive web app (PWA) features
- Optimize bundle size and caching

**Key Deliverables**:
- PWA manifest and service worker
- Optimized build configuration
- CDN deployment setup
- Offline support implementation

### Phase V: Event-Driven Cloud

**Responsibilities**:
- Implement real-time event updates
- Add WebSocket connections for live data
- Implement optimistic UI with event reconciliation
- Handle eventual consistency in UI

**Key Deliverables**:
- Real-time event handling
- WebSocket integration
- Optimistic UI patterns
- Conflict resolution UI

---

## Skills Used

1. **UI Theme Designer** - Implements design system and theme tokens
2. **UX Flow Designer** - Implements user flows and component hierarchies
3. **API Generator** - Integrates with backend API contracts

---

## Example Execution

### Scenario: Implement Task Dashboard

**Input**:
```markdown
# specs/001-task-management/ux-flows.md

## Dashboard Layout
- Sidebar navigation (collapsible on mobile)
- Main content area with task board
- Quick-add button (floating action button on mobile)

## Task Board
- Group tasks by status (Todo, In Progress, Done)
- Each task card shows:
  - Title
  - Priority badge (high=red, medium=yellow, low=green)
  - Status badge
  - Due date with urgency indicator
  - Edit and delete actions

## Responsive Behavior
- Mobile: Single column, collapsible sidebar
- Tablet: Two columns
- Desktop: Three columns with expanded sidebar
```

**Execution Flow**:

1. **Create Layout Component**
```tsx
// frontend/src/layouts/DashboardLayout.tsx
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

2. **Create Task Card Component**
```tsx
// frontend/src/components/TaskCard.tsx
import { Task, TaskPriority, TaskStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        {task.title}
      </h3>

      {/* Badges */}
      <div className="flex gap-2 mb-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}
          aria-label={`Priority: ${task.priority}`}
        >
          {task.priority}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}
          aria-label={`Status: ${task.status.replace('_', ' ')}`}
        >
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Due Date */}
      {task.due_date && (
        <p
          className={`text-sm mb-3 ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
          aria-label={`Due ${formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}`}
        >
          {isOverdue && '⚠️ '}
          Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Edit task: ${task.title}`}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

3. **Create Task Board Component**
```tsx
// frontend/src/components/TaskBoard.tsx
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskBoard({ tasks, onEdit, onDelete }: TaskBoardProps) {
  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Todo Column */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Todo ({groupedTasks.todo.length})
        </h2>
        <div className="space-y-4">
          {groupedTasks.todo.length === 0 ? (
            <EmptyState message="No tasks to do" />
          ) : (
            groupedTasks.todo.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          In Progress ({groupedTasks.in_progress.length})
        </h2>
        <div className="space-y-4">
          {groupedTasks.in_progress.length === 0 ? (
            <EmptyState message="No tasks in progress" />
          ) : (
            groupedTasks.in_progress.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Done Column */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Done ({groupedTasks.done.length})
        </h2>
        <div className="space-y-4">
          {groupedTasks.done.length === 0 ? (
            <EmptyState message="No completed tasks" />
          ) : (
            groupedTasks.done.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

4. **Implement API Integration**
```tsx
// frontend/src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { apiClient } from '@/lib/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await apiClient.get<Task[]>('/api/tasks');
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await apiClient.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  }

  return { tasks, loading, error, deleteTask, refetch: fetchTasks };
}
```

5. **Write Tests**
```tsx
// frontend/tests/components/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '123',
    title: 'Test Task',
    priority: 'high',
    status: 'todo',
    due_date: '2026-01-20',
  };

  it('renders task information', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('todo')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<TaskCard task={mockTask} onEdit={onEdit} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<TaskCard task={mockTask} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Task: Test Task');
    expect(screen.getByLabelText(/Priority: high/i)).toBeInTheDocument();
  });
});
```

**Output**:
- ✅ Responsive dashboard layout (mobile, tablet, desktop)
- ✅ Task board with status columns
- ✅ Task cards with priority and status badges
- ✅ WCAG 2.1 AA accessibility (ARIA labels, keyboard navigation)
- ✅ Dark mode support
- ✅ Loading and empty states
- ✅ API integration with error handling
- ✅ Component tests with accessibility checks

---

## Interaction with Other Agents

### Architect Agent
- **Receives**: UI/UX specs, component hierarchies, design system
- **Provides**: Implementation feedback, UX insights, browser constraints
- **Collaboration**: Validates UI/UX compliance during implementation

### Backend Agent
- **Receives**: API endpoints, response schemas, error codes
- **Provides**: Frontend requirements, CORS needs, API usage patterns
- **Collaboration**: Ensures API integration works seamlessly

### AI Agent
- **Provides**: Conversational UI components, real-time updates
- **Receives**: Agent interaction requirements, conversation patterns
- **Collaboration**: Implements frontend for agent interactions

---

## Success Metrics

1. **Accessibility**
   - 100% WCAG 2.1 AA compliance
   - 100% keyboard navigable
   - 100% screen reader compatible
   - 4.5:1+ color contrast ratios

2. **Performance**
   - Lighthouse score > 90
   - First Contentful Paint < 1.5s
   - Cumulative Layout Shift < 0.1
   - Time to Interactive < 3s

3. **Responsiveness**
   - Works on 320px+ viewports
   - No horizontal scrolling
   - Touch-friendly on mobile
   - Optimized for all devices

4. **Code Quality**
   - 80%+ test coverage
   - 0 accessibility violations
   - TypeScript strict mode
   - 0 console errors/warnings

---

## Version History

- **1.0.0** (2026-01-15): Initial specification for Phase II
