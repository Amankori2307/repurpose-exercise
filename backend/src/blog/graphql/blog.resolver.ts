import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../../auth/interfaces/request-with-user.interface';
import { BlogService } from '../blog.service';
import { BlogPost, CreatePostInput } from './blog.types';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Query(() => [BlogPost])
  myPosts(@Context() context: { req: RequestWithUser }): Promise<BlogPost[]> {
    const authorId = context.req.user.id;
    return this.blogService.findPostsByAuthor(authorId);
  }
}
