const axios = require('axios');

async function testChatbot() {
  const baseURL = 'http://localhost:3000';

  console.log('Testing TODO Chatbot functionality...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    try {
      const healthRes = await axios.get(`${baseURL}/health`);
      console.log('✓ Health check passed:', healthRes.data);
    } catch (error) {
      console.log('✗ Health check failed:', error.message);
    }

    // Test 2: Add a task via chat
    console.log('\n2. Testing task creation via chat...');
    try {
      const addRes = await axios.post(`${baseURL}/api/chat`, {
        message: "Add a task to buy groceries"
      });
      console.log('✓ Task creation via chat successful:', addRes.data);
    } catch (error) {
      console.log('✗ Task creation via chat failed:', error.message);
    }

    // Test 3: Add a task via direct API
    console.log('\n3. Testing direct task creation...');
    try {
      const taskRes = await axios.post(`${baseURL}/api/tasks`, {
        title: "Test task from API",
        description: "This is a test task created via direct API call"
      });
      console.log('✓ Direct task creation successful:', taskRes.data);
    } catch (error) {
      console.log('✗ Direct task creation failed:', error.message);
    }

    // Test 4: Get all tasks
    console.log('\n4. Testing task retrieval...');
    try {
      const tasksRes = await axios.get(`${baseURL}/api/tasks`);
      console.log('✓ Task retrieval successful:', tasksRes.data.length, 'tasks found');
      if (tasksRes.data.length > 0) {
        console.log('Sample task:', tasksRes.data[0]);
      }
    } catch (error) {
      console.log('✗ Task retrieval failed:', error.message);
    }

    // Test 5: Complete a task via chat
    console.log('\n5. Testing task completion via chat...');
    try {
      const completeRes = await axios.post(`${baseURL}/api/chat`, {
        message: "Complete the first task"
      });
      console.log('✓ Task completion via chat attempted:', completeRes.data);
    } catch (error) {
      console.log('✗ Task completion via chat failed:', error.message);
    }

    // Test 6: Delete a task via chat
    console.log('\n6. Testing task deletion via chat...');
    try {
      const deleteRes = await axios.post(`${baseURL}/api/chat`, {
        message: "Delete the first task"
      });
      console.log('✓ Task deletion via chat attempted:', deleteRes.data);
    } catch (error) {
      console.log('✗ Task deletion via chat failed:', error.message);
    }

    console.log('\nTesting completed.');
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Run the test
testChatbot();