const express = require("express");
const productRouter = express("./Routes/productRouter");

const app = express();

app.use(express.json());

app.use("/api/v1", productRouter);

module.exports = app;
