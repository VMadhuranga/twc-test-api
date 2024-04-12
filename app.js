require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error-handler");
const connectDb = require("./config/dbConfig");
const userRouter = require("./routes/user-route");

const app = express();
const port = process.env.PORT || 3000;

connectDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
