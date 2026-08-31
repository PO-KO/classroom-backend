import express from "express";
import { getAllUsers } from "../controllers/usersController.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);

export default userRouter;
