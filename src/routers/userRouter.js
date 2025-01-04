const Router = require("express");
const { getAllUser } = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/get-all", getAllUser);

module.exports = userRouter;
