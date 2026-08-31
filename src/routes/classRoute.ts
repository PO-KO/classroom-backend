import express from "express";
import { createOneClass } from "../controllers/classesController.js";

const classRouter = express.Router();

classRouter.post("/", createOneClass);

export default classRouter;
