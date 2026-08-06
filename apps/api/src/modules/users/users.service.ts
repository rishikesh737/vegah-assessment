import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus, ERROR_CODES, CACHE_TTL, PaginationParams } from '@starter/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User> {
    // Check cache first
    const cached = await this.redis.cacheGet<User>(`user:${id}`);
    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    const sanitizedUser = this.sanitizeUser(user);

    // Cache for 10 minutes
    await this.redis.cacheSet(`user:${id}`, sanitizedUser, CACHE_TTL.MEDIUM);

    return sanitizedUser;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  /**
   * Get all users (admin only)
   */
  async findAll(params: PaginationParams) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 10, 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: {
          [params.sortBy || 'createdAt']: params.sortOrder || 'desc',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map((user) => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Update user profile
   */
  async update(id: string, dto: UpdateUserDto, requesterId: string): Promise<User> {
    // Users can only update their own profile (unless admin)
    const requester = await this.prisma.user.findUnique({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new ForbiddenException('Unauthorized');
    }

    if (id !== requesterId && requester.role === UserRole.USER) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    // Invalidate cache
    await this.redis.del(`user:${id}`);

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Update user status (admin only)
   */
  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status },
    });

    // Invalidate cache
    await this.redis.del(`user:${id}`);

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException({
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      });
    }

    await this.prisma.user.delete({
      where: { id },
    });

    // Invalidate cache
    await this.redis.del(`user:${id}`);
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    password?: string;
    refreshToken?: string | null;
  }): User {
    const { password, refreshToken, ...sanitizedUser } = user;
    return {
      ...sanitizedUser,
      createdAt: sanitizedUser.createdAt.toISOString(),
      updatedAt: sanitizedUser.updatedAt.toISOString(),
    } as User;
  }
}
