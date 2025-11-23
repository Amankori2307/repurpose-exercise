import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './graphql/blog.resolver';

@Module({
  providers: [BlogService, BlogResolver],
  exports: [BlogService, BlogResolver],
})
export class BlogModule {}
