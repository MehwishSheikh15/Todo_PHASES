# Skill Specification: MCP Tool Builder

**Version**: 1.0.0
**Created**: 2026-01-15
**Category**: AI Integration & Tooling
**Phase Coverage**: III, IV, V

---

## Purpose

Generates Model Context Protocol (MCP) tool wrappers for AI agent integration. Enables Phase III agent orchestration by exposing skills and backend capabilities as MCP-compatible tools that agents can invoke.

**Core Mission**: Transform skills and APIs into standardized MCP tools that AI agents can discover, understand, and invoke safely.

---

## Inputs

### Required Inputs

```typescript
interface MCPToolBuilderInput {
  skill_definition: {
    name: string;                       // e.g., "api-generator"
    purpose: string;                    // What the skill does
    inputs: Record<string, any>;        // Input schema
    outputs: Record<string, any>;       // Output schema
    rules: string[];                    // Execution rules
  };
  tool_category: string;                // "data", "api", "ui", "security", "deployment"
  agent_context: string;                // Which agent will use this tool
  authentication?: {
    required: boolean;
    method: string;                     // "jwt", "api-key"
  };
  rate_limiting?: {
    max_calls: number;
    window: string;                     // e.g., "1 hour"
  };
}
```

### Example Input

```json
{
  "skill_definition": {
    "name": "api-generator",
    "purpose": "Generate FastAPI code from specifications",
    "inputs": {
      "spec_file": "string",
      "entities": "array",
      "authentication_mode": "string"
    },
    "outputs": {
      "api_contract": "string",
      "fastapi_code": "string",
      "test_suite": "string"
    },
    "rules": [
      "MUST require JWT authentication on all endpoints",
      "MUST filter all queries by user_id"
    ]
  },
  "tool_category": "api",
  "agent_context": "backend-engineering-agent",
  "authentication": {
    "required": true,
    "method": "jwt"
  },
  "rate_limiting": {
    "max_calls": 10,
    "window": "1 hour"
  }
}
```

---

## Outputs

### Primary Outputs

```typescript
interface MCPToolBuilderOutput {
  mcp_tool_spec: {
    json: string;                       // MCP tool definition
    file_path: string;                  // mcp/tools/<tool-name>.json
  };
  tool_implementation: {
    code: string;                       // Python/TypeScript implementation
    file_path: string;                  // mcp/tools/<tool-name>.py
  };
  integration_guide: {
    markdown: string;                   // How to use tool in agent workflows
    file_path: string;                  // mcp/docs/<tool-name>.md
  };
  test_suite: {
    code: string;                       // Tool invocation tests
    file_path: string;                  // mcp/tests/test_<tool-name>.py
  };
  openapi_spec?: {
    yaml: string;                       // REST API for tool (if applicable)
    file_path: string;                  // mcp/api/<tool-name>.yaml
  };
}
```

---

## Rules

### MCP Compliance Rules (Non-Negotiable)

1. **MUST follow MCP specification exactly**
   - Tool name, description, parameters
   - Input schema (JSON Schema)
   - Output schema (JSON Schema)
   - Error codes and messages
   - Version information

2. **MUST validate all inputs against JSON Schema**
   - Type validation
   - Required fields
   - Format validation
   - Range constraints
   - Pattern matching

3. **MUST return structured outputs** (not plain text)
   - JSON format
   - Consistent structure
   - Include metadata (execution time, version)
   - Include correlation IDs

4. **MUST include error codes for all failure modes**
   - 400: Invalid input
   - 401: Authentication required
   - 403: Insufficient permissions
   - 429: Rate limit exceeded
   - 500: Internal error
   - 503: Service unavailable

5. **MUST implement authentication if tool modifies data**
   - JWT token validation
   - User context extraction
   - Permission checking
   - Audit logging

### Safety Rules

