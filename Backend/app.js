const express = require("express");
const productRouter = require("./Routes/productRouter");
const userRouter = require("./Routes/userRouter");
const orderRouter = require("./Routes/orderRouter");
const errorMiddleware = require("./Middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", orderRouter);

app.use(errorMiddleware);

module.exports = app;
