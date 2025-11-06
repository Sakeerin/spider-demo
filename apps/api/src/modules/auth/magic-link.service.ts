import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@spider/shared';
import {
  MagicLinkRequestDto,
  MagicLinkVerifyDto,
} from './dto/auth.dto';
import { MagicLinkPayload, AuthTokens } from './interfaces/auth.interface';

@Injectable()
export class MagicLinkService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async requestMagicLink(
    magicLinkRequestDto: MagicLinkRequestDto,
  ): Promise<{ message: string; token?: string }> {
    const { email, firstName, lastName, phone } = magicLinkRequestDto;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new contractor user
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          role: UserRole.CONTRACTOR,
          profile: {
            create: {
              timezone: 'Asia/Bangkok',
            },
          },
        },
        include: {
          profile: true,
        },
      });
    }

    // Generate magic link token
    const payload: MagicLinkPayload = {
      email,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
    };

    const magicToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_MAGIC_LINK_SECRET'),
      expiresIn: this.configService.get<string>('JWT_MAGIC_LINK_EXPIRES_IN', '15m'),
    });

    // In a real application, you would send this token via email
    // For development, we'll return it in the response
    const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';

    return {
      message: 'Magic link sent to your email',
      ...(isDevelopment && { token: magicToken }),
    };
  }

  async verifyMagicLink(
    magicLinkVerifyDto: MagicLinkVerifyDto,
  ): Promise<AuthTokens> {
    const { token } = magicLinkVerifyDto;

    try {
      // Verify magic link token
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_MAGIC_LINK_SECRET'),
      }) as MagicLinkPayload;

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { email: payload.email },
        include: {
          profile: true,
        },
      });

      if (!user) {
        // Create new contractor user
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            role: UserRole.CONTRACTOR,
            profile: {
              create: {
                timezone: 'Asia/Bangkok',
              },
            },
          },
          include: {
            profile: true,
          },
        });
      } else {
        // Update user information if provided
        if (payload.firstName || payload.lastName || payload.phone) {
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: {
              firstName: payload.firstName || user.firstName,
              lastName: payload.lastName || user.lastName,
              phone: payload.phone || user.phone,
            },
            include: {
              profile: true,
            },
          });
        }
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Generate authentication tokens
      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired magic link');
    }
  }

  private async generateTokens(user: any): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        language: user.language,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profile,
      },
    };
  }
}