import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../timestamps.js";
import { relations } from "drizzle-orm";
import { subject } from "./subject.js";
export const department = pgTable("department", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  code: varchar("code", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ...timestamps,
});

export const departmentRelations = relations(department, ({ many }) => ({
  subject: many(subject),
}));

export type Department = typeof department.$inferSelect;
export type NewDepartment = typeof department.$inferInsert;
