const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./Config/database");

dotenv.config({ path: "Backend/Config/.env" });
connectDatabase();

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
