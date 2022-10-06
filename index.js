// create an express server on port 3000
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const client = require("./connect-mongodb");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/todo/all", async (req, res) => {
  await client.connect();
  const todos = await client.db("todoList").collection("todos").find({}).toArray();
  res.send({
    success: true,
    todos,
  });
});

app.post("/todo", async (req, res) => {
  await client.connect();

  const todoCount = await client.db("todoList").collection("todos").countDocuments({});

  const todo = req.body;
  todo.id = todoCount + 1;

  await client.db("todoList").collection("todos").insertOne(todo);

  res.send({
    success: true,
    todo,
  });
});

app.put("/todo/:id", async (req, res) => {
  await client.connect();

  const todo = req.body;
  const id = parseInt(req.params.id);

  const updated = await client.db("todoList").collection("todos").updateOne({ id }, { $set: todo });

  if (updated.modifiedCount === 0) {
    res.send({
      success: false,
      message: "Could not update todo",
    });
  } else {
    res.send({
      success: true,
      todo,
    });
  }
});

app.delete("/todo/:id", async (req, res) => {
  await client.connect();
  const id = parseInt(req.params.id);
  const deleted = await client.db("todoList").collection("todos").deleteOne({ id });
  if (deleted.deletedCount === 0) {
    res.send({
      success: false,
      message: "Could not delete todo",
    });
  } else {
    res.send({
      success: true,
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
