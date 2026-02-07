class NLPProcessor {
  constructor() {
    // Define patterns for different task operations
    this.patterns = {
      add: [
        /\b(add|create|make|new)\b/i,
        /\b(task|todo|do|need to|have to)\b/i
      ],
      edit: [
        /\b(edit|update|change|modify|alter)\b/i,
        /\b(task|todo|item|title|description)\b/i
      ],
      delete: [
        /\b(delete|remove|cancel|clear|done with)\b/i,
        /\b(task|todo|item)\b/i
      ],
      complete: [
        /\b(complete|finish|done|completed|finished)\b/i,
        /\b(task|todo|item)\b/i
      ],
      pending: [
        /\b(pending|incomplete|not done|not finished)\b/i,
        /\b(task|todo|item)\b/i
      ]
    };

    // Keywords for extracting task details
    this.titleKeywords = ['to', 'that', 'should', 'will', 'need to', 'have to'];
  }

  // Extract task information from user input
  extractTaskInfo(input) {
    const lowerInput = input.toLowerCase();

    // Extract title (look for keywords and take the rest as title)
    let title = input.trim();

    // Look for common patterns to extract just the task part
    const toMatch = lowerInput.match(/to\s+(.+)/i);
    if (toMatch && toMatch[1]) {
      title = toMatch[1];
    } else {
      const needToMatch = lowerInput.match(/need to\s+(.+)/i);
      if (needToMatch && needToMatch[1]) {
        title = needToMatch[1];
      } else {
        const haveToMatch = lowerInput.match(/have to\s+(.+)/i);
        if (haveToMatch && haveToMatch[1]) {
          title = haveToMatch[1];
        }
      }
    }

    // Clean up the title
    title = title.trim().replace(/[.!?,]+$/, '');

    return { title };
  }

  // Determine the intent from user input
  getIntent(input) {
    const lowerInput = input.toLowerCase();

    // Check for search intent
    if (this.containsAny(lowerInput, ['search', 'find', 'show me', 'what', 'looking for', 'where is'])) {
      return 'SEARCH';
    }

    // Check for plan/view intent (weekly, monthly, etc.)
    if (this.containsAny(lowerInput, ['week', 'month', 'today', 'tomorrow', 'yesterday', 'plan', 'schedule', 'agenda'])) {
      return 'VIEW_PLAN';
    }

    // Check for add intent
    if (this.matchesPattern(lowerInput, this.patterns.add)) {
      return 'ADD';
    }

    // Check for edit/update intent
    if (this.matchesPattern(lowerInput, this.patterns.edit)) {
      return 'EDIT';
    }

    // Check for delete intent
    if (this.matchesPattern(lowerInput, this.patterns.delete)) {
      return 'DELETE';
    }

    // Check for complete/finish intent
    if (this.matchesPattern(lowerInput, this.patterns.complete)) {
      return 'COMPLETE';
    }

    // Check for pending/incomplete intent
    if (this.matchesPattern(lowerInput, this.patterns.pending)) {
      return 'PENDING';
    }

    // Default to ADD if it looks like a task
    if (lowerInput.includes('to ') || lowerInput.includes('need to ') || lowerInput.includes('have to ')) {
      return 'ADD';
    }

    return 'UNKNOWN';
  }

  // Helper to check if text contains any of the keywords
  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  // Helper to check if input matches a pattern
  matchesPattern(text, patterns) {
    return patterns.every(pattern => pattern.test(text));
  }

  // Process user input and return structured command
  processInput(input) {
    const intent = this.getIntent(input);
    const taskInfo = this.extractTaskInfo(input);

    return {
      intent,
      task: taskInfo,
      originalInput: input
    };
  }
}

module.exports = new NLPProcessor();