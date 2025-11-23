import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5000, { message: 'Content must not exceed 5000 characters' })
  content: string;
}
