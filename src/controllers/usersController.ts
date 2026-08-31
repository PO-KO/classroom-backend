import type { Request, Response } from "express";
import { db } from "../config/db.js";
import {
  and,
  desc,
  eq,
  getTableColumns,
  ilike,
  or,
  sql,
} from "drizzle-orm";
import { user } from "../db/models/auth.js";
import { parsePositiveInt } from "../utils/index.js";

// Get users with optional filtering
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const currentPage = parsePositiveInt(page, 1);
    const limitPerPage = Math.min(parsePositiveInt(limit, 10), 100);

    // Calculate offset for SQL pagination
    const offset = (currentPage - 1) * limitPerPage;

    const filter = [];

    // If search exists, filter by name OR email
    if (search) {
      filter.push(
        or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`),
        ),
      );
    }

    // If role exists, filter by role
    if (role) {
      filter.push(eq(user.role, role as "student" | "teacher" | "admin"));
    }

    // Combine conditions using AND
    const whereClause = filter.length > 0 ? and(...filter) : undefined;

    // Get count of users
    const countUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .where(whereClause);

    const totalCount = Number(countUsers[0]?.count ?? 0);

    const usersList = await db
      .select({
        ...getTableColumns(user),
      })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.log(`Can't GET users : ${error}`);
    res.status(500).json({ message: "Can't GET users" });
  }
};

export { getAllUsers };
