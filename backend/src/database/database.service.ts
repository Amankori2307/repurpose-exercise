import { Injectable, OnModuleInit } from '@nestjs/common';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import {
  createDrizzleConnection,
  getDatabaseConfig,
} from 'src/config/database.config';
import { users } from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: BetterSQLite3Database;
  private dbType: 'sqlite';

  onModuleInit() {
    const config = getDatabaseConfig();
    this.dbType = config.type;
    this.db = createDrizzleConnection();
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
