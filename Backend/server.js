const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./Config/database");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (e) => {
  console.log("error =>", e.message);
  console.log("Shutting down the server due to uncaughtException.");

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: "Backend/Config/.env" });
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port =>", process.env.PORT);
});

process.on("unhandledRejection", (e) => {
  console.log("error =>", e.message);
  console.log("Shutting down the server due to unhandled promice rejection.");

  server.close(() => {
    process.exit(1);
  });
});