6. **MUST implement rate limiting to prevent abuse**
   - Per-user limits
   - Per-tool limits
   - Sliding window algorithm
   - Graceful degradation

7. **MUST log all tool invocations with correlation IDs**
   - Tool name and version
   - Input parameters (sanitized)
   - Execution time
   - Success/failure status
   - User context

8. **MUST include usage examples in documentation**
   - Basic usage
   - Advanced usage
   - Error handling
   - Best practices

9. **MUST support both synchronous and asynchronous invocation**
   - Sync: Return result immediately (< 30s)
   - Async: Return job ID, poll for result
   - Webhooks for completion notification

10. **MUST include timeout handling** (default: 30 seconds)
    - Configurable timeout
    - Graceful timeout handling
    - Partial result return if possible

### Versioning Rules

11. **MUST support idempotent operations where applicable**
    - Same input → same output
    - Safe to retry
    - No side effects on retry

12. **MUST version tools** (semantic versioning)
    - MAJOR: Breaking changes to input/output
    - MINOR: New optional parameters
    - PATCH: Bug fixes, no API changes

---

## Reusability

### Scope
- Phase III (MCP + AI Agents) and beyond
- Any AI agent framework supporting MCP
- Any skill or API that needs agent integration

### Portability
- MCP standard works across any AI agent framework
- JSON Schema is language-agnostic
- Can be implemented in any language

### Composability
- Tools can be chained in agent workflows
- Tools can invoke other tools
- Tools can be composed into higher-level tools

### Extensibility
- New tools can be added without breaking existing agents
- Tools can be versioned independently
- Custom tools can extend base tool class

---

## Example Execution

### Input
```json
{
  "skill_definition": {
    "name": "api-generator",
    "purpose": "Generate FastAPI code from specifications",
    "inputs": {
      "spec_file": "string",
      "entities": "array"
    },
    "outputs": {
      "api_contract": "string",
      "fastapi_code": "string"
    }
  },
  "tool_category": "api",
  "authentication": {
    "required": true,
    "method": "jwt"
  },
  "rate_limiting": {
    "max_calls": 10,
    "window": "1 hour"
  }
}
```

### Generated MCP Tool Specification

