# Skill Specification: Spec-Driven Builder

**Version**: 1.0.0
**Created**: 2026-01-15
**Category**: Architecture & Design
**Phase Coverage**: II, III, IV, V

---

## Purpose

Transforms natural language feature descriptions into complete, constitutionally compliant specification documents following the Spec-Driven Development methodology. Ensures all features begin with proper specification before implementation.

**Core Mission**: Generate comprehensive, unambiguous specifications that serve as the single source of truth for feature implementation.

---

## Inputs

### Required Inputs

```typescript
interface SpecDrivenBuilderInput {
  feature_description: string;           // Natural language feature description
  user_stories?: string[];               // Optional prioritized user journeys
  constraints?: {                        // Optional technical/business constraints
    authentication?: string;
    database?: string;
    max_response_time?: string;
    budget?: string;
  };
  context?: {                           // Optional existing system context
    related_features?: string[];
    existing_specs?: string[];
    technology_stack?: string[];
  };
}
```

### Example Input

```json
{
  "feature_description": "Users need to create, view, update, and delete todo tasks with priority levels (high, medium, low), status tracking (todo, in-progress, done), and due dates. Tasks must be isolated per user with JWT authentication.",
  "user_stories": [
    "As a user, I want to quickly add a new task so I can capture ideas immediately",
    "As a user, I want to see all my tasks organized by priority",
    "As a user, I want to mark tasks as complete",
    "As a user, I want to edit task details",
    "As a user, I want to delete tasks I no longer need"
  ],
  "constraints": {
    "authentication": "JWT required",
    "database": "Neon PostgreSQL",
    "max_response_time": "200ms p95"
  }
}
```

---

## Outputs

### Primary Output

```typescript
interface SpecDrivenBuilderOutput {
  specification: {
    file_path: string;                  // specs/<feature-name>/spec.md
    content: string;                    // Complete spec.md content
  };
  validation_report: {
    constitutional_compliance: boolean;
    missing_sections: string[];
    clarification_needed: string[];
  };
  metadata: {
    feature_id: string;                 // e.g., "001-task-management"
    feature_name: string;
    priority_stories: string[];         // P1, P2, P3 classifications
    estimated_complexity: string;       // low, medium, high
  };
}
```

### Specification Structure

The generated `spec.md` file includes:

1. **Header**
   - Feature name and branch
   - Creation date and status
   - Input reference

2. **User Scenarios & Testing** (mandatory)
   - Prioritized user stories (P1, P2, P3)
   - Independent test descriptions
   - Acceptance scenarios (Given-When-Then)
   - Edge cases

3. **Requirements** (mandatory)
   - Functional requirements (FR-001, FR-002, etc.)
   - Key entities (if data-driven)
   - Security requirements (SEC-001, SEC-002, etc.)
   - UI/UX requirements (UI-001, UI-002, etc.)
   - Cloud-native requirements (CLOUD-001, CLOUD-002, etc.)

4. **Success Criteria** (mandatory)
   - Measurable outcomes (SC-001, SC-002, etc.)

---

## Rules

### Constitutional Compliance Rules

1. **MUST follow spec-template.md structure exactly**
   - All mandatory sections included
   - Proper heading hierarchy
   - Consistent formatting

2. **MUST prioritize user stories (P1, P2, P3)**
   - P1 = MVP, must-have functionality
   - P2 = Important, high-value features
   - P3 = Nice-to-have, future enhancements
   - Each story independently testable

3. **MUST include security requirements for every feature**
   - JWT authentication requirements
   - User isolation specifications
   - Input validation rules
   - Error handling (401/403)
   - Secrets management

4. **MUST include UI/UX requirements for user-facing features**
   - Visual design specifications
   - Responsive design (mobile, tablet, desktop)
   - Accessibility (WCAG 2.1 AA)
   - Interactive states (loading, error, empty, success)
   - Dark mode support

5. **MUST include cloud-native requirements**
   - Database specifications (Neon PostgreSQL)
   - Backend specifications (FastAPI)
   - Frontend deployment (Vercel)
   - Configuration management
   - Health check endpoints

