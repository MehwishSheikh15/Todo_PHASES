# Authentication & Security Skill

## Purpose
Implements JWT-based authentication, authorization, and security patterns following security-by-default principles.

## Contract
- **Input**: Authentication requirements and security constraints
- **Output**: Complete auth implementation with JWT, middleware, and security policies
- **Execution**: Synchronous generation with validation

## Interface
```
{
  "auth_method": "jwt|oauth2|api_key",
  "providers": ["better_auth", "custom"],
  "security_requirements": {
    "user_isolation": true,
    "role_based_access": false,
    "rate_limiting": true,
    "audit_logging": true
  },
  "token_config": {
    "algorithm": "HS256|RS256",
    "expiration_minutes": 60,
    "refresh_enabled": true
  }
}
```

## Implementation
- Generates JWT token creation/validation utilities
- Creates authentication middleware
- Implements user isolation patterns
- Adds rate limiting and audit logging
- Sets up password hashing and verification

## Error Handling
- Validates token signatures and expiration
- Handles authentication failures gracefully
- Logs security events for audit trail