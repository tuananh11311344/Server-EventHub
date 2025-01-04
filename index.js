const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const connectDb = require("./src/configs/connectDb");
const UserModel = require("./src/models/userModel");
const errorMiddleHandle = require("./src/middlewares/errorMiddleware");
const userRouter = require("./src/routers/userRouter");
const verifyToken = require("./src/middlewares/verifyMiddleware");
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/auth", authRouter);
app.use(verifyToken);
app.use("/users", userRouter);
app.use(errorMiddleHandle);

app.listen(PORT, () => {
  console.log(`Server is running on port http://10.10.65.5:${PORT}`);
});
