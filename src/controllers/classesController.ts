import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { classTable } from "../db/index.js";

const createOneClass = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      bannerUrl,
      bannerCldPubId,
      capacity,
      status,
      subjectId,
      teacherId,
    } = req.body;

    const newClass = {
      name,
      description,
      bannerUrl,
      bannerCldPubId,
      capacity,
      status,
      subjectId,
      teacherId,
      inviteCode: Math.random().toString(36).substring(2, 9).toUpperCase(),
      schedules: [],
    };

    const [createdClass] = await db
      .insert(classTable)
      .values(newClass)
      .returning({ id: classTable.id });

    if (!createdClass) throw Error;
    res.status(201).json({ data: createdClass });
  } catch (error) {
    console.log(`Can't create the class : ${error}`);
    res.status(500).json({ message: "Can't create the class" });
  }
};

export { createOneClass };
