# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec > Code
- [ ] Feature has corresponding specification document
- [ ] Specification approved before implementation planning begins

### Principle II: Architecture > Implementation
- [ ] Architectural decisions documented (ADR created if significant)
- [ ] Component boundaries and data flows defined
- [ ] Integration patterns specified

### Principle III: Security by Default
- [ ] JWT authentication required for all API endpoints
- [ ] User isolation enforced at data layer (row-level filtering)
- [ ] Error responses follow 401/403 taxonomy
- [ ] No secrets in code (environment variables documented)
- [ ] Input validation and sanitization specified

### Principle IV: Stateless Services
- [ ] No session state stored in backend services
- [ ] All state in PostgreSQL or JWT tokens
- [ ] Services horizontally scalable without coordination

### Principle V: User Isolation Guaranteed
- [ ] All database queries include user_id filtering
- [ ] Cross-user access architecturally impossible
- [ ] Multi-tenancy enforced by design, not just authorization

### Principle VI: Cloud-Native First
- [ ] Neon PostgreSQL for persistence (no local DB)
- [ ] FastAPI backend (stateless, container-ready)
- [ ] Frontend deployable on Vercel/CDN
- [ ] Environment-based configuration (no hardcoded values)
- [ ] Health check endpoints planned (/health, /ready)

### Principle VII: Reusable Intelligence
- [ ] AI capabilities designed as modular components (if applicable)
- [ ] Clear interfaces for intelligence modules
- [ ] Phase III agent integration considered

### Principle VIII: Observability Ready
- [ ] Structured logging with correlation IDs planned
- [ ] Performance metrics identified (latency, throughput, errors)
- [ ] Health and readiness endpoints included
- [ ] Error taxonomy with actionable context

### Principle IX: UI is a Product Feature
- [ ] UI/UX requirements specified (not just "make it look nice")
- [ ] Responsive design requirements (mobile, tablet, desktop)
- [ ] Accessibility compliance (WCAG 2.1 AA minimum)
- [ ] Loading states and error states designed
- [ ] Empty states with onboarding guidance
- [ ] Dark mode support (if applicable)

### UI Experience Mandate (if user-facing)
- [ ] Landing page requirements specified (hero, features, CTA)
- [ ] Dashboard design requirements specified (navigation, task board, modals)
- [ ] Design system components identified (colors, typography, spacing)
- [ ] Animation and transition standards defined

### Security Constitution
- [ ] Authentication mechanism specified (JWT with BETTER_AUTH_SECRET)
- [ ] Authorization model defined (row-level security)
- [ ] Password hashing specified (bcrypt or Argon2)
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection prevention (prepared statements)

### Cloud Readiness
- [ ] Database connection pooling planned
- [ ] Migration strategy for schema evolution
- [ ] Container configuration planned (Dockerfile)
- [ ] Environment configs for dev/staging/production
- [ ] Graceful shutdown handling

### Evolution Guarantee
- [ ] Architecture supports Phase III (MCP + AI Agents)
- [ ] Event-driven patterns considered for Phase V
- [ ] No architectural decisions that block future Kubernetes deployment

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
