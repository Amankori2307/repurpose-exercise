import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    const db = this.databaseService.getDb();
    const usersTable = this.databaseService.getUsersTable();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.username, username), eq(usersTable.email, email)))
      .limit(1);

    if (existingUser.length > 0) {
      if (existingUser[0].username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser[0].email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning();

    const payload: JwtPayload = {
      username: newUser.username,
      sub: newUser.id.toString(),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt || new Date().toISOString(),
        updatedAt: newUser.updatedAt || new Date().toISOString(),
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const db = this.databaseService.getDb();
    const usersTable = this.databaseService.getUsersTable();

    // Find user by username
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id.toString(),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      },
    };
  }

  async validateUser(payload: JwtPayload) {
    const db = this.databaseService.getDb();
    const usersTable = this.databaseService.getUsersTable();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(payload.sub)))
      .limit(1);

    return user || null;
  }

  async findUserById(id: number) {
    const db = this.databaseService.getDb();
    const usersTable = this.databaseService.getUsersTable();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user || null;
  }
}
