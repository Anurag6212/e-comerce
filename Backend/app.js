const express = require("express");
const productRouter = require("./Routes/productRouter");
const errorMiddleware = require("./Middleware/error");
const app = express();

app.use(express.json());

app.use("/api/v1", productRouter);

app.use(errorMiddleware);

module.exports = app;
