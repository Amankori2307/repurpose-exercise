import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pub-sub/pubsub.provider';
import { DatabaseService } from '../database/database.service';
import { blogPosts, users } from '../database/schema';
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

    // Fetch author username for the response
    const [author] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, authorId));

    const postWithAuthor = {
      ...newPost,
      authorUsername: author?.username || null,
    };

    await this.pubSub.publish('NEW_POST', { newPost: postWithAuthor });
    return postWithAuthor;
  }

  async findPostsByAuthor(authorId: number) {
    const db = this.databaseService.getDb();

    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorUsername: users.username,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.authorId, authorId));

    return posts.map((post) => ({
      ...post,
      authorUsername: post.authorUsername || null,
    }));
  }

  async findAllPosts() {
    const db = this.databaseService.getDb();

    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        content: blogPosts.content,
        authorId: blogPosts.authorId,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorUsername: users.username,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id));

    return posts.map((post) => ({
      ...post,
      authorUsername: post.authorUsername || null,
    }));
  }
}
