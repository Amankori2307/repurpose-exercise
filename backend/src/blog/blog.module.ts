import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './graphql/blog.resolver';

@Module({
  providers: [BlogService, BlogResolver],
})
export class BlogModule {}
