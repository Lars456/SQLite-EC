const express = require('express')
const app = express()
const port = 3000

// Middleware to parse JSON bodies
app.use(express.json())


const db = new sqlite3.Database('./todos.db', (err) => {
   if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
     
  db.run(`CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL,
      completed BOOLEAN NOT NULL,
      priority TEXT NOT NULL
    )`);
   }
});

// GET /todos - Retrieve all to-do items
app.get('/todos', (req, res) => {
  const { completed } = req.query;
  let query = 'SELECT * FROM todos';
  let params = [];

 if (completed !== undefined) {
    query += ' WHERE completed = ?';
    params = [completed === 'true' ? 1 : 0];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// POST /todos - Add a new to-do item
app.post('/todos', (req, res) => {

const { task, priority = "medium" } = req.body; // Default priority to "medium"
const validPriorities = ["high", "medium", "low"];
const stmt = db.prepare('INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)');
  stmt.run([task, false, priority], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      const newTodo = { id: this.lastID, task, completed: false, priority };
      res.status(201).json(newTodo);
    }
  });
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
