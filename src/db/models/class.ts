import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "../timestamps.js";
import { subject } from "./subject.js";
import { user } from "./auth.js";
import { enrollment } from "./enrollment.js";

// ---------------------------------------------------------------------------
// Enum
// ---------------------------------------------------------------------------

export const classStatusEnum = pgEnum("class_status", [
  "active",
  "inactive",
  "archived",
]);

// ---------------------------------------------------------------------------
// class
// ---------------------------------------------------------------------------

export const classTable = pgTable(
  "class",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    inviteCode: varchar("invite_code", { length: 50 }).notNull().unique(),
    bannerUrl: text("banner_url"),
    bannerCldPubId: text("banner_cld_pub_id"),
    capacity: integer("capacity").notNull().default(50),
    status: classStatusEnum("status").notNull().default("active"),
    schedules: jsonb("schedules").$type<string[]>().notNull().default([]),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "restrict" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (t) => [
    index("class_subject_id_idx").on(t.subjectId),
    index("class_teacher_id_idx").on(t.teacherId),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const classRelations = relations(classTable, ({ one, many }) => ({
  subject: one(subject, {
    fields: [classTable.subjectId],
    references: [subject.id],
  }),
  teacher: one(user, {
    fields: [classTable.teacherId],
    references: [user.id],
  }),
  enrollments: many(enrollment),
}));

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Class = typeof classTable.$inferSelect;
export type NewClass = typeof classTable.$inferInsert;
