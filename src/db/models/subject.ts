import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../timestamps.js";
import { department } from "./department.js";
import { relations } from "drizzle-orm";

export const subject = pgTable("subject", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => department.id, { onDelete: "restrict" }),
  code: varchar("code", { length: 30 }).notNull().unique(),
  description: text("description"),
  ...timestamps,
});

export const subjectRelation = relations(subject, ({ one }) => ({
  department: one(department, {
    fields: [subject.departmentId],
    references: [department.id],
  }),
}));

export type Subject = typeof subject.$inferSelect;
export type NewSubject = typeof subject.$inferInsert;