```json
{
  "name": "api-generator",
  "version": "1.0.0",
  "description": "Generate FastAPI code from specifications with JWT authentication and row-level security",
  "category": "api",
  "inputSchema": {
    "type": "object",
    "properties": {
      "spec_file": {
        "type": "string",
        "description": "Path to feature specification file",
        "pattern": "^specs/.*\\.md$"
      },
      "entities": {
        "type": "array",
        "description": "List of entities with attributes and operations",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Entity name (e.g., Task, User)"
            },
            "attributes": {
              "type": "object",
              "description": "Entity attributes with types"
            },
            "operations": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": ["create", "read", "update", "delete", "list"]
              }
            }
          },
          "required": ["name", "attributes", "operations"]
        },
        "minItems": 1
      },
      "authentication_mode": {
        "type": "string",
        "description": "Authentication method",
        "enum": ["jwt", "oauth", "api-key"],
        "default": "jwt"
      },
      "database": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["postgresql"]
          },
          "provider": {
            "type": "string",
            "enum": ["neon"]
          },
          "connection_string_env": {
            "type": "string",
            "default": "DATABASE_URL"
          }
        }
      }
    },
    "required": ["spec_file", "entities"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "api_contract": {
        "type": "object",
        "properties": {
          "file_path": {
            "type": "string",
            "description": "Path to generated OpenAPI specification"
          },
          "content": {
            "type": "string",
            "description": "OpenAPI 3.0 YAML content"
          }
        }
      },
      "fastapi_code": {
        "type": "object",
        "properties": {
          "routes": {
            "type": "string",
            "description": "FastAPI route handlers"
          },
          "models": {
            "type": "string",
            "description": "Pydantic models"
          }
        }
      },
      "test_suite": {
        "type": "object",
        "properties": {
          "contract_tests": {
            "type": "string",
            "description": "Contract test code"
          },
          "integration_tests": {
            "type": "string",
            "description": "Integration test code"
          }
        }
      },
      "metadata": {
        "type": "object",
        "properties": {
          "execution_time_ms": {
            "type": "number"
          },
          "tool_version": {
            "type": "string"
          },
          "correlation_id": {
            "type": "string"
          }
        }
      }
    },
    "required": ["api_contract", "fastapi_code", "metadata"]
  },
  "errors": {
    "INVALID_SPEC_FILE": {
      "code": 400,
      "message": "Specification file not found or invalid format"
    },
    "INVALID_ENTITIES": {
      "code": 400,
      "message": "Entity definitions are invalid or incomplete"
    },
    "AUTHENTICATION_REQUIRED": {
      "code": 401,
      "message": "JWT token required for tool invocation"
    },
    "RATE_LIMIT_EXCEEDED": {
      "code": 429,
      "message": "Rate limit exceeded: 10 calls per hour"
    },
    "GENERATION_FAILED": {
      "code": 500,
      "message": "Code generation failed due to internal error"
    }
  },
  "authentication": {
    "required": true,
    "method": "jwt",
    "header": "Authorization",
    "format": "Bearer {token}"
  },
  "rateLimit": {
    "maxCalls": 10,
    "window": "1 hour",
    "scope": "per-user"
  },
  "timeout": {
    "default": 30000,
    "max": 120000
  },
  "examples": [
    {
      "name": "Generate Task API",
      "input": {
        "spec_file": "specs/001-task-management/spec.md",
        "entities": [
          {
            "name": "Task",
            "attributes": {
              "id": "uuid",
              "title": "string(200)",
              "status": "enum(todo,in_progress,done)"
            },
            "operations": ["create", "read", "update", "delete", "list"]
          }
        ],
        "authentication_mode": "jwt"
      },
      "output": {
        "api_contract": {
          "file_path": "specs/001-task-management/contracts/api.yaml",
          "content": "openapi: 3.0.0..."
        },
        "fastapi_code": {
          "routes": "from fastapi import APIRouter...",
          "models": "from pydantic import BaseModel..."
        },
        "metadata": {
          "execution_time_ms": 2500,
          "tool_version": "1.0.0",
          "correlation_id": "abc-123"
        }
      }
    }
  ]
}
```

### Generated Tool Implementation

