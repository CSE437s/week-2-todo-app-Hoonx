const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Todo schema
const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      console.error('Todo not found for deletion:', todoId);
      return res.status(404).json({ error: 'Todo not found' });
    }

    console.log('Deleted todo:', todoId);
    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const { completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
