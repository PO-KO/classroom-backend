import {
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../timestamps.js";
import { classTable } from "./class.js";
import { user } from "./auth.js";
import { subject } from "./subject.js";

// ---------------------------------------------------------------------------
// enrollment
// ---------------------------------------------------------------------------

export const enrollment = pgTable(
  "enrollment",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    classId: integer("class_id")
      .notNull()
      .references(() => classTable.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("enrollment_student_class_udx").on(t.studentId, t.classId),
    index("enrollment_student_id_idx").on(t.studentId),
    index("enrollment_class_id_idx").on(t.classId),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const enrollmentRelations = relations(enrollment, ({ one }) => ({
  student: one(user, {
    fields: [enrollment.studentId],
    references: [user.id],
  }),
  class: one(classTable, {
    fields: [enrollment.classId],
    references: [classTable.id],
  }),
}));

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Enrollment = typeof enrollment.$inferSelect;
export type NewEnrollment = typeof enrollment.$inferInsert;
