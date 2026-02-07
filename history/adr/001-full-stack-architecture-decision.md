---
title: Full-Stack Architecture Decision
status: Accepted
date: 2026-01-21
references:
  - plan.md
  - spec.md
---

## Context

Our team needs to build a scalable, maintainable todo application with modern technology stacks. We evaluated different approaches for both frontend and backend architectures considering factors like developer experience, performance, scalability, and ecosystem maturity.

## Decision

We will use a Next.js 14 frontend with App Router and FastAPI backend with SQLModel. This creates a full-stack solution with:

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and React Query
- **Backend**: FastAPI with SQLModel, PostgreSQL, and JWT authentication
- **Deployment**: Frontend on Vercel, Backend on containerized infrastructure
- **Communication**: REST API with JSON over HTTP

## Alternatives Considered

1. **Monolithic approach with React + Express**: Would couple frontend and backend, limiting flexibility
2. **Micro-frontend with multiple frameworks**: Would add complexity without clear benefits for this scale
3. **Backend with Django/DRF**: Would limit async capabilities and modern API features compared to FastAPI
4. **Frontend with React + CRA**: Would lack SSR/SSG capabilities of Next.js

## Consequences

### Positive
- Fast development with excellent developer experience
- Strong type safety across the stack
- Excellent performance with Next.js optimizations
- Automatic API documentation with FastAPI
- Easy deployment and scaling
- Strong community support for both technologies

### Negative
- Two separate codebases to maintain
- Need to manage authentication across both frontend and backend
- Additional complexity in coordinating deployments
- Larger bundle sizes if not optimized properly

## References

- [Plan](../../specs/plan.md)
- [Specification](../../specs/spec.md)