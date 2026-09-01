import express from "express";
import {
  createOneClass,
  getAllClasses,
  getOneClassById,
} from "../controllers/classesController.js";

const classRouter = express.Router();

classRouter.get("/", getAllClasses);
classRouter.post("/", createOneClass);
classRouter.get("/:classId", getOneClassById);

export default classRouter;
