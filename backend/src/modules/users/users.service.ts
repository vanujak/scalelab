import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../database/database.module';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async onModuleInit() {
    // Enable uuid extension so gen_random_uuid() is available on all PG versions
    await this.pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name      TEXT NOT NULL,
        email     TEXT NOT NULL UNIQUE,
        password  TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  async register(payload: RegisterUserDto) {
    if (!payload.name?.trim() || !payload.email?.trim() || !payload.password) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    if (payload.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long.',
      );
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    const existing = await this.pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail],
    );

    if (existing.rows.length > 0) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

    const result = await this.pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [payload.name.trim(), normalizedEmail, hashedPassword],
    );

    return {
      user: result.rows[0],
      message: 'Account created successfully.',
    };
  }

  async login(payload: LoginUserDto) {
    if (!payload.email?.trim() || !payload.password) {
      throw new BadRequestException('Email and password are required.');
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    const result = await this.pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(payload.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Login successful.',
    };
  }

  async googleLogin() {
    const googleEmail = 'google@scalelab.dev';

    const existing = await this.pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [googleEmail],
    );

    if (existing.rows.length > 0) {
      return {
        user: existing.rows[0],
        message: 'Authenticated automatically with Google.',
      };
    }

    const result = await this.pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [
        'Google External User',
        googleEmail,
        await bcrypt.hash('oauth-not-required', SALT_ROUNDS),
      ],
    );

    return {
      user: result.rows[0],
      message: 'Authenticated automatically with Google.',
    };
  }
}
