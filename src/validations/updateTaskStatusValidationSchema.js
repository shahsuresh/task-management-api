import Joi from "joi";

const updateTaskStatusValidationSchema = Joi.object({
  status: Joi.string()
    .default("Pending")
    .valid("Pending", "In-Progress", "Completed")
    .messages({
      "any.only": "Status must be 'Pending', 'In-Progress', or 'Completed'",
    }),
});

export default updateTaskStatusValidationSchema;