```python
# mcp/tools/api_generator.py
from typing import Dict, Any, List
import logging
import time
import uuid
from datetime import datetime

from ..base import MCPTool, ToolError
from ..auth import require_jwt, get_user_context
from ..rate_limit import check_rate_limit
from ...skills.api_generator import APIGeneratorSkill

logger = logging.getLogger(__name__)

class APIGeneratorTool(MCPTool):
    """
    MCP Tool for generating FastAPI code from specifications.

    This tool wraps the API Generator skill and exposes it as an
    MCP-compatible tool for AI agent invocation.
    """

    name = "api-generator"
    version = "1.0.0"
    category = "api"

    def __init__(self):
        super().__init__()
        self.skill = APIGeneratorSkill()

    @require_jwt
    async def invoke(
        self,
        spec_file: str,
        entities: List[Dict[str, Any]],
        authentication_mode: str = "jwt",
        database: Dict[str, str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Invoke the API Generator tool.

        Args:
            spec_file: Path to feature specification file
            entities: List of entities with attributes and operations
            authentication_mode: Authentication method (default: jwt)
            database: Database configuration (optional)

        Returns:
            Dictionary containing generated API contract, FastAPI code, and tests

        Raises:
            ToolError: If validation fails or generation fails
        """
        correlation_id = str(uuid.uuid4())
        start_time = time.time()

        # Get user context from JWT
        user_context = get_user_context()
        user_id = user_context.get("user_id")

        logger.info(
            f"API Generator tool invoked",
            extra={
                "correlation_id": correlation_id,
                "user_id": user_id,
                "spec_file": spec_file,
                "entity_count": len(entities)
            }
        )

        try:
            # Rate limiting
            await check_rate_limit(
                tool_name=self.name,
                user_id=user_id,
                max_calls=10,
                window_seconds=3600
            )

            # Validate inputs
            self._validate_spec_file(spec_file)
            self._validate_entities(entities)

            # Invoke skill
            result = await self.skill.generate(
                spec_file=spec_file,
                entities=entities,
                authentication_mode=authentication_mode,
                database=database or {
                    "type": "postgresql",
                    "provider": "neon",
                    "connection_string_env": "DATABASE_URL"
                }
            )

            # Calculate execution time
            execution_time_ms = int((time.time() - start_time) * 1000)

            # Add metadata
            result["metadata"] = {
                "execution_time_ms": execution_time_ms,
                "tool_version": self.version,
                "correlation_id": correlation_id,
                "timestamp": datetime.utcnow().isoformat()
            }

            logger.info(
                f"API Generator tool completed successfully",
                extra={
                    "correlation_id": correlation_id,
                    "execution_time_ms": execution_time_ms
                }
            )

            return result

        except FileNotFoundError:
            logger.error(
                f"Specification file not found: {spec_file}",
                extra={"correlation_id": correlation_id}
            )
            raise ToolError(
                code="INVALID_SPEC_FILE",
                message=f"Specification file not found: {spec_file}",
                correlation_id=correlation_id
            )

        except ValueError as e:
            logger.error(
                f"Invalid entities: {str(e)}",
                extra={"correlation_id": correlation_id}
            )
            raise ToolError(
                code="INVALID_ENTITIES",
                message=f"Entity definitions are invalid: {str(e)}",
                correlation_id=correlation_id
            )

        except Exception as e:
            logger.exception(
                f"API generation failed: {str(e)}",
                extra={"correlation_id": correlation_id}
            )
            raise ToolError(
                code="GENERATION_FAILED",
                message=f"Code generation failed: {str(e)}",
                correlation_id=correlation_id
            )

    def _validate_spec_file(self, spec_file: str):
        """Validate specification file exists and is readable."""
        if not spec_file.startswith("specs/") or not spec_file.endswith(".md"):
            raise ValueError("Spec file must be in specs/ directory with .md extension")

        # Check file exists (implementation depends on file system access)
        # ...

    def _validate_entities(self, entities: List[Dict[str, Any]]):
        """Validate entity definitions."""
        if not entities:
            raise ValueError("At least one entity is required")

        for entity in entities:
            if "name" not in entity:
                raise ValueError("Entity must have a name")
            if "attributes" not in entity:
                raise ValueError(f"Entity {entity['name']} must have attributes")
            if "operations" not in entity:
                raise ValueError(f"Entity {entity['name']} must have operations")

            # Validate operations
            valid_operations = {"create", "read", "update", "delete", "list"}
            for op in entity["operations"]:
                if op not in valid_operations:
                    raise ValueError(f"Invalid operation: {op}")
```

### Generated Integration Guide

```markdown
# MCP Tool: API Generator

## Overview

The API Generator tool generates FastAPI code from feature specifications with JWT authentication and row-level security.

## Authentication

This tool requires JWT authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **Limit**: 10 calls per hour per user
- **Scope**: Per-user
- **Response**: 429 Too Many Requests when exceeded

## Usage

### Basic Usage

```python
from mcp.client import MCPClient

client = MCPClient(auth_token="your-jwt-token")

result = await client.invoke_tool(
    tool_name="api-generator",
    parameters={
        "spec_file": "specs/001-task-management/spec.md",
        "entities": [
            {
                "name": "Task",
                "attributes": {
                    "id": "uuid",
                    "title": "string(200)",
                    "status": "enum(todo,in_progress,done)"
                },
                "operations": ["create", "read", "update", "delete", "list"]
            }
        ]
    }
)

