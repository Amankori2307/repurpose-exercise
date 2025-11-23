import Database from 'better-sqlite3';
import { appConfig } from 'config';
import { drizzle } from 'drizzle-orm/better-sqlite3';

type DatabaseType = 'sqlite';
export interface DatabaseConfig {
  type: DatabaseType;
  database: string;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  return {
    type: 'sqlite',
    database: appConfig.DB_URL,
  };
};

export const createDrizzleConnection = () => {
  const config = getDatabaseConfig();
  const sqlite = new Database(config.database);
  return drizzle(sqlite);
};
