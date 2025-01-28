const Joi = require("joi");

// Joi schema for validating task data
const taskValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid("TODO", "DONE").default("TODO"),
  linkedFile: Joi.binary().optional(),
  createdOn: Joi.date().default(Date.now),
  deadline: Joi.date().greater("now").required().messages({
    "date.greater": "Deadline must be a future date",
    "any.required": "Deadline is required",
  }),
});

module.exports = taskValidationSchema;
