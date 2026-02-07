const express = require('express');
const router = express.Router();
const TaskModel = require('../models/Task');

// GET all tasks
router.get('/', (req, res) => {
  TaskModel.getAll((err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(tasks);
  });
});

// GET task by ID
router.get('/:id', (req, res) => {
  const taskId = req.params.id;
  TaskModel.getById(taskId, (err, task) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  });
});

// POST create new task
router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const taskData = { title, description };
  TaskModel.create(taskData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.id, ...taskData, status: 'pending' });
  });
});

// PUT update task
router.put('/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;

  const taskData = { title, description, status };
  TaskModel.update(taskId, taskData, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ id: parseInt(taskId), ...taskData });
  });
});

// PATCH update task status
router.patch('/:id/status', (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  TaskModel.updateStatus(taskId, status, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ id: parseInt(taskId), status });
  });
});

// DELETE task
router.delete('/:id', (req, res) => {
  const taskId = req.params.id;
  TaskModel.delete(taskId, (err, changes) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;