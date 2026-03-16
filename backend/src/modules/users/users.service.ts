import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { DATABASE_POOL } from '../../database/database.module';
import { GoogleLoginDto } from './dto/google-login.dto';
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

  async googleLogin(payload: GoogleLoginDto) {
    if (!payload.credential?.trim() && !payload.accessToken?.trim()) {
      throw new BadRequestException(
        'Google credential or access token is required.',
      );
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      throw new BadRequestException(
        'Google login is not configured on the server.',
      );
    }

    let normalizedEmail: string;
    let displayName: string;

    try {
      let profile: {
        aud?: string;
        email?: string;
        email_verified?: string;
        name?: string;
        given_name?: string;
      };

      if (payload.credential?.trim()) {
        const verificationResponse = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(payload.credential)}`,
        );

        if (!verificationResponse.ok) {
          throw new UnauthorizedException('Invalid Google credential.');
        }

        profile = (await verificationResponse.json()) as {
          aud?: string;
          email?: string;
          email_verified?: string;
          name?: string;
          given_name?: string;
        };
      } else {
        const tokenInfoResponse = await fetch(
          `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(payload.accessToken!)}`,
        );

        if (!tokenInfoResponse.ok) {
          throw new UnauthorizedException('Invalid Google access token.');
        }

        const tokenInfo = (await tokenInfoResponse.json()) as { aud?: string };

        if (tokenInfo.aud !== googleClientId) {
          throw new UnauthorizedException(
            'Google token does not match this application.',
          );
        }

        const userInfoResponse = await fetch(
          'https://openidconnect.googleapis.com/v1/userinfo',
          {
            headers: {
              Authorization: `Bearer ${payload.accessToken}`,
            },
          },
        );

        if (!userInfoResponse.ok) {
          throw new UnauthorizedException(
            'Unable to fetch Google account profile.',
          );
        }

        const userInfo = (await userInfoResponse.json()) as {
          email?: string;
          email_verified?: boolean;
          name?: string;
          given_name?: string;
        };

        profile = {
          aud: tokenInfo.aud,
          email: userInfo.email,
          email_verified: userInfo.email_verified ? 'true' : 'false',
          name: userInfo.name,
          given_name: userInfo.given_name,
        };
      }

      if (profile.aud !== googleClientId) {
        throw new UnauthorizedException(
          'Google credential does not match this application.',
        );
      }

      if (!profile.email || profile.email_verified !== 'true') {
        throw new UnauthorizedException(
          'Google account does not have a verified email.',
        );
      }

      normalizedEmail = profile.email.trim().toLowerCase();
      displayName =
        profile.name?.trim() ||
        profile.given_name?.trim() ||
        normalizedEmail.split('@')[0];
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Google authentication failed.');
    }

    const existing = await this.pool.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [normalizedEmail],
    );

    if (existing.rows.length > 0) {
      return {
        user: existing.rows[0],
        message: 'Google login successful.',
      };
    }

    const result = await this.pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [
        displayName,
        normalizedEmail,
        await bcrypt.hash(`google-oauth-${randomUUID()}`, SALT_ROUNDS),
      ],
    );

    return {
      user: result.rows[0],
      message: 'Google account linked successfully.',
    };
  }
}
