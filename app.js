require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const connectDb = require("./config/dbConfig");
const userRouter = require("./routes/user-route");
const authRouter = require("./routes/auth-route");

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true,
};

connectDb();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/", authRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
