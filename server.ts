require("dotenv").config();

import mongoose from "mongoose";
import app from "./app";

// Connect to mongoDB and create server
if (process.env.MONG_URI) {
  mongoose
    .connect(process.env.MONG_URI) // connection options
    .then(() => {
      // listen to sever
      app.listen(process.env.PORT, () => {
        console.log(
          `Server is running on port ${process.env.PORT} & connect to DB`
        );
      });
    })
    .catch((err) => console.log(err));
} else {
  console.error("MONG_URI environment variable is not set"); // Handle the missing variable
}
