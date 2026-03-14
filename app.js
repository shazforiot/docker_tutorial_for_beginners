/**
 * Docker Demo App — Express + MongoDB REST API
 * A simple Todos API to demonstrate Docker + Docker Compose
 *
 * Endpoints:
 *   GET  /         → health check
 *   GET  /todos    → list all todos
 *   POST /todos    → create a todo  { "title": "..." }
 *   DELETE /todos/:id → delete a todo
 */

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dockerdemo';

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ─── Todo Schema ──────────────────────────────────────────
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', todoSchema);

// ─── Routes ───────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'Docker Demo API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ count: todos.length, todos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a todo
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  try {
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Deleted', todo: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Connected to MongoDB at: ${MONGO_URL}`);
});
