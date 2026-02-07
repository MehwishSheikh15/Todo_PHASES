# Database Schema Specification

## Purpose
This document defines the database schema for the Phase II Todo application using Neon PostgreSQL. It outlines the table structures, relationships, indexes, and constraints required for the application's data persistence layer.

## Database Configuration
- **Provider**: Neon PostgreSQL (serverless)
- **Connection Pooling**: Enabled (20 connections)
- **Environment**: Separate databases for development, staging, and production
- **Backup Strategy**: Automated daily backups with point-in-time recovery
- **Security**: SSL encryption required for all connections

## Table Definitions

### users Table
Stores user account information.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);
```

**Constraints:**
- `email` must be unique and not null
- `password_hash` must not be null
- `email` length maximum 255 characters
- `display_name` length maximum 100 characters
- `id` auto-generated UUID primary key

**Indexes:**
- Primary key index on `id`
- Unique index on `email`
- Index on `is_active` for filtering
- Index on `created_at` for sorting

### tasks Table
Stores task information associated with users.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium',
    category VARCHAR(50),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Constraints:**
- `title` must not be null and maximum 200 characters
- `description` maximum 1000 characters
- `status` must be one of: 'todo', 'in-progress', 'done'
- `priority` must be one of: 'low', 'medium', 'high'
- `category` maximum 50 characters
- `user_id` foreign key reference to `users.id` with cascade delete
- `completed_at` must be null when `status` is not 'done'
- `due_date` must be in the future when provided

**Indexes:**
- Primary key index on `id`
- Index on `user_id` for user-specific queries
- Composite index on `user_id` and `status` for filtered queries
- Index on `due_date` for date-based sorting
- Index on `priority` for priority-based sorting
- Index on `created_at` for chronological ordering

## Data Types Mapping

### User-Defined Types
```sql
-- Task status enumeration
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');

-- Task priority enumeration
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
```

### Updated Table Definitions with Custom Types
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    category VARCHAR(50),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Relationships

### Foreign Key Relationships
- `tasks.user_id` → `users.id` (One-to-Many: One user to many tasks)
- Cascade delete: When a user is deleted, all their tasks are also deleted

### Access Control
Row Level Security (RLS) will be implemented to ensure users can only access their own data:
```sql
-- Enable RLS on tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY user_access_policy ON users
    FOR ALL TO authenticated_users
    USING (id = current_setting('app.current_user_id')::UUID);

-- Create policies for tasks table
CREATE POLICY task_access_policy ON tasks
    FOR ALL TO authenticated_users
    USING (user_id = current_setting('app.current_user_id')::UUID);
```

## Indexes and Performance

### Required Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Tasks table indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_category ON tasks(category);
```

### Composite Indexes for Common Queries
```sql
-- For retrieving user tasks with status filter
CREATE INDEX idx_tasks_user_status_priority ON tasks(user_id, status, priority);

-- For date range queries
CREATE INDEX idx_tasks_user_created_range ON tasks(user_id, created_at DESC);

-- For due date sorting
CREATE INDEX idx_tasks_user_due_date ON tasks(user_id, due_date);
```

## Constraints and Validation

### Check Constraints
```sql
-- Validate email format
ALTER TABLE users ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Validate status values
ALTER TABLE tasks ADD CONSTRAINT valid_status CHECK (status IN ('todo', 'in-progress', 'done'));

-- Validate priority values
ALTER TABLE tasks ADD CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high'));

-- Validate completed_at only when status is 'done'
ALTER TABLE tasks ADD CONSTRAINT completed_only_when_done
    CHECK ((status = 'done' AND completed_at IS NOT NULL) OR (status != 'done' AND completed_at IS NULL));

-- Validate due_date is in the future when provided
ALTER TABLE tasks ADD CONSTRAINT due_date_future
    CHECK (due_date IS NULL OR due_date > CURRENT_TIMESTAMP);
```

### Unique Constraints
```sql
-- Ensure email uniqueness
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

## Audit Trail (Optional Future Enhancement)
```sql
-- Audit table for tracking changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to populate audit log (example for tasks)
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), NEW.user_id);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), row_to_json(NEW), NEW.user_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), OLD.user_id);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tasks table
CREATE TRIGGER tasks_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

## Data Migration Strategy

### Initial Setup
1. Create custom ENUM types
2. Create tables with constraints
3. Create indexes
4. Enable Row Level Security
5. Create security policies

### Future Migration Considerations
- Add `deleted_at` column for soft deletes (if needed)
- Add `tags` column as JSONB for task tagging
- Add `parent_task_id` for hierarchical tasks
- Add `estimated_duration` for time tracking

## Security Considerations

### Row Level Security (RLS)
- All tables should have RLS enabled
- Policies ensure users can only access their own data
- Application should set `app.current_user_id` in session

### Connection Security
- Force SSL connections
- Use parameterized queries to prevent SQL injection
- Validate all inputs before database operations
- Encrypt sensitive data at rest if needed

### Access Control
- Database user permissions limited to necessary operations
- Separate database users for different application components
- Regular access reviews and audits

## Performance Optimization

### Query Optimization
- Use EXPLAIN ANALYZE for slow query identification
- Implement proper indexing strategies
- Consider partitioning for large tables if needed
- Monitor query performance regularly

### Connection Management
- Implement connection pooling
- Set appropriate timeout values
- Monitor connection usage patterns
- Optimize for serverless database considerations

## Backup and Recovery

### Backup Schedule
- Daily automated backups
- Point-in-time recovery enabled
- Retention: 7 days for development, 30 days for production

### Recovery Procedures
- Test backup restoration regularly
- Document recovery procedures
- Have emergency access procedures
- Maintain backup verification scripts

## Sample Data
```sql
-- Insert sample user
INSERT INTO users (email, password_hash, display_name)
VALUES ('john.doe@example.com', '$2b$12$hashed_password_here', 'John Doe');

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, category, due_date, user_id)
VALUES
    ('Complete project proposal', 'Finish the project proposal document', 'todo', 'high', 'work', '2023-12-31 23:59:59+00', 'user-uuid-here'),
    ('Team meeting preparation', 'Prepare agenda and materials for team meeting', 'in-progress', 'medium', 'work', '2023-12-25 10:00:00+00', 'user-uuid-here'),
    ('Buy groceries', 'Get milk, bread, eggs, and fruits', 'todo', 'low', 'personal', '2023-12-20 18:00:00+00', 'user-uuid-here');
```

## Maintenance Scripts

### Cleanup Old Sessions (if applicable)
```sql
-- Example cleanup script for expired data
DELETE FROM audit_log
WHERE changed_at < NOW() - INTERVAL '30 days';
```

### Statistics Update
```sql
-- Update table statistics for query optimizer
ANALYZE users, tasks;
```