import { appConfig } from 'config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: appConfig.DB_URL,
  },
} satisfies Config;
