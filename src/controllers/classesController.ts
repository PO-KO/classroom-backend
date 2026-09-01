import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { classTable, subject, user } from "../db/index.js";
import { parsePositiveInt } from "../utils/index.js";
import { and, count, desc, eq, getTableColumns, ilike, or } from "drizzle-orm";

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

const getAllClasses = async (req: Request, res: Response) => {
  try {
    const {
      status,
      search,
      subjectName,
      teacherName,
      page = 1,
      limit = 10,
    } = req.query;

    const currentPage = parsePositiveInt(page, 1);
    const limitPerPage = Math.min(parsePositiveInt(limit, 10), 100);

    // Calculate offset for SQL pagination
    const offset = (currentPage - 1) * limitPerPage;

    const filter = [];

    // If search exists, filter by name
    if (search) {
      filter.push(ilike(classTable.name, `%${search}%`));
    }

    // If status exists, filter by status
    if (status) {
      filter.push(eq(classTable.status, status as "active" | "inactive"));
    }

    // If teacherName exists, filter by teacher name

    if (teacherName) {
      filter.push(ilike(user.name, `%${teacherName}%`));
    }

    // If subjectName exists, filter by subject name
    if (subjectName) {
      filter.push(ilike(subject.name, `%${subjectName}%`));
    }

    // Combinate two conditions with using AND
    const whereClause = filter.length > 0 ? and(...filter) : undefined;

    // Get count of classes
    const countClasses = await db
      .select({ count: count() })
      .from(classTable)
      .leftJoin(subject, eq(classTable.subjectId, subject.id))
      .leftJoin(user, eq(classTable.teacherId, user.id))
      .where(whereClause);

    const totalCount = countClasses[0]?.count ?? 0;

    const calssesList = await db
      .select({
        ...getTableColumns(classTable),
        subject: { ...getTableColumns(subject) },
        user: { ...getTableColumns(user) },
      })
      .from(classTable)
      .leftJoin(subject, eq(classTable.subjectId, subject.id))
      .leftJoin(user, eq(classTable.teacherId, user.id))
      .where(whereClause)
      .orderBy(desc(classTable.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: calssesList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.log(`Can't GET classes : ${error}`);
    res.status(500).json({ message: "Can't GET classes" });
  }
};

const getOneClassById = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const numericClassId = Number(classId);
    if (isNaN(numericClassId)) {
      return res.status(400).json({ message: "Invalid class ID" });
    }

    const classResult = await db
      .select({
        ...getTableColumns(classTable),
        teacher: { ...getTableColumns(user) },
        subject: { ...getTableColumns(subject) },
      })
      .from(classTable)
      .leftJoin(user, eq(classTable.teacherId, user.id))
      .leftJoin(subject, eq(classTable.subjectId, subject.id))
      .where(eq(classTable.id, numericClassId));

    if (classResult.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ data: classResult[0] });
  } catch (error) {
    console.log(`Can't GET class : ${error}`);
    res.status(500).json({ message: "Can't GET class" });
  }
};

export { createOneClass, getAllClasses, getOneClassById };
