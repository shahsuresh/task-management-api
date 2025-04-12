import Joi from "joi";

// validation schema for pagination, filtering and sorting
export const listTaskValidationSchema = Joi.object({
  page: Joi.number().allow("", null).min(1).positive().default(1).messages({
    "number.positive": "Page must be greater than 0",
    "number.base": "Page must be a number",
  }),
  limit: Joi.number().allow("", null).min(1).max(30).default(5).messages({
    "number.max": "Limit not more than 30",
    "number.min": "Limit must be at least 1",
    "number.base": "Limit must be a number",
  }),
  status: Joi.string()
    .allow("", null)
    .valid("Pending", "In-Progress", "Completed")
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of Pending, In-Progress, or Completed",
    }),

  createdDate: Joi.date()
    .iso() // ensures the date is in valid ISO 8601 format (e.g. "2024-04-11T00:00:00.000Z")
    .allow("", null)
    .messages({
      "date.format": "createdDate must be in the format YYYY-MM-DD",
      "date.base": "createdDate must be a valid date",
    }),
  sortOrder: Joi.string()
    .allow("", null)
    .valid("asc", "desc")
    .default("desc") // Default to descending order (newest first)
    .messages({
      "string.base": "Sort order must be a string",
      "any.only": "Sort order must be either 'asc' or 'desc'",
    }),
});
