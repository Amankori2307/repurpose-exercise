import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pub-sub/pubsub.module';
import { BlogService } from './blog.service';
import { BlogResolver } from './graphql/blog.resolver';

@Module({
  imports: [PubSubModule],
  providers: [BlogService, BlogResolver],
  exports: [BlogService, BlogResolver],
})
export class BlogModule {}
