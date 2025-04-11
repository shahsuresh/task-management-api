import { Router } from "express";
import Task from "../models/task.model.js";
import validateReqBodyData from "../middleware/data.validation.middleware.js";
import newTaskValidationSchema from "../validations/taskValidationSchema.js";
import validateMongoIdFromReqParams from "../middleware/validateMongoID.middleware.js";
import updateTaskStatusValidationSchema from "../validations/updateTaskStatusValidationSchema.js";

const router = Router();

//# api to create new task

router.post(
  "/add",
  validateReqBodyData(newTaskValidationSchema),
  async (req, res) => {
    //extract new task data from req.body
    const newTaskData = req.body;

    try {
      //add new task to db
      await Task.create(newTaskData);
      //send response
      return res.status(200).send({ message: "New Task Created Successfully" });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Error creating new task", error: error.message });
    }
  }
);

//# api to get all tasks list

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

//# api to Retrieve a specific task by its id

router.get("/:id", validateMongoIdFromReqParams, async (req, res) => {
  //retrieve task id from params
  const taskId = req.params.id;

  //find task with that id
  const task = await Task.findOne({ _id: taskId });

  //if not task available with that id, throw error
  if (!task) {
    return res.status(404).send({ message: "Task Not Found" });
  }

  //send response
  return res.status(200).send({ message: "Success", taskDetails: task });
});

//# api to delete a task by ID

router.delete("/delete/:id", validateMongoIdFromReqParams, async (req, res) => {
  //retrieve task id from params
  const taskId = req.params.id;

  //find task with that id
  const task = await Task.findOne({ _id: taskId });

  //if not task available with that id, throw error
  if (!task) {
    return res.status(404).send({ message: "Task Not Found" });
  }

  // if task with this id exists, delete it
  await Task.deleteOne({ _id: taskId });

  //send response
  return res.status(200).send({ message: "Task Deleted Successfully" });
});

//# api to update task by id

router.put(
  "/update/:id",
  validateMongoIdFromReqParams,
  validateReqBodyData(newTaskValidationSchema),
  async (req, res) => {
    //retrieve task id from params
    const taskId = req.params.id;

    //find task with that id
    const task = await Task.findOne({ _id: taskId });

    //if not task available with that id, throw error
    if (!task) {
      return res.status(404).send({ message: "Task Not Found" });
    }

    // if task with this id exists, update with new details

    // extract new data from req.body
    const updatedTaskData = req.body;
    // console.log(updatedTaskData);

    // update task
    await Task.updateOne({ _id: taskId }, { $set: { ...updatedTaskData } });

    //send response
    return res.status(200).send({ message: "Task Updated" });
  }
);

//# api to update task status only

router.patch(
  "/:id/status",
  validateMongoIdFromReqParams,
  validateReqBodyData(updateTaskStatusValidationSchema),
  async (req, res) => {
    //extract id from req params
    const taskId = req.params.id;

    console.log(taskId);
    return res.status(200).send({ taskID: taskId });
  }
);
export default router;
