import express from "express";
import {
  createOneSubject,
  deleteOneSubject,
  getAllSubejcts,
  getOneSubejctById,
  updateOneSubject,
} from "../controllers/subjectsController.js";

const subjectRouter = express.Router();

subjectRouter.get("/", getAllSubejcts);
subjectRouter.get("/:subjectId", getOneSubejctById);
subjectRouter.post("/", createOneSubject);
subjectRouter.put("/:id", updateOneSubject);
subjectRouter.delete("/:id", deleteOneSubject);

export default subjectRouter;
