import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlogPost {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Int)
  authorId: number;

  @Field(() => String, { nullable: true })
  authorUsername: string | null;

  @Field(() => String, { nullable: true })
  createdAt: string | null;

  @Field(() => String, { nullable: true })
  updatedAt: string | null;
}

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
