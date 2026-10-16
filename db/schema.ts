import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const appState = sqliteTable("app_state", {id: integer("id").primaryKey(), version: integer("version").notNull(), data: text("data").notNull()});
export const rtUsers=sqliteTable('rt_users',{id:text('id').primaryKey(),username:text('username').notNull(),usernameKey:text('username_key').notNull().unique(),role:text('role').notNull(),active:integer('active').notNull(),salt:text('salt').notNull(),passwordHash:text('password_hash').notNull()});
export const rtSessions=sqliteTable('rt_sessions',{tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull(),expiresAt:integer('expires_at').notNull()});
export const rtLoginAttempts=sqliteTable('rt_login_attempts',{id:text('id').primaryKey(),count:integer('count').notNull(),windowStart:integer('window_start').notNull()});
