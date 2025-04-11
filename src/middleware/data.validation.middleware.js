const validateReqBodyData = (validationSchema) => {
  return async (req, res, next) => {
    // extract new task data from req.body
    const newTaskData = req.body;
    // validate new Task
    try {
      const validatedData = await validationSchema.validate(newTaskData);
      req.body = validatedData;
    } catch (error) {
      //if validation fails, throw error
      return res.status(400).send({ message: error.message });
    }

    // call next function
    next();
  };
};

export default validateReqBodyData;
