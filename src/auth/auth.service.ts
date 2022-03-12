import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
// import { User, Bookmark } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // we don't want the hash field to return in the reponse body, so we delete it from the user object. We can also use a more elegant way: transformer (later?)
      // delete user.hash;
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          // duplicate key code
          throw new ForbiddenException(
            'Email already exist',
          );
        } else {
          throw error;
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    const pwdMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    if (!pwdMatches) {
      throw new ForbiddenException(
        'Wrong password',
      );
    }
    // delete user.hash;
    // return user;
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId, // sub is jwt convention for id
      email,
    };
    const secret = this.config.get(
      'MY_JWT_SECRET',
    );
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret,
      },
    );
    return { access_token: token };
  }
}
