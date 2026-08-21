import express from "express";
import {
  createOneSubject,
  deleteOneSubject,
  getAllSubejcts,
  getOneSubejctById,
  updateOneSubject,
} from "../controllers/subjectsController.js";

const subjectRouter = express.Router();

subjectRouter.get("/list", getAllSubejcts);
subjectRouter.get("/:subjectId", getOneSubejctById);
subjectRouter.post("/create", createOneSubject);
subjectRouter.put("/update", updateOneSubject);
subjectRouter.delete("/delete/:id", deleteOneSubject);

export default subjectRouter;
