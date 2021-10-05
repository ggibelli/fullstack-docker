const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis");
/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

router.get("/statistics", async (_, res) => {
  const counterValue = await getAsync("counter");
  res.json({ counter: counterValue ? counterValue : 0 });
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  let counterValue = await getAsync("counter");
  if (counterValue) {
    counterValue = parseInt(counterValue);
  } else {
    counterValue = 0;
  }
  await setAsync("counter", (counterValue += 1));
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  if (!req.todo) return res.sendStatus(404);
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  if (!req.todo) return res.sendStatus(404);
  console.log(req.body);
  req.todo.done = req.body.done;
  req.todo.save();
  res.send(req.todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
