import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
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

    // Database-level validation
    if (createPostDto.title.length > 200) {
      throw new Error('Title must not exceed 200 characters');
    }
    if (createPostDto.content.length > 5000) {
      throw new Error('Content must not exceed 5000 characters');
    }

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
      .where(eq(blogPosts.authorId, authorId))
      .orderBy(desc(blogPosts.createdAt));

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
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .orderBy(desc(blogPosts.createdAt));

    return posts.map((post) => ({
      ...post,
      authorUsername: post.authorUsername || null,
    }));
  }

  async findPostById(id: number) {
    const db = this.databaseService.getDb();

    const [post] = await db
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
      .where(eq(blogPosts.id, id));

    if (!post) {
      return null;
    }

    return {
      ...post,
      authorUsername: post.authorUsername || null,
    };
  }
}
