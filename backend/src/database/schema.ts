import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export interface UserSchema {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface BlogPostSchema {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  // CHECK constraints for length limits:
  // - title: length <= 200
  // - content: length <= 5000
  // These will be added via migration
});
