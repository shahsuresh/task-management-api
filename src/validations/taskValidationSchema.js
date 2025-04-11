import Joi from "joi";

const newTaskValidationSchema = Joi.object({
  title: Joi.string()
    .max(100)
    .empty("")
    .messages({
      "string.max": "Title cannot be more than 100 characters",
    })
    .default("Untitled Task")
    .trim(),
  description: Joi.string()
    .max(1000)
    .required()
    .messages({
      "any.required": "Description is Required", // when field is missing
      "string.empty": "Description Field cannot be empty", // when it's an empty string ""
      "string.max": "Description cannot exceed 1000 characters", // when feild exceeds characters limit
    })
    .trim(),
  status: Joi.string()
    .default("Pending")
    .valid("Pending", "In-Progress", "Completed"),
});

export default newTaskValidationSchema;
