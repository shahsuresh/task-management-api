import { Router } from "express";
import Task from "../models/task.model.js";
import validateReqBodyData from "../middleware/data.validation.middleware.js";
import newTaskValidationSchema from "../validations/taskValidationSchema.js";
import validateMongoIdFromReqParams from "../middleware/validateMongoID.middleware.js";
import updateTaskStatusValidationSchema from "../validations/updateTaskStatusValidationSchema.js";
import { listTaskValidationSchema } from "../validations/listTaskValidationSchema.js";

const router = Router();
//# Home Route

router.get("/", (req, res) => {
  return res.send("Welcome to Task Management API");
});
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

router.get(
  "/task-list",
  validateReqBodyData(listTaskValidationSchema),
  async (req, res) => {
    // extract pagination, Filtering & sorting data from req body
    const { page, limit, status, createdDate, sortOrder } = req.body;

    // console.log(page, limit);

    //calculate skip and limit
    const skip = (page - 1) * limit;
    let match = {};

    //filter based on status value
    if (status) {
      match = { status: status };
    }

    // filter based on created date
    if (createdDate) {
      //if created date, convert date into iso format
      // and calculate endOfDay to match task created on this day

      const startOfDay = new Date(createdDate);
      // console.log(startOfDay);
      const endOfDay = new Date(createdDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      // console.log(endOfDay);

      // add filter rule based on both status value and createdAt date value
      match = {
        ...match,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      };
    }
    //sorting based on createdAt date
    // 1=> Ascending, -1=> Descending
    let order;
    // if (sortOrder) {
    order = sortOrder === "asc" ? 1 : -1;
    // }
    //get task list from db
    const taskList = await Task.aggregate([
      {
        $match: match,
      },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: order } },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    // if no task present in db, send this response
    if (!taskList) {
      return res.status(404).send({ message: "Not any task available" });
    }
    //send response with filtered/sorted task list
    return res.status(200).send({ tasks: taskList });
  }
);

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

    //find task with taskID

    const task = await Task.findById(taskId);

    // if task not found, throw error & exit
    if (!task) {
      return res.status(404).send({ message: "Task Not Found" });
    }
    try {
      //extract new status from body
      const { status } = req.body;

      // update task with new status
      await Task.updateOne({ _id: taskId }, { $set: { status } });

      //updated status for sending response
      task.status = status;

      //send response
      res
        .status(200)
        .send({ message: "Task Status Updated", Updated_task_Status: task });
    } catch (error) {
      //send error message
      return res
        .status(500)
        .send({ message: " Error updating task Status", error: error.message });
    }
  }
);
export default router;