print(f"Generated API contract: {result['api_contract']['file_path']}")
print(f"Execution time: {result['metadata']['execution_time_ms']}ms")
```

### Advanced Usage

```python
result = await client.invoke_tool(
    tool_name="api-generator",
    parameters={
        "spec_file": "specs/001-task-management/spec.md",
        "entities": [...],
        "authentication_mode": "jwt",
        "database": {
            "type": "postgresql",
            "provider": "neon",
            "connection_string_env": "DATABASE_URL"
        }
    }
)
```

### Error Handling

```python
try:
    result = await client.invoke_tool("api-generator", parameters)
except ToolError as e:
    if e.code == "INVALID_SPEC_FILE":
        print(f"Spec file not found: {e.message}")
    elif e.code == "RATE_LIMIT_EXCEEDED":
        print("Rate limit exceeded. Please wait before retrying.")
    elif e.code == "AUTHENTICATION_REQUIRED":
        print("JWT token required")
    else:
        print(f"Tool error: {e.message}")
```

## Output Structure

```typescript
{
  api_contract: {
    file_path: string;
    content: string;  // OpenAPI 3.0 YAML
  };
  fastapi_code: {
    routes: string;   // FastAPI route handlers
    models: string;   // Pydantic models
  };
  test_suite: {
    contract_tests: string;
    integration_tests: string;
  };
  metadata: {
    execution_time_ms: number;
    tool_version: string;
    correlation_id: string;
    timestamp: string;
  };
}
```

## Best Practices

1. **Validate spec file exists** before invoking tool
2. **Check rate limits** before batch operations
3. **Handle errors gracefully** with retry logic
4. **Log correlation IDs** for debugging
5. **Cache results** when appropriate

## Agent Workflow Example

```python
# Agent workflow: Generate API for new feature

async def generate_feature_api(agent, feature_spec):
    # Step 1: Parse feature spec
    entities = agent.parse_entities(feature_spec)

    # Step 2: Invoke API Generator tool
    result = await agent.invoke_tool(
        "api-generator",
        spec_file=feature_spec,
        entities=entities
    )

    # Step 3: Save generated files
    await agent.save_file(
        result['api_contract']['file_path'],
        result['api_contract']['content']
    )

    # Step 4: Run tests
    await agent.invoke_tool(
        "test-runner",
        test_files=[result['test_suite']['contract_tests']]
    )

    return result
```

## Troubleshooting

### Tool invocation fails with 401

- Ensure JWT token is valid and not expired
- Check Authorization header format: `Bearer <token>`

### Tool invocation fails with 429

- Rate limit exceeded (10 calls/hour)
- Wait before retrying or request limit increase

### Generation fails with 500

- Check spec file format and completeness
- Verify entity definitions are valid
- Check logs for detailed error message
```

**Output Summary**:
- ✅ Complete MCP tool specification (JSON Schema)
- ✅ Tool implementation with authentication and rate limiting
- ✅ Comprehensive integration guide
- ✅ Error handling with specific error codes
- ✅ Usage examples and best practices
- ✅ Agent workflow examples
- ✅ Troubleshooting guide

---

## Integration with Other Skills

### Wraps
- All 8 skills can be wrapped as MCP tools
- Each skill becomes an agent-invocable tool

### Feeds Into
- **Conversation Orchestration**: Tools are invoked by orchestrator
- **AI Agent**: Agents discover and use tools
- **Backend Agent**: Tools expose backend capabilities

---

## Performance Characteristics

- **Generation Time**: 30-45 seconds per tool
- **Tool Invocation**: < 100ms overhead
- **Rate Limiting**: Redis-based, < 5ms check
- **Authentication**: JWT validation < 10ms

---

## Version History

- **1.0.0** (2026-01-15): Initial skill specification
