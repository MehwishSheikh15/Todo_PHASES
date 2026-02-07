# MCP Tool Builder Skill

## Purpose
Generates MCP (Model Context Protocol) tools from backend endpoints and services for AI agent integration.

## Contract
- **Input**: API endpoints and service methods
- **Output**: MCP-compatible tools with proper schemas and execution patterns
- **Execution**: Synchronous generation with validation

## Interface
```
{
  "service_endpoints": [{
    "name": "endpoint name",
    "path": "/api/path",
    "method": "GET|POST|PUT|DELETE",
    "description": "what the endpoint does",
    "parameters": {
      "param_name": {
        "type": "string|number|boolean",
        "required": true,
        "description": "parameter description"
      }
    },
    "returns": {
      "type": "object",
      "properties": {
        "result_field": {
          "type": "string|number|boolean",
          "description": "return field description"
        }
      }
    }
  }],
  "tool_config": {
    "timeout": 30,
    "retry_attempts": 3,
    "error_handling": "throw|return_null|fallback"
  }
}
```

## Implementation
- Generates MCP tool schemas from API endpoints
- Creates proper parameter and return type definitions
- Implements error handling patterns
- Sets up authentication for AI agents
- Creates tool execution wrappers

## Error Handling
- Validates tool schemas against MCP specification
- Handles API errors gracefully
- Implements proper timeout and retry mechanisms