### Quality Rules

6. **MUST mark unclear requirements with [NEEDS CLARIFICATION: reason]**
   - Never assume or invent requirements
   - Explicitly flag ambiguities
   - Provide context for clarification

7. **MUST use Given-When-Then format for acceptance scenarios**
   - Clear initial state (Given)
   - Specific action (When)
   - Expected outcome (Then)

8. **MUST ensure each user story is independently testable**
   - Story can be implemented alone
   - Story can be tested alone
   - Story delivers standalone value

9. **MUST avoid implementation details**
   - Technology-agnostic where possible
   - Focus on "what" not "how"
   - Leave implementation choices to plan phase

10. **MUST include measurable success criteria**
    - Quantifiable metrics
    - Observable outcomes
    - Testable conditions

---

## Reusability

### Scope
- **All features across all phases** (II, III, IV, V)
- Any web application following SDD methodology
- Any domain requiring specification-driven development

### Portability
- Template-driven, can be customized per project
- Works with any technology stack
- Language and framework agnostic

### Composability
- Output feeds directly into:
  - API Generator skill
  - Database Schema skill
  - UX Flow Designer skill
  - Implementation planning

### Extensibility
- Custom requirement types can be added
- Template can be extended with project-specific sections
- Validation rules can be customized per constitution

---

## Example Execution

### Input
```json
{
  "feature_description": "Task management with CRUD operations, priority levels, and due dates",
  "user_stories": [
    "As a user, I want to quickly add a new task",
    "As a user, I want to see all my tasks organized by priority",
    "As a user, I want to mark tasks as complete"
  ],
  "constraints": {
    "authentication": "JWT required",
    "database": "Neon PostgreSQL"
  }
}
```

### Processing Steps

1. **Parse Feature Description**
   - Extract entities: Task, User
   - Extract operations: Create, Read, Update, Delete
   - Extract attributes: title, priority, status, due_date
   - Extract constraints: JWT auth, user isolation

2. **Generate User Stories with Priorities**
   ```markdown
   ### User Story 1 - Quick Task Creation (Priority: P1) 🎯 MVP
   As a user, I want to quickly add a new task so I can capture ideas immediately.

   **Why this priority**: Core functionality, essential for MVP

   **Independent Test**: Can create a task and see it in the task list

   **Acceptance Scenarios**:
   1. **Given** I am authenticated, **When** I enter a task title and click "Add", **Then** the task appears in my task list
   2. **Given** I am not authenticated, **When** I try to add a task, **Then** I receive a 401 error
   ```

3. **Generate Requirements**
   ```markdown
   ### Functional Requirements
   - **FR-001**: System MUST allow authenticated users to create tasks with title, description, priority, and due date
   - **FR-002**: System MUST allow users to view all their tasks
   - **FR-003**: System MUST allow users to update task details
   - **FR-004**: System MUST allow users to delete tasks
   - **FR-005**: System MUST filter tasks by status (todo, in-progress, done)

   ### Security Requirements
   - **SEC-001**: All API endpoints MUST validate JWT tokens using BETTER_AUTH_SECRET
   - **SEC-002**: All database queries MUST filter by authenticated user_id (row-level security)
   - **SEC-003**: All user inputs MUST be validated and sanitized
   - **SEC-004**: System MUST return 401 for missing/invalid tokens
   - **SEC-005**: System MUST return 403 for cross-user access attempts

   ### UI/UX Requirements
   - **UI-001**: Dashboard MUST have sidebar navigation with task board in main content area
   - **UI-002**: Task cards MUST display status badges and priority tags
   - **UI-003**: Quick-add modal MUST appear on button click with inline validation
   - **UI-004**: Mobile (320px-767px) MUST show single column with collapsible sidebar
   - **UI-005**: Desktop (1024px+) MUST show three columns (todo, in-progress, done)
   - **UI-007**: WCAG 2.1 AA compliance MUST be met
   - **UI-011**: Loading states MUST show skeleton screens
   - **UI-012**: Error states MUST show actionable error messages
   - **UI-013**: Empty states MUST show onboarding illustrations

   ### Cloud-Native Requirements
   - **CLOUD-001**: Use Neon PostgreSQL with connection pooling; schema migrations via Alembic
   - **CLOUD-002**: FastAPI backend MUST be stateless; all state in PostgreSQL or JWT
   - **CLOUD-003**: Frontend MUST be deployable on Vercel with static optimization
   - **CLOUD-004**: Environment variables for DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS
   - **CLOUD-005**: Implement /health (liveness) and /ready (readiness) endpoints
   ```

