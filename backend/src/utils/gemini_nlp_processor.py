import os
import json
import logging
import google.generativeai as genai
from typing import Dict, Any, Optional
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

class GeminiNLPProcessor:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def process_input(self, input_text: str) -> Dict[str, Any]:
        """
        Process user input using Gemini AI and return structured command
        """
        try:
            prompt = f"""
            You are a task management assistant. Analyze the following user input and respond in JSON format.

            User input: "{input_text}"

            Please analyze this input and return a JSON object with the following structure:
            {{
              "intent": "ADD|COMPLETE|DELETE|EDIT|SEARCH|VIEW_PLAN|UNKNOWN",
              "task_details": {{
                "title": "extracted task title if applicable",
                "description": "extracted description if applicable",
                "id": "task ID if referenced in the input"
              }},
              "search_query": "search query if intent is SEARCH, otherwise null",
              "time_period": "today|week|month|all if intent is VIEW_PLAN, otherwise null"
            }}

            Be precise in identifying the intent and extracting relevant information. If the intent is ADD, extract the task title. If it's COMPLETE, DELETE, or EDIT, try to identify the task ID or title. If it's SEARCH, extract the search query. If it's VIEW_PLAN, identify the time period.
            """

            response = await model.generate_content_async(prompt)

            # Extract JSON from the response
            response_text = response.text

            # Find JSON in the response (in case it includes other text)
            import re
            json_match = re.search(r'\{[\s\S]*\}', response_text)

            if json_match:
                parsed_response = json.loads(json_match.group(0))

                # Validate and normalize the response
                parsed_response.setdefault('intent', 'UNKNOWN')
                parsed_response.setdefault('task_details', {})
                parsed_response['task_details'].setdefault('title', '')
                parsed_response['task_details'].setdefault('description', '')
                parsed_response['task_details'].setdefault('id', None)
                parsed_response.setdefault('search_query', None)
                parsed_response.setdefault('time_period', None)

                return parsed_response
            else:
                # Fallback to rule-based processing if Gemini doesn't return proper JSON
                self.logger.warning("Gemini didn't return proper JSON, falling back to rule-based processing")
                return self._fallback_process_input(input_text)

        except Exception as e:
            self.logger.error(f"Error processing input with Gemini: {str(e)}")
            # Fallback to rule-based processing if Gemini fails
            return self._fallback_process_input(input_text)

    def _fallback_process_input(self, input_text: str) -> Dict[str, Any]:
        """
        Fallback rule-based processing in case Gemini fails
        """
        lower_input = input_text.lower()

        # Check for search intent
        if any(keyword in lower_input for keyword in ['search', 'find', 'show me', 'what', 'looking for', 'where is']):
            return {
                "intent": "SEARCH",
                "task_details": {"title": "", "description": "", "id": None},
                "search_query": self._extract_search_term(input_text),
                "time_period": None
            }

        # Check for plan/view intent
        if any(keyword in lower_input for keyword in ['week', 'month', 'today', 'tomorrow', 'yesterday', 'plan', 'schedule', 'agenda']):
            return {
                "intent": "VIEW_PLAN",
                "task_details": {"title": "", "description": "", "id": None},
                "search_query": None,
                "time_period": self._extract_time_period(input_text)
            }

        # Check for add intent
        if any(keyword in lower_input for keyword in ['add', 'create', 'make', 'new']) and \
           any(keyword in lower_input for keyword in ['task', 'todo', 'do', 'need to', 'have to']):
            return {
                "intent": "ADD",
                "task_details": self._extract_task_info(input_text),
                "search_query": None,
                "time_period": None
            }

        # Check for complete/finish intent
        if any(keyword in lower_input for keyword in ['complete', 'finish', 'done', 'completed', 'finished']):
            return {
                "intent": "COMPLETE",
                "task_details": {**self._extract_task_info(input_text), "id": self._extract_task_id(input_text)},
                "search_query": None,
                "time_period": None
            }

        # Check for delete intent
        if any(keyword in lower_input for keyword in ['delete', 'remove', 'cancel', 'clear', 'done with']):
            return {
                "intent": "DELETE",
                "task_details": {**self._extract_task_info(input_text), "id": self._extract_task_id(input_text)},
                "search_query": None,
                "time_period": None
            }

        # Check for edit/update intent
        if any(keyword in lower_input for keyword in ['edit', 'update', 'change', 'modify', 'alter']):
            return {
                "intent": "EDIT",
                "task_details": {**self._extract_task_info(input_text), "id": self._extract_task_id(input_text)},
                "search_query": None,
                "time_period": None
            }

        # Default to ADD if it looks like a task
        if 'to ' in lower_input or 'need to ' in lower_input or 'have to ' in lower_input:
            return {
                "intent": "ADD",
                "task_details": self._extract_task_info(input_text),
                "search_query": None,
                "time_period": None
            }

        return {
            "intent": "UNKNOWN",
            "task_details": {"title": input_text, "description": "", "id": None},
            "search_query": None,
            "time_period": None
        }

    def _extract_task_info(self, input_text: str) -> Dict[str, Any]:
        """
        Extract task information from user input
        """
        lower_input = input_text.lower()

        # Extract title (look for keywords and take the rest as title)
        title = input_text.strip()

        # Look for common patterns to extract just the task part
        import re
        to_match = re.search(r'to\s+(.+)', input_text, re.IGNORECASE)
        if to_match and to_match.group(1):
            title = to_match.group(1)
        else:
            need_to_match = re.search(r'need to\s+(.+)', input_text, re.IGNORECASE)
            if need_to_match and need_to_match.group(1):
                title = need_to_match.group(1)
            else:
                have_to_match = re.search(r'have to\s+(.+)', input_text, re.IGNORECASE)
                if have_to_match and have_to_match.group(1):
                    title = have_to_match.group(1)

        # Clean up the title
        title = title.strip().rstrip('.!?,')

        return {"title": title, "description": "", "id": None}

    def _extract_task_id(self, message: str) -> Optional[int]:
        """
        Extract task ID from message
        """
        import re
        # Look for numeric ID in message
        id_match = re.search(r'\b(\d+)\b', message)
        if id_match:
            return int(id_match.group(1))
        return None

    def _extract_search_term(self, message: str) -> Optional[str]:
        """
        Extract search term from message
        """
        # Remove common search prefixes
        import re
        search_term = re.sub(r'^(search|find|show me|what |what\'s |where is |looking for )', '', message, flags=re.IGNORECASE).strip()

        # Remove trailing punctuation
        search_term = re.sub(r'[.!?,]+$', '', search_term)

        # If the resulting term is too short, return None
        if len(search_term) < 2:
            return None

        return search_term

    def _extract_time_period(self, message: str) -> str:
        """
        Extract time period for view plan
        """
        lower_msg = message.lower()

        if 'today' in lower_msg:
            return 'today'
        if 'week' in lower_msg or 'this week' in lower_msg:
            return 'week'
        if 'month' in lower_msg or 'this month' in lower_msg:
            return 'month'

        return 'all'


# Create a singleton instance
gemini_nlp_processor = GeminiNLPProcessor()