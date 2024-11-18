const express = require('express')
const sqlite3 = require('sqlite3').verbose();
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

const { task, priority = "medium", completed = false } = req.body; // Default priority to "medium"
const validPriorities = ["high", "medium", "low"];

   
const stmt = db.prepare('INSERT INTO todos (task, completed, priority) VALUES (?, ?, ?)');
  stmt.run([task, completed ? 1 : 0, priority], function (err) {
  if (err) {
    return res.status(500).send(err.message);
  } else {
   res.json({ id: this.lastID, task, completed, priority });
  }
});
});


// PUT /todos/:id - Update an existing to-do item
app.put('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);

db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (!todo) {
      return res.status(404).send('To-Do item not found');
    }

   const task = req.body.task || todo.task;
   const completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
   const priority = req.body.priority || todo.priority;
stmt.run([task, completed ? 1 : 0, priority, id], function (err) {
      if (err) {
        return res.status(500).send(err.message);
      } else {
        res.json({ id, task: updatedTask, completed: updatedCompleted, priority: updatedPriority });
      }
    });
  });
});

app.put('/todos/complete-all', (req, res) => {
const stmt = db.prepare('UPDATE todos SET completed = 1');
  stmt.run((err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.status(200).json({ message: "All to-do items marked as completed." });
  });
});


app.delete('/todos/:id', (req, res) => {
const id = parseInt(req.params.id);
const index = todos.findIndex(t => t.id === id);

   db.get('SELECT * FROM todos WHERE id = ?', [id], (err, todo) => {
  if (err) {
    return res.status(500).send(err.message);
  }
  if (!todo) {
    return res.status(404).send('To-Do item not found');
  }
});

    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    stmt.run([id], function (err) {
      if (err) {
        return res.status(500).send(err.message);
      } else {
        res.status(204).send();
      }
    });
  });
});


app.listen(port, () => {
console.log('Server is running on http://localhost:${port}');
});
