import mongoose from "mongoose";

//set rules for task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled Task model",
      maxlength: [100, "Title cannot be of more than 100 Characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "In-Progress", "Completed"],
      index: true, // for filtering by status
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
