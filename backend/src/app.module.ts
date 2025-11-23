import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Request } from 'express';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req, res }: { req: Request; res: any }) => ({
        req,
        res,
      }),
    }),
    DatabaseModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
