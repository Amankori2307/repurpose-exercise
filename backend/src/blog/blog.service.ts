import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pub-sub/pubsub.provider';
import { DatabaseService } from '../database/database.service';
import { blogPosts } from '../database/schema';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class BlogService {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private readonly databaseService: DatabaseService,
  ) {}

  async createPost(createPostDto: CreatePostDto, authorId: number) {
    const db = this.databaseService.getDb();

    const [newPost] = await db
      .insert(blogPosts)
      .values({
        title: createPostDto.title,
        content: createPostDto.content,
        authorId,
      })
      .returning();
    await this.pubSub.publish('NEW_POST', { newPost: newPost });
    return newPost;
  }

  async findPostsByAuthor(authorId: number) {
    const db = this.databaseService.getDb();

    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.authorId, authorId));
  }

  async findAllPosts() {
    const db = this.databaseService.getDb();

    return await db.select().from(blogPosts);
  }
}
