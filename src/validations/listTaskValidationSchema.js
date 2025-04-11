import Joi from "joi";

// validation schema for pagination, filtering and sorting
export const listTaskValidationSchema = Joi.object({
  page: Joi.number().required().min(1).default(1).messages({
    "any.required": "Page is Required", // when field is missing
  }),
  limit: Joi.number().required().min(1).max(20).messages({
    "any.required": "Limit is Required", // when field is missing
    "number.max": "Limit not more than 20",
  }),
  status: Joi.string()
    .allow("", null)
    .valid("Pending", "In-Progress", "Completed"),
  createdDate: Joi.date()
    .iso() // ensures the date is in valid ISO 8601 format (e.g. "2024-04-11T00:00:00.000Z")
    .allow("", null)
    .messages({
      "date.format": "createdDate must be in the format YYYY-MM-DD",
      "date.base": "createdDate must be a valid date",
    }),
  sortOrder: Joi.string().allow("", null).valid("asc", "desc"),
});
