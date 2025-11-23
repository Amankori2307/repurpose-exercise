import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pub-sub/pubsub.provider';
import { GraphQLJwtAuthGuard } from '../../auth/guards/graphql-jwt.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { BlogService } from '../blog.service';
import { BlogPost, CreatePostInput } from './blog.types';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(
    private blogService: BlogService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @UseGuards(GraphQLJwtAuthGuard)
  @Mutation(() => BlogPost)
  createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ): Promise<BlogPost> {
    const authorId = context.req.user.id;
    return this.blogService.createPost(createPostInput, authorId);
  }

  @Query(() => [BlogPost])
  allPosts(): Promise<BlogPost[]> {
    return this.blogService.findAllPosts();
  }

  @UseGuards(GraphQLJwtAuthGuard)
  @Query(() => [BlogPost])
  myPosts(@Context() context: { req: RequestWithUser }): Promise<BlogPost[]> {
    const authorId = context.req.user.id;
    return this.blogService.findPostsByAuthor(authorId);
  }

  // <-- Add this subscription
  @Subscription(() => BlogPost, {
    resolve: (payload) => payload.newPost,
  })
  newPost() {
    return this.pubSub.asyncIterableIterator('NEW_POST');
  }
}
