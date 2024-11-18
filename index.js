const express = require('express')
const app = express()
const port = 3000

// Middleware to parse JSON bodies
app.use(express.json())


// Question 1: Add a "Priority" Field to the To-Do API
// Sample data
let todos = [

{ id: 1, task: "Learn Node.js", completed: true, priority: "medium"  },
{ id: 1, task: "Learn how to cook", completed: false, priority: "medium"  },
{ id: 2, task: "Build a REST API", completed: true, priority: "medium"  }
];

// GET /todos - Retrieve all to-do items
app.get('/todos', (req, res) => {
  const { completed } = req.query;
 if (completed !== undefined) {
   const isCompleted = completed === 'true'; 
   const filteredTodos = todos.filter(todo => todo.completed === isCompleted);
    return res.json(filteredTodos);
  }

  res.json(todos);
});


// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {

const { task, priority = "medium" } = req.body; // Default priority to "medium"
const validPriorities = ["high", "medium", "low"];
const newTodo = {

id: todos.length + 1,
task: req.body.task,
completed: false,
priority: priority
};

todos.push(newTodo);
res.status(201).json(newTodo);
});

// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const todo = todos.find(t => t.id === id);

if (!todo) {
 return res.status(404).send("To-Do item not found");
  }

    todo.task = req.body.task || todo.task;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  todo.priority = req.body.priority || todo.priority;
res.json(todo);
});

app.put('/todos/complete-all', (req, res) => {
  todos.forEach(todo => {
  todo.completed = true;
});
res.status(200).json({ message: "All to-do items marked as completed." });
});


app.delete('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = todos.findIndex(t => t.id === id);
if (index === -1) {
    return res.status(404).send("To-Do item not found");
  }
  todos.splice(index, 1);
  res.status(204).send();
});


app.listen(port, () => {
console.log(Server is running on http://localhost:${port});
});
