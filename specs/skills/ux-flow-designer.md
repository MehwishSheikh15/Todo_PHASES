# UX Flow Designer Skill

## Purpose
Designs user experience flows, component hierarchies, and interaction patterns following accessibility and usability principles.

## Contract
- **Input**: User stories and interaction requirements
- **Output**: Complete UX flows with wireframes and interaction specifications
- **Execution**: Synchronous generation with validation

## Interface
```
{
  "user_journeys": [{
    "name": "user journey name",
    "steps": ["step1", "step2", "step3"],
    "entry_points": ["home", "dashboard", "notification"],
    "success_criteria": ["goal achieved", "satisfaction measure"]
  }],
  "screens": [{
    "type": "landing|dashboard|detail|modal",
    "components": ["header", "sidebar", "content", "footer"],
    "states": ["loading", "error", "empty", "success"]
  }],
  "devices": ["mobile", "tablet", "desktop"],
  "accessibility": {
    "keyboard_navigation": true,
    "screen_reader_support": true,
    "focus_indicators": true
  }
}
```

## Implementation
- Generates user journey maps
- Creates component hierarchies
- Designs interaction patterns
- Implements responsive layouts
- Sets up accessibility features

## Error Handling
- Validates user journey completeness
- Ensures accessibility compliance
- Tests cross-device compatibility