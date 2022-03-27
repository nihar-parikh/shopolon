import express from "express";
// import { errorFunction } from "./middlewares/error.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

//Route imports
import productRouters from "./routes/product.js";
import userRouters from "./routes/user.js";

app.use("/api/v1", productRouters);
app.use("/api/v1", userRouters);
//middleware for error
app.use(errorMiddleware); //using errorMiddleware

export default app;
