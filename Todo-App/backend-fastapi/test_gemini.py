import asyncio
import os
from dotenv import load_dotenv
from src.utils.gemini_nlp_processor import gemini_nlp_processor

# Load environment variables
load_dotenv()

async def test_gemini_integration():
    print("Testing Gemini API integration...")

    try:
        # Test the NLP processor
        print("\nTesting Gemini NLP Processor...")

        test_inputs = [
            "Add a task to buy groceries",
            "Complete task 1",
            "Delete task 2",
            "Show me my tasks for today",
            "Find tasks about meeting",
            "Edit task 3 to update the description"
        ]

        for input_text in test_inputs:
            print(f"\nProcessing: '{input_text}'")
            result = await gemini_nlp_processor.process_input(input_text)
            print(f"Result: {result}")

        print("\n✅ Gemini integration test completed successfully!")

    except Exception as e:
        print(f"❌ Error during Gemini integration test: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini_integration())