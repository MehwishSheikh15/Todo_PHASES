// Simple test script to verify the backend setup
const TaskModel = require('./models/Task');

console.log('Testing Task Model...');

// Test creating a task
console.log('Creating a test task...');
TaskModel.create({
  title: 'Test task',
  description: 'This is a test task for verification'
}, (err, result) => {
  if (err) {
    console.error('Error creating task:', err);
    return;
  }

  console.log('Created task with ID:', result.id);

  // Test getting the task
  console.log('Retrieving the created task...');
  TaskModel.getById(result.id, (err, task) => {
    if (err) {
      console.error('Error retrieving task:', err);
      return;
    }

    console.log('Retrieved task:', task);

    // Test updating the task
    console.log('Updating the task status to completed...');
    TaskModel.updateStatus(result.id, 'completed', (err, changes) => {
      if (err) {
        console.error('Error updating task:', err);
        return;
      }

      console.log('Updated task status. Rows affected:', changes);

      // Test getting all tasks
      console.log('Getting all tasks...');
      TaskModel.getAll((err, tasks) => {
        if (err) {
          console.error('Error getting tasks:', err);
          return;
        }

        console.log('All tasks:', tasks);

        // Test deleting the task
        console.log('Deleting the test task...');
        TaskModel.delete(result.id, (err, changes) => {
          if (err) {
            console.error('Error deleting task:', err);
            return;
          }

          console.log('Deleted task. Rows affected:', changes);
          console.log('Test completed successfully!');

          // Close the database connection
          TaskModel.close();
        });
      });
    });
  });
});