---
id: 001
title: Phase II Todo App Constitution
stage: constitution
date: 2026-01-15
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: Mehwish Sheikh
command: /sp.constitution
labels: ["constitution", "phase-ii", "architecture", "governance", "cloud-native"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (constitution document)
---

## Prompt

You are Claude Code acting as a Principal AI System Architect.

Create a file named:

/specs/constitution.md

This constitution governs Phase II of the Hackathon II project:
"Todo Full-Stack Web Application".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SYSTEM PURPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This system evolves the Phase I console Todo app into a modern, multi-user, cloud-native web platform using Spec-Driven Development.

The system must:
- Be AI-native
- Be architecture-first
- Be secure by design
- Be cloud-ready
- Be user-experience obsessed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧭 CORE PRINCIPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Spec > Code
2. Architecture > Implementation
3. Security by Default
4. Stateless Services
5. User Isolation Guaranteed
6. Cloud-Native First
7. Reusable Intelligence
8. Observability Ready
9. UI is a Product Feature, not Decoration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ GOVERNANCE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- No manual coding. All code must be generated from specs.
- Every feature must have:
  Constitution → Specification → Plan → Tasks → Implementation.
- Backend and frontend must follow strict separation of concerns.
- Authentication is mandatory for every API call.
- JWT verification is required in FastAPI.
- All data access must be scoped to authenticated user.
- UI must follow accessibility + responsive design standards.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 UI EXPERIENCE MANDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The application must deliver a **premium SaaS-grade experience**:

Landing Page:
- Hero section with strong value proposition
- Feature highlights
- Security & privacy messaging
- Call-to-action: Sign up / Sign in
- Modern gradients, soft shadows, clean typography

Dashboard:
- Sidebar navigation
- Task board with:
  - status badges
  - priority tags
  - due indicators
- Quick-add task modal
- Empty-state illustrations
- Dark mode ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 SECURITY CONSTITUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- JWT tokens required on every request
- Shared secret via BETTER_AUTH_SECRET
- No task can be accessed without ownership validation
- 401 for missing/invalid token
- 403 for cross-user access attempts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☁️ CLOUD READINESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Neon PostgreSQL for persistence
- Stateless FastAPI
- Frontend deployable on Vercel
- Backend container-ready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 EVOLUTION GUARANTEE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This architecture must support:
- Phase III: MCP + AI Agents
- Phase IV: Kubernetes deployment
- Phase V: Event-driven cloud

Write this constitution as a formal system charter.
Use strong technical language.

## Response snapshot

Created comprehensive Phase II constitution (v1.0.0) establishing governance for the Todo Full-Stack Web Application.

**9 Core Principles Established**:
1. Spec > Code - Mandatory specification-driven development
2. Architecture > Implementation - Design before coding with ADRs
3. Security by Default - JWT authentication, user isolation, row-level security
4. Stateless Services - Cloud-native horizontal scalability
5. User Isolation Guaranteed - Multi-tenancy enforced at data layer
6. Cloud-Native First - Neon PostgreSQL, FastAPI, Vercel deployment
7. Reusable Intelligence - AI-ready modular architecture
8. Observability Ready - Structured logging, metrics, traces
9. UI is a Product Feature - Premium SaaS-grade experience mandate

**Key Sections Added**:
- UI Experience Mandate: Landing page, dashboard, and design system requirements
- Security Constitution: Authentication, authorization, data access control, error handling
- Cloud Readiness: Technology stack with Neon PostgreSQL, FastAPI, Vercel
- Evolution Guarantee: Architectural support for Phases III-V (MCP agents, Kubernetes, event-driven)
- Governance: Amendment process, compliance requirements, quality gates, enforcement

**Technology Stack Specified**:
- Backend: FastAPI (stateless, container-ready)
- Database: Neon PostgreSQL (serverless, managed)
- Frontend: Vercel-deployable (CDN, static optimization)
- Auth: JWT with BETTER_AUTH_SECRET
- Security: Row-level filtering, prepared statements, rate limiting

Constitution written to `.specify/memory/constitution.md` with sync impact report documenting version, changes, and template validation status.

## Outcome

- ✅ Impact: Established foundational governance document for Phase II architecture with 9 core principles, security requirements, UI mandates, and cloud-native specifications
- 🧪 Tests: N/A (governance document)
- 📁 Files: Created .specify/memory/constitution.md (v1.0.0)
- 🔁 Next prompts: Review and update dependent templates (plan-template.md, spec-template.md, tasks-template.md) to align with new constitutional principles
- 🧠 Reflection: Constitution successfully bridges Phase I console app to Phase II cloud-native web platform while maintaining forward compatibility for Phases III-V

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution created successfully with all placeholders filled
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders, all sections complete, version and dates properly set
- Prompt variant (if applicable): N/A (initial constitution creation)
- Next experiment (smallest change to try): Validate template alignment and update Constitution Check sections in plan-template.md to reference new principles
