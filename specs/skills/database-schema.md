# Database Schema Skill

## Purpose
Generates SQLModel/SQLAlchemy database models, Alembic migrations, and database schema from entity specifications with security-by-default patterns.

## Contract
- **Input**: Entity definitions with attributes and relationships
- **Output**: Complete database schema with models, migrations, and security policies
- **Execution**: Synchronous generation with validation

## Interface
```
{
  "entities": [{
    "name": "entity name",
    "attributes": {
      "field_name": "type(constraints)"
    },
    "relationships": [{
      "type": "foreign_key|one_to_many|many_to_many",
      "target_entity": "related entity",
      "constraint": "cascade|restrict|set_null"
    }],
    "indexes": ["field_name"],
    "constraints": ["field_name validation rule"]
  }],
  "database": {
    "type": "postgresql",
    "provider": "neon",
    "security_policies": true
  }
}
```

## Implementation
- Generates SQLModel/SQLAlchemy ORM models
- Creates Alembic migration files
- Implements row-level security policies
- Adds indexes and constraints
- Creates seed data for development

## Error Handling
- Validates entity relationships before generation
- Checks for circular dependencies
- Generates rollback-safe migrations