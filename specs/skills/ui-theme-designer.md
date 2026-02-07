# UI Theme Designer Skill

## Purpose
Generates design system tokens, theme configurations, and UI component libraries following accessibility and responsive design principles.

## Contract
- **Input**: Design requirements and brand guidelines
- **Output**: Complete design system with tokens, components, and accessibility features
- **Execution**: Synchronous generation with validation

## Interface
```
{
  "brand_colors": {
    "primary": "#3b82f6",
    "secondary": "#64748b",
    "accent": "#f59e0b"
  },
  "typography": {
    "font_family": "Inter, sans-serif",
    "font_weights": ["400", "500", "600", "700"],
    "scale": ["0.75rem", "0.875rem", "1rem", "1.125rem", "..."]
  },
  "spacing": {
    "scale": ["0", "0.25rem", "0.5rem", "1rem", "1.5rem", "..."],
    "breakpoints": {
      "mobile": "320px",
      "tablet": "768px",
      "desktop": "1024px"
    }
  },
  "accessibility": {
    "wcag_level": "AA",
    "color_contrast_ratio": 4.5,
    "keyboard_navigation": true
  }
}
```

## Implementation
- Generates design tokens (colors, typography, spacing)
- Creates theme configuration files
- Implements dark mode support
- Creates accessible UI components
- Sets up responsive design patterns

## Error Handling
- Validates color contrast ratios
- Ensures keyboard navigation support
- Tests responsive layouts across devices