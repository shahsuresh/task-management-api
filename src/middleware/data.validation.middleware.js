const validateReqBodyData = (validationSchema) => {
  return async (req, res, next) => {
    const newTaskData = req.body;

    try {
      const validatedData = await validationSchema.validateAsync(newTaskData, {
        abortEarly: false,
      });
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(400).json({
        message: "Data Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
  };
};

export default validateReqBodyData;
