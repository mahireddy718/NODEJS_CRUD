import express from "express";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

let tasks = [];
let nextId = 1;

/*
API  ka Structure:
{
  id: number,
  title: string,
  completed: boolean
}
*/


app.get("/tasks", (req, res) => {
  const { completed } = req.query;

  if (completed !== undefined) {
    const isCompleted = completed === "true";
    const filtered = tasks.filter(t => t.completed === isCompleted);
    return res.json(filtered);
  }

  res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});


app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, completed } = req.body;

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});


app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});