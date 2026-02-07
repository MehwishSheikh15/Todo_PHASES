// Test script to verify Gemini API integration
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function testGeminiAPI() {
  try {
    console.log("Testing Gemini API connection...");

    const prompt = "Say hello and tell me you're a task management assistant.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini API Response:", text);
    console.log("✅ Gemini API is working correctly!");

    // Test the NLP processor
    console.log("\nTesting Gemini NLP Processor...");
    const geminiNlpProcessor = require('./utils/geminiNlpProcessor');

    const testInputs = [
      "Add a task to buy groceries",
      "Complete task 1",
      "Delete task 2",
      "Show me my tasks for today"
    ];

    for (const input of testInputs) {
      console.log(`\nProcessing: "${input}"`);
      const result = await geminiNlpProcessor.processInput(input);
      console.log("Result:", JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error("❌ Error testing Gemini API:", error.message);
  }
}

// Run the test
testGeminiAPI();