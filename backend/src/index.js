// import express from "express";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import connectToMongo from "./db/mongoose.js";
// import userRouter from "./routes/user.js";

// import app from "./app";

// connectToMongo();

// const port = process.env.port || 8000;

// const app = express();
// //middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api/v1", userRouter);

// app.listen(port, () => {
//   console.log(`backend server is running on localhost port: ${port}`);
// });

import app from "./app.js";
import dotenv from "dotenv";
import connectToMongo from "./db/mongoose.js";

//handling uncaught exception
process.on("uncaughtException", (error) => {
  console.log(`error: ${error.message}`);
  console.log("shutting down the server due to uncaught exception.");
  //intentionally shutting down the server
  process.exit(1);
});
//if any varible is not defined still it is used for such errors we use uncaught errors
// console.log(krishna);

dotenv.config();

connectToMongo(); //always after dotenv.config()

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`backend server is running on localhost port: ${port}`);
});

//unhandled promise rejection -- for server connection error
//event emitter -- on --> event name
//by writting this u don't have to write try catch block in mongoose.js for connection
process.on("unhandledRejection", (error) => {
  console.log(`error: ${error.message}`);
  console.log("shutting down the server due to unhandled promise rejection.");

  //intentionally shutting down the server
  server.close(() => {
    process.exit(1);
  });
});
