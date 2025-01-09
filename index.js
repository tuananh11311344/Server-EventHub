const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const connectDb = require("./src/configs/connectDb");
const UserModel = require("./src/models/userModel");
const errorMiddleHandle = require("./src/middlewares/errorMiddleware");
const userRouter = require("./src/routers/userRouter");
const verifyToken = require("./src/middlewares/verifyMiddleware");
const eventRouter = require("./src/routers/eventRouter");
const app = express();
require("dotenv").config();
app.use(bodyParser.json({ limit: "10mb" })); // Cho phép JSON payload tối đa 10MB
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/auth", authRouter);
app.use("/users", verifyToken, userRouter);
app.use("/events", verifyToken, eventRouter);
app.use(errorMiddleHandle);

app.listen(PORT, () => {
  console.log(`Server is running on port http://10.10.65.9:${PORT}`);
});
