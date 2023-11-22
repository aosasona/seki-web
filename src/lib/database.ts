import env from "./env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { text, integer, sqliteTable, AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const libsqlClient = createClient({ url: env.turso.url, authToken: env.turso.authToken });
export const db = drizzle(libsqlClient);

export const users = sqliteTable("users", {
  id: integer("user_id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userKeys = sqliteTable("user_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessions = sqliteTable("user_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("project_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  repositoryOwner: text("repository_owner"),
  repositoryName: text("repository_name"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const tasks = sqliteTable("tasks", {
  id: integer("task_id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", { mode: "text", enum: ["completed", "in_progress", "pending", "discarded"] }).notNull(),
  syncIssue: integer("sync_issue", { mode: "boolean" }).default(false),
  issueId: integer("issue_id"),
  parentId: integer("parent_id").references((): AnySQLiteColumn => tasks.id), // for subtasks
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUpdatedAt: text("last_updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type ProjectInsert = typeof projects.$inferInsert;
export type TaskInsert = typeof tasks.$inferInsert;
