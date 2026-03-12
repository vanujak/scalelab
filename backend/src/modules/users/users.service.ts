import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [
    {
      id: 'user-demo-001',
      name: 'Demo User',
      email: 'demo@scalelab.dev',
      password: 'password123',
    },
  ];

  register(payload: RegisterUserDto) {
    if (!payload.name?.trim() || !payload.email?.trim() || !payload.password) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    if (payload.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long.');
    }

    const normalizedEmail = payload.email.trim().toLowerCase();

    if (this.users.some((user) => user.email === normalizedEmail)) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const user: UserEntity = {
      id: `user-${this.users.length + 1}`,
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password,
    };

    this.users.push(user);

    return {
      user: this.serialize(user),
      message: 'Account created successfully.',
    };
  }

  login(payload: LoginUserDto) {
    if (!payload.email?.trim() || !payload.password) {
      throw new BadRequestException('Email and password are required.');
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const user = this.users.find((entry) => entry.email === normalizedEmail);

    if (!user || user.password !== payload.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return {
      user: this.serialize(user),
      message: 'Login successful.',
    };
  }

  googleLogin() {
    let user = this.users.find((entry) => entry.email === 'google@scalelab.dev');
    
    if (!user) {
      user = {
        id: `user-${this.users.length + 1}-google`,
        name: 'Google External User',
        email: 'google@scalelab.dev',
        password: 'oauth-not-required',
      };
      this.users.push(user);
    }

    return {
      user: this.serialize(user),
      message: 'Authenticated automatically with Google.',
    };
  }

  private serialize(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
