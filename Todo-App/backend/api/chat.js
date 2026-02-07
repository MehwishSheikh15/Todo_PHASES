const express = require('express');
const router = express.Router();
const TaskModel = require('../models/Task');
const geminiNlpProcessor = require('../utils/geminiNlpProcessor');

// POST process chat message
router.post('/', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Process the natural language input using Gemini AI
    geminiNlpProcessor.processInput(message).then(processed => {
      const { intent, task_details, search_query, time_period } = processed;

      switch (intent) {
        case 'ADD':
          handleAddTask(task_details, res);
          break;

        case 'EDIT':
          handleEditTask(message, res);
          break;

        case 'DELETE':
          handleDeleteTask(message, res);
          break;

        case 'COMPLETE':
          handleCompleteTask(message, res);
          break;

        case 'PENDING':
          handlePendingTask(message, res);
          break;

        case 'SEARCH':
          handleSearchTask(message, res, search_query);
          break;

        case 'VIEW_PLAN':
          handleViewPlan(message, res, time_period);
          break;

        default:
          // If intent is unknown, try to interpret as a task creation
          handleAddTask(task_details, res);
          break;
      }
    }).catch(error => {
      console.error('Error processing chat message with Gemini:', error);
      res.status(500).json({ error: 'Error processing message with AI' });
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
});

// Helper functions for different intents
async function handleAddTask(task, res) {
  if (!task.title) {
    return res.status(400).json({ error: 'Could not extract task title from message' });
  }

  const taskData = {
    title: task.title,
    description: task.description || ''
  };

  TaskModel.create(taskData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const newTask = {
      id: result.id,
      ...taskData,
      status: 'pending'
    };

    res.json({
      message: `Task "${newTask.title}" has been added successfully!`,
      task: newTask,
      action: 'TASK_ADDED'
    });
  });
}

async function handleEditTask(message, res) {
  // Extract task ID and new information from message
  let taskId = extractTaskId(message);

  // If no ID found, try to find by title
  if (!taskId) {
    // Get all tasks to search by title
    TaskModel.getAll((err, allTasks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      taskId = findTaskByTitle(message, allTasks);

      if (!taskId) {
        return res.status(400).json({
          error: 'Could not identify which task to edit. Please specify the task number or title.'
        });
      }

      // Find the task and update it
      TaskModel.getById(taskId, (err, task) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!task) {
          return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        // Extract new title/description from message
        const updatedTask = extractUpdatedTaskInfo(message, task);

        TaskModel.update(taskId, updatedTask, (err, changes) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: `Task "${updatedTask.title}" has been updated successfully!`,
            task: { ...task, ...updatedTask },
            action: 'TASK_UPDATED'
          });
        });
      });
    });
    return;
  }

  // Find the task first
  TaskModel.getById(taskId, (err, task) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    // Extract new title/description from message
    const updatedTask = extractUpdatedTaskInfo(message, task);

    TaskModel.update(taskId, updatedTask, (err, changes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: `Task "${updatedTask.title}" has been updated successfully!`,
        task: { ...task, ...updatedTask },
        action: 'TASK_UPDATED'
      });
    });
  });
}

async function handleDeleteTask(message, res) {
  let taskId = extractTaskId(message);

  // If no ID found, try to find by title
  if (!taskId) {
    // Get all tasks to search by title
    TaskModel.getAll((err, allTasks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      taskId = findTaskByTitle(message, allTasks);

      if (!taskId) {
        return res.status(400).json({
          error: 'Could not identify which task to delete. Please specify the task number or title.'
        });
      }

      TaskModel.delete(taskId, (err, changes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        res.json({
          message: `Task with ID ${taskId} has been deleted successfully!`,
          action: 'TASK_DELETED'
        });
      });
    });
    return;
  }

  TaskModel.delete(taskId, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    res.json({
      message: `Task with ID ${taskId} has been deleted successfully!`,
      action: 'TASK_DELETED'
    });
  });
}

async function handleCompleteTask(message, res) {
  let taskId = extractTaskId(message);

  // If no ID found, try to find by title
  if (!taskId) {
    // Get all tasks to search by title
    TaskModel.getAll((err, allTasks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      taskId = findTaskByTitle(message, allTasks);

      if (!taskId) {
        return res.status(400).json({
          error: 'Could not identify which task to mark as complete. Please specify the task number or title.'
        });
      }

      TaskModel.updateStatus(taskId, 'completed', (err, changes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        res.json({
          message: `Task with ID ${taskId} has been marked as completed!`,
          action: 'TASK_STATUS_UPDATED',
          status: 'completed'
        });
      });
    });
    return;
  }

  TaskModel.updateStatus(taskId, 'completed', (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    res.json({
      message: `Task with ID ${taskId} has been marked as completed!`,
      action: 'TASK_STATUS_UPDATED',
      status: 'completed'
    });
  });
}

async function handlePendingTask(message, res) {
  let taskId = extractTaskId(message);

  // If no ID found, try to find by title
  if (!taskId) {
    // Get all tasks to search by title
    TaskModel.getAll((err, allTasks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      taskId = findTaskByTitle(message, allTasks);

      if (!taskId) {
        return res.status(400).json({
          error: 'Could not identify which task to mark as pending. Please specify the task number or title.'
        });
      }

      TaskModel.updateStatus(taskId, 'pending', (err, changes) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (changes === 0) {
          return res.status(404).json({ error: `Task with ID ${taskId} not found` });
        }

        res.json({
          message: `Task with ID ${taskId} has been marked as pending!`,
          action: 'TASK_STATUS_UPDATED',
          status: 'pending'
        });
      });
    });
    return;
  }

  TaskModel.updateStatus(taskId, 'pending', (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }

    res.json({
      message: `Task with ID ${taskId} has been marked as pending!`,
      action: 'TASK_STATUS_UPDATED',
      status: 'pending'
    });
  });
}

