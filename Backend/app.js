const express = require("express");
const productRouter = require("./Routes/productRouter");
const userRouter = require("./Routes/userRouter");
const errorMiddleware = require("./Middleware/error");
const app = express();

app.use(express.json());

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);

app.use(errorMiddleware);

module.exports = app;
