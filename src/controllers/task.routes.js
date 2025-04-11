import { Router } from "express";
import Task from "../models/task.model.js";

const router = Router();

//# route to create new task

router.post("/create", async (req, res) => {
  //extract new task data from req.body
  const newTaskData = req.body;

  try {
    await Task.create(newTaskData);
    res.status(200).send({ message: "New Task Created Successfully" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error creating new task", error: error.message });
  }
});

//# route to get all tasks list

router.get("/task-list", async (req, res) => {
  //get task list from db
  const taskList = await Task.aggregate([
    {
      $match: {},
    },
  ]);
  console.log(taskList);
  return res.status(200).send({ tasks: taskList });
});

export default router;
