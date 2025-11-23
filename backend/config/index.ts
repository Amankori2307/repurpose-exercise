import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();

console.log({
  rootDir: process.cwd(),
});
export const appConfig = {
  ROOT_DIR: process.cwd(),
  DB_URL: path.join(process.cwd(), '..', 'database.sqlite'),
};
