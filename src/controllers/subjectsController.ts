import type { Request, Response } from "express";
import { db } from "../config/db.js";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import { department, NewSubject, subject } from "../db/index.js";
import { parsePositiveInt } from "../utils/index.js";

// Get subjects with optional filtering
const getAllSubejcts = async (req: Request, res: Response) => {
  try {
    const { search, depart, page = 1, limit = 10 } = req.query;

    const currentPage = parsePositiveInt(page, 1);
    const limitPerPage = Math.min(parsePositiveInt(limit, 10), 100);

    // Calculate offset for SQL pagination
    const offset = (currentPage - 1) * limitPerPage;

    const filter = [];

    // If search exists, filter by name OR code
    if (search) {
      filter.push(
        or(
          ilike(subject.name, `%${search}%`),
          ilike(subject.code, `%${search}%`),
        ),
      );
    }

    // If department exists, filter by department
    if (depart) {
      filter.push(ilike(department.name, `%${depart}%`));
    }

    // Combinate two conditions with using AND
    const whereClause = filter.length > 0 ? and(...filter) : undefined;

    // Get count of subjects
    const countSubjects = await db
      .select({ count: count() })
      .from(subject)
      .leftJoin(department, eq(subject.departmentId, department.id))
      .where(whereClause);

    const totalCount = countSubjects[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subject),
        department: { ...getTableColumns(department) },
      })
      .from(subject)
      .leftJoin(department, eq(subject.departmentId, department.id))
      .where(whereClause)
      .orderBy(desc(subject.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.log(`Can't GET subjects : ${error}`);
    res.status(500).json({ message: "Can't GET subjects" });
  }
};

const getOneSubejctById = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;

    const numericSubjectId = Number(subjectId);
    if (isNaN(numericSubjectId)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }

    const subjectResult = await db
      .select({
        ...getTableColumns(subject),
        department: { ...getTableColumns(department) },
      })
      .from(subject)
      .leftJoin(department, eq(subject.departmentId, department.id))
      .where(eq(subject.id, numericSubjectId));

    if (subjectResult.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ data: subjectResult[0] });
  } catch (error) {
    console.log(`Can't GET subject : ${error}`);
    res.status(500).json({ message: "Can't GET subject" });
  }
};
const createOneSubject = async (req: Request, res: Response) => {
  try {
    const newSubject: NewSubject = req.body;

    db.insert(subject).values(newSubject);
  } catch (error) {}
};
const deleteOneSubject = async (req: Request, res: Response) => {};
const updateOneSubject = async (req: Request, res: Response) => {};

export {
  getAllSubejcts,
  getOneSubejctById,
  createOneSubject,
  deleteOneSubject,
  updateOneSubject,
};
