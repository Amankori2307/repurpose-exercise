import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthResponse, User, RegisterInput, LoginInput } from './auth.types';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('input') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  me(@Context() context: { req: RequestWithUser }): User {
    const user = context.req.user;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
    };
  }
}
