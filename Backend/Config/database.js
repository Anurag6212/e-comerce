const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE, () => {
  console.log("Database is connected to =>", process.env.DATABASE);
});
