require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const taskRoutes = require('./api/tasks');
const chatRoutes = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);

// Serve static files from public directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ message: 'Todo Chatbot Backend API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'todo-chatbot-nodejs-backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});