4. **Generate Success Criteria**
   ```markdown
   ### Measurable Outcomes
   - **SC-001**: Users can create a task in under 5 seconds
   - **SC-002**: Task list loads in under 200ms (p95 latency)
   - **SC-003**: 95% of users successfully complete task creation on first attempt
   - **SC-004**: Zero cross-user data access incidents
   ```

5. **Validate Constitutional Compliance**
   ```json
   {
     "constitutional_compliance": true,
     "checks": {
       "spec_before_code": true,
       "security_requirements": true,
       "ui_ux_requirements": true,
       "cloud_native_requirements": true,
       "user_isolation": true,
       "observability": true
     }
   }
   ```

### Output

**File**: `specs/001-task-management/spec.md`

```markdown
# Feature Specification: Task Management

**Feature Branch**: `001-task-management`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Task management with CRUD operations..."

## User Scenarios & Testing

### User Story 1 - Quick Task Creation (Priority: P1) 🎯 MVP
[Full content as shown above]

### User Story 2 - Task Organization by Priority (Priority: P2)
[...]

### User Story 3 - Task Completion (Priority: P1) 🎯 MVP
[...]

## Requirements

### Functional Requirements
[Full content as shown above]

### Key Entities
- **Task**: Represents a todo item with title, description, priority, status, due_date, user_id
- **User**: Represents an authenticated user who owns tasks

### Security Requirements
[Full content as shown above]

### UI/UX Requirements
[Full content as shown above]

### Cloud-Native Requirements
[Full content as shown above]

## Success Criteria

### Measurable Outcomes
[Full content as shown above]
```

**Validation Report**:
```json
{
  "constitutional_compliance": true,
  "missing_sections": [],
  "clarification_needed": [],
  "quality_score": 95
}
```

---

## Integration with Other Skills

### Feeds Into

1. **API Generator**
   - Provides functional requirements for API endpoints
   - Provides entity definitions for data models
   - Provides security requirements for authentication

2. **Database Schema**
   - Provides entity definitions for tables
   - Provides relationships for foreign keys
   - Provides constraints for validation

3. **UX Flow Designer**
   - Provides user stories for flow design
   - Provides UI/UX requirements for components
   - Provides interaction specifications

4. **Implementation Planning**
   - Provides complete requirements for task breakdown
   - Provides success criteria for acceptance testing
   - Provides priorities for MVP definition

---

## Error Handling

### Common Issues

1. **Ambiguous Feature Description**
   - **Detection**: Multiple interpretations possible
   - **Action**: Generate clarification questions
   - **Output**: Mark requirements with [NEEDS CLARIFICATION]

2. **Missing Critical Information**
   - **Detection**: Cannot determine security/UI/cloud requirements
   - **Action**: Use constitutional defaults
   - **Output**: Flag for architect review

3. **Conflicting Requirements**
   - **Detection**: User stories contradict each other
   - **Action**: Highlight conflicts
   - **Output**: Request user prioritization

4. **Over-Specified Implementation**
   - **Detection**: Feature description includes "how" not "what"
   - **Action**: Extract requirements, remove implementation
   - **Output**: Technology-agnostic specification

---

## Performance Characteristics

- **Execution Time**: 30-60 seconds for typical feature
- **Token Usage**: ~2000-4000 tokens (input + output)
- **Quality Score**: 90%+ constitutional compliance
- **Clarification Rate**: <10% of requirements need clarification

---

## Version History

- **1.0.0** (2026-01-15): Initial skill specification
