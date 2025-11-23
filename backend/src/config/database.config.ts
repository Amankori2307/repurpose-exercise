import Database from 'better-sqlite3';
import { appConfig } from 'config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
type DatabaseType = 'sqlite';
export interface DatabaseConfig {
  type: DatabaseType;
  database: string;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const rootDir = appConfig.ROOT_DIR;
  console.log({ rootDir });

  return {
    type: 'sqlite',
    database: path.join(rootDir, '..', 'database', 'database.sqlite'),
  };
};

export const createDrizzleConnection = () => {
  const config = getDatabaseConfig();
  const sqlite = new Database(config.database);
  return drizzle(sqlite);
};
