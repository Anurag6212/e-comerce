const mongoose = require("mongoose");

const mongooseConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log("Database is connected to =>", data.connection.host);
    });
};

module.exports = mongooseConnect;
