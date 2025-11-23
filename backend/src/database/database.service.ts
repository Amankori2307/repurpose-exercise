import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDrizzleConnection,
  getDatabaseConfig,
} from '../config/database.config';
import { users } from './schema';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: BetterSQLite3Database;
  private dbType: 'sqlite';

  onModuleInit() {
    const config = getDatabaseConfig();
    this.dbType = config.type;
    this.db = createDrizzleConnection();

    // Auto-migrate/sync schema
    this.ensureTablesExist();
  }

  private ensureTablesExist() {
    try {
      // For SQLite, create tables if they don't exist
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Error ensuring tables exist:', error);
    }
  }

  getDb() {
    return this.db;
  }

  getUsersTable() {
    return users;
  }

  getDbType(): 'sqlite' {
    return this.dbType;
  }
}
