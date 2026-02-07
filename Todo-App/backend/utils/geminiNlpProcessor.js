const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

class GeminiNLPProcessor {
  constructor() {}

  // Process user input using Gemini AI
  async processInput(input) {
    try {
      // Define the prompt for the AI to understand the user's intent
      const prompt = `
        You are a task management assistant. Analyze the following user input and respond in JSON format.

        User input: "${input}"

        Please analyze this input and return a JSON object with the following structure:
        {
          "intent": "ADD|COMPLETE|DELETE|EDIT|SEARCH|VIEW_PLAN|UNKNOWN",
          "task_details": {
            "title": "extracted task title if applicable",
            "description": "extracted description if applicable",
            "id": "task ID if referenced in the input"
          },
          "search_query": "search query if intent is SEARCH, otherwise null",
          "time_period": "today|week|month|all if intent is VIEW_PLAN, otherwise null"
        }

        Be precise in identifying the intent and extracting relevant information. If the intent is ADD, extract the task title. If it's COMPLETE, DELETE, or EDIT, try to identify the task ID or title. If it's SEARCH, extract the search query. If it's VIEW_PLAN, identify the time period.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response (in case it includes other text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let parsedResponse = JSON.parse(jsonMatch[0]);

        // Validate and normalize the response
        parsedResponse.intent = parsedResponse.intent || "UNKNOWN";
        parsedResponse.task_details = parsedResponse.task_details || {};
        parsedResponse.task_details.title = parsedResponse.task_details.title || "";
        parsedResponse.task_details.description = parsedResponse.task_details.description || "";
        parsedResponse.task_details.id = parsedResponse.task_details.id || null;
        parsedResponse.search_query = parsedResponse.search_query || null;
        parsedResponse.time_period = parsedResponse.time_period || null;

        return parsedResponse;
      } else {
        // Fallback to rule-based processing if Gemini doesn't return proper JSON
        return this.fallbackProcessInput(input);
      }
    } catch (error) {
      console.error("Error processing input with Gemini:", error);

      // Fallback to rule-based processing if Gemini fails
      return this.fallbackProcessInput(input);
    }
  }

  // Fallback rule-based processing in case Gemini fails
  fallbackProcessInput(input) {
    // This replicates the original nlpProcessor.js logic
    const lowerInput = input.toLowerCase();

    // Check for search intent
    if (this.containsAny(lowerInput, ['search', 'find', 'show me', 'what', 'looking for', 'where is'])) {
      return {
        intent: 'SEARCH',
        task_details: { title: "", description: "", id: null },
        search_query: this.extractSearchTerm(input),
        time_period: null
      };
    }

    // Check for plan/view intent (weekly, monthly, etc.)
    if (this.containsAny(lowerInput, ['week', 'month', 'today', 'tomorrow', 'yesterday', 'plan', 'schedule', 'agenda'])) {
      return {
        intent: 'VIEW_PLAN',
        task_details: { title: "", description: "", id: null },
        search_query: null,
        time_period: this.extractTimePeriod(input)
      };
    }

    // Check for add intent
    if (this.containsAny(lowerInput, ['add', 'create', 'make', 'new']) &&
        this.containsAny(lowerInput, ['task', 'todo', 'do', 'need to', 'have to'])) {
      return {
        intent: 'ADD',
        task_details: this.extractTaskInfo(input),
        search_query: null,
        time_period: null
      };
    }

    // Check for complete/finish intent
    if (this.containsAny(lowerInput, ['complete', 'finish', 'done', 'completed', 'finished'])) {
      return {
        intent: 'COMPLETE',
        task_details: { ...this.extractTaskInfo(input), id: this.extractTaskId(input) },
        search_query: null,
        time_period: null
      };
    }

    // Check for delete intent
    if (this.containsAny(lowerInput, ['delete', 'remove', 'cancel', 'clear', 'done with'])) {
      return {
        intent: 'DELETE',
        task_details: { ...this.extractTaskInfo(input), id: this.extractTaskId(input) },
        search_query: null,
        time_period: null
      };
    }

    // Check for edit/update intent
    if (this.containsAny(lowerInput, ['edit', 'update', 'change', 'modify', 'alter'])) {
      return {
        intent: 'EDIT',
        task_details: { ...this.extractTaskInfo(input), id: this.extractTaskId(input) },
        search_query: null,
        time_period: null
      };
    }

    // Default to ADD if it looks like a task
    if (lowerInput.includes('to ') || lowerInput.includes('need to ') || lowerInput.includes('have to ')) {
      return {
        intent: 'ADD',
        task_details: this.extractTaskInfo(input),
        search_query: null,
        time_period: null
      };
    }

    return {
      intent: 'UNKNOWN',
      task_details: { title: input, description: "", id: null },
      search_query: null,
      time_period: null
    };
  }

  // Helper to check if text contains any of the keywords
  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
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

    return { title, description: "", id: null };
  }

  // Extract task ID from message
  extractTaskId(message) {
    // Look for numeric ID in message
    const idMatch = message.match(/\b(\d+)\b/);
    if (idMatch) {
      return parseInt(idMatch[1]);
    }
    return null;
  }

  // Extract search term
  extractSearchTerm(message) {
    // Remove common search prefixes
    let searchTerm = message.replace(/^(search|find|show me|what |what's |where is |looking for )/i, '').trim();

    // Remove trailing punctuation
    searchTerm = searchTerm.replace(/[.!?,]+$/, '');

    // If the resulting term is too short, return null
    if (searchTerm.length < 2) {
      return null;
    }

    return searchTerm;
  }

  // Extract time period for view plan
  extractTimePeriod(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('today')) return 'today';
    if (lowerMsg.includes('week') || lowerMsg.includes('this week')) return 'week';
    if (lowerMsg.includes('month') || lowerMsg.includes('this month')) return 'month';

    return 'all';
  }
}

module.exports = new GeminiNLPProcessor();