import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'path';

type DatabaseType = 'sqlite';

export interface DatabaseConfig {
  type: DatabaseType;
  database: string;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    type: 'sqlite',
    database:
      process.env.DB_DATABASE || join(__dirname, '..', '..', 'database.sqlite'),
  };
};

export const createDrizzleConnection = () => {
  const config = getDatabaseConfig();
  const sqlite = new Database(config.database);
  return drizzle(sqlite);
};
