const express = require("express");
const mongoose = require("mongoose");
const app = express();
const apiRouters = require("./src/routes/index");

app.use("/", apiRouters);
mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://mataringan:kurakura@project.g6xldrk.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen(9000, () => {
      console.log("Connection Success");
    });
  })
  .catch((err) => console.log(err));
