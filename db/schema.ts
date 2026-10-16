import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const appState = sqliteTable("app_state", {id: integer("id").primaryKey(), version: integer("version").notNull(), data: text("data").notNull()});
