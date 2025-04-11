import mongoose from "mongoose";

//set rules for task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Task",
      maxlength: [100, "Title cannot be of more than 100 Characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot be of more than 1000 characters"],
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "In-Progress", "Completed"],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

//create collection based on rules
const Task = mongoose.model("Task", taskSchema);

//export Task model
export default Task;
