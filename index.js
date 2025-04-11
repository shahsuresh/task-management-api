import express from "express";
import dbConnection from "./src/db/dbConnection.js";
import taskRoutes from "./src/controllers/task.routes.js";

// to initialize the express app
const app = express();

//to make app understand json
app.use(express.json());

//database connection
dbConnection();

//register routes
app.use("/api/tasks", taskRoutes);

//assign port to the local server
const PORT = process.env.PORT;

//start the server
app.listen(PORT, () => {
  try {
    console.log(`Server is running at:http://localhost:${PORT}/`);
  } catch (error) {
    console.log("Something went wrong while creating server", error);
  }
});
