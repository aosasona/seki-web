import { text, integer, sqliteTable, AnySQLiteColumn, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("user_id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const userKeys = sqliteTable("user_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  hashedPassword: text("hashed_password").notNull(),
});

export const sessions = sqliteTable("user_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
});

export const projects = sqliteTable(
  "projects",
  {
    id: integer("project_id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    repositoryOwner: text("repository_owner"),
    repositoryName: text("repository_name"),
    enableGithubSync: integer("enable_github_sync", { mode: "boolean" }).default(false), // project-level github sync toggle
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    lastUpdatedAt: integer("last_updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    projectNameIdx: index("project_name_idx").on(table.name, table.userId), // projects can have the same name as long as they belong to different users
  })
);

export const tasks = sqliteTable("tasks", {
  id: integer("task_id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", { mode: "text", enum: ["completed", "in_progress", "pending", "discarded", "postponed"] }).notNull(),
  enableGithubSync: integer("enable_github_sync", { mode: "boolean" }).default(false), // task-level github sync toggle
  issueId: integer("issue_id"),
  parentId: integer("parent_id").references((): AnySQLiteColumn => tasks.id, {
    onDelete: "cascade",
  }), // for subtasks
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUpdatedAt: text("last_updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const apiKeys = sqliteTable(
  "api_keys",
  {
    id: integer("key_id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ref: text("ref").notNull().unique(), // it is a part of the key that can be used to look up the key in the database
    hashedkey: text("hashed_key").notNull(), // the real key is only sent to the user once
    permissions: integer("permissions").notNull(),
    description: text("description").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    refIdx: index("ref_idx").on(table.ref),
  })
);

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

export type UserInsert = typeof users.$inferInsert;
export type ProjectInsert = typeof projects.$inferInsert;
export type TaskInsert = typeof tasks.$inferInsert;
export type ApiKeyInsert = typeof apiKeys.$inferInsert;
