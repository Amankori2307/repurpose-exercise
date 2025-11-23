import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content: string;
}
