const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.resolve(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// Create tasks table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

class TaskModel {
  // Get all tasks
  static getAll(callback) {
    db.all('SELECT * FROM tasks ORDER BY created_at DESC', callback);
  }

  // Get task by ID
  static getById(id, callback) {
    db.get('SELECT * FROM tasks WHERE id = ?', [id], callback);
  }

  // Create new task
  static create(taskData, callback) {
    const { title, description } = taskData;
    const stmt = db.prepare('INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)');
    stmt.run([title, description, 'pending'], function(err) {
      callback(err, { id: this.lastID });
    });
    stmt.finalize();
  }

  // Update task
  static update(id, taskData, callback) {
    const { title, description, status } = taskData;
    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run([title, description, status, id], function(err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  }

  // Delete task
  static delete(id, callback) {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run([id], function(err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  }

  // Update task status
  static updateStatus(id, status, callback) {
    const stmt = db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run([status, id], function(err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  }

  // Search tasks by title or description
  static search(searchTerm, callback) {
    const searchQuery = `%${searchTerm}%`;
    db.all(
      `SELECT * FROM tasks
       WHERE title LIKE ? OR description LIKE ?
       ORDER BY created_at DESC`,
      [searchQuery, searchQuery],
      callback
    );
  }

  // Get tasks by status
  static getByStatus(status, callback) {
    db.all('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC', [status], callback);
  }

  // Get tasks created within a date range
  static getByDateRange(startDate, endDate, callback) {
    db.all(
      `SELECT * FROM tasks
       WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)
       ORDER BY created_at DESC`,
      [startDate, endDate],
      callback
    );
  }
}

// Close database connection
TaskModel.close = () => {
  db.close();
};

module.exports = TaskModel;