// Helper function to extract task ID from message
function extractTaskId(message) {
  // Look for numeric ID in message
  const idMatch = message.match(/\b(\d+)\b/);
  if (idMatch) {
    return parseInt(idMatch[1]);
  }

  // Could add more sophisticated matching (by title, etc.) here
  return null;
}

// Helper function to find task by title (for when ID is not available)
function findTaskByTitle(message, tasks) {
  // Extract potential task title from message
  const lowerMsg = message.toLowerCase();

  // Look for keywords that indicate the task title
  let titlePatterns = [
    /complete\s+(.+?)(?:\.|$)/i,
    /finish\s+(.+?)(?:\.|$)/i,
    /delete\s+(.+?)(?:\.|$)/i,
    /remove\s+(.+?)(?:\.|$)/i,
    /edit\s+(.+?)(?:\.|$)/i,
    /update\s+(.+?)(?:\.|$)/i
  ];

  let extractedTitle = '';
  for (const pattern of titlePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      extractedTitle = match[1].trim();
      break;
    }
  }

  if (!extractedTitle) {
    return null;
  }

  // Find task that matches the extracted title (partial match)
  for (const task of tasks) {
    if (task.title.toLowerCase().includes(extractedTitle.toLowerCase())) {
      return task.id;
    }
  }

  return null;
}

// Helper function to extract updated task info
function extractUpdatedTaskInfo(message, existingTask) {
  // This is a simplified version - in a real app, you'd want more sophisticated parsing
  const updatedTask = { ...existingTask };

  // For now, just return the existing task with potential updates
  // In a more advanced version, you could extract new title/description from the message
  return updatedTask;
}

async function handleSearchTask(message, res, searchQuery) {
  // Use search query from Gemini if available, otherwise extract from message
  const searchTerm = searchQuery || extractSearchTerm(message);

  if (!searchTerm) {
    return res.status(400).json({
      error: 'Could not identify what to search for. Please specify what you\'re looking for.'
    });
  }

  TaskModel.search(searchTerm, (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (tasks.length === 0) {
      return res.json({
        message: `No tasks found containing "${searchTerm}".`,
        tasks: [],
        action: 'TASK_SEARCH',
        searchTerm
      });
    }

    res.json({
      message: `Found ${tasks.length} task(s) containing "${searchTerm}":`,
      tasks,
      action: 'TASK_SEARCH',
      searchTerm
    });
  });
}

async function handleViewPlan(message, res, timePeriod) {
  // Use time period from Gemini if available, otherwise determine from message
  const period = timePeriod || determineTimePeriodFromMessage(message);

  // Determine the time range based on the period
  let startDate, endDate, periodName;

  const lowerMsg = message.toLowerCase();

  switch(period) {
    case 'today':
      const todayStr = new Date().toISOString().split('T')[0];
      startDate = todayStr;
      endDate = todayStr;
      periodName = 'today';
      break;
    case 'yesterday':
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      startDate = yesterday;
      endDate = yesterday;
      periodName = 'yesterday';
      break;
    case 'tomorrow':
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      startDate = tomorrow;
      endDate = tomorrow;
      periodName = 'tomorrow';
      break;
    case 'week':
      // Calculate start of week (Monday)
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust to Monday
      startDate = startOfWeek.toISOString().split('T')[0];

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endDate = endOfWeek.toISOString().split('T')[0];
      periodName = 'this week';
      break;
    case 'month':
      // Start of current month
      const currentMonth = new Date();
      startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];

      // End of current month
      endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];
      periodName = 'this month';
      break;
    default:
      // Default to all tasks
      TaskModel.getAll((err, tasks) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (tasks.length === 0) {
          return res.json({
            message: 'You have no tasks yet.',
            tasks: [],
            action: 'TASK_VIEW_ALL'
          });
        }

        // Group tasks by status
        const pendingTasks = tasks.filter(task => task.status === 'pending');
        const completedTasks = tasks.filter(task => task.status === 'completed');

        res.json({
          message: `Here's your task overview:`,
          summary: {
            total: tasks.length,
            pending: pendingTasks.length,
            completed: completedTasks.length
          },
          pendingTasks,
          completedTasks,
          action: 'TASK_VIEW_ALL'
        });
      });
      return;
  }

  TaskModel.getByDateRange(startDate, endDate, (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (tasks.length === 0) {
      return res.json({
        message: `You have no tasks scheduled for ${periodName}.`,
        tasks: [],
        period: periodName,
        startDate,
        endDate,
        action: 'TASK_VIEW_PLAN'
      });
    }

    // Group tasks by status
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    res.json({
      message: `Here are your tasks for ${periodName}:`,
      summary: {
        total: tasks.length,
        pending: pendingTasks.length,
        completed: completedTasks.length
      },
      period: periodName,
      startDate,
      endDate,
      pendingTasks,
      completedTasks,
      action: 'TASK_VIEW_PLAN'
    });
  });
}

// Helper function to determine time period from message (fallback)
function determineTimePeriodFromMessage(message) {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes('today')) return 'today';
  if (lowerMsg.includes('yesterday')) return 'yesterday';
  if (lowerMsg.includes('tomorrow')) return 'tomorrow';
  if (lowerMsg.includes('week') || lowerMsg.includes('this week')) return 'week';
  if (lowerMsg.includes('month') || lowerMsg.includes('this month')) return 'month';

  return 'all'; // default to all tasks
}

// Helper function to extract search term
function extractSearchTerm(message) {
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

module.exports = router;