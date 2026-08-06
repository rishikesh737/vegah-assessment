import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(url: string) {
    super(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    this.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.on('error', (error) => {
      this.logger.error('Redis error:', error.message);
    });
  }

  async onModuleDestroy() {
    await this.quit();
    this.logger.log('Disconnected from Redis');
  }

  /**
   * Set a value with optional expiration
   */
  async setWithExpiry(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.setex(key, ttlSeconds, value);
  }

  /**
   * Get and delete a value (useful for one-time tokens)
   */
  async getAndDelete(key: string): Promise<string | null> {
    const value = await this.get(key);
    if (value) {
      await this.del(key);
    }
    return value;
  }

  /**
   * Cache with automatic JSON serialization
   */
  async cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.setex(key, ttlSeconds, JSON.stringify(value));
  }

  /**
   * Get cached value with automatic JSON parsing
   */
  async cacheGet<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    const keys = await this.keys(pattern);
    if (keys.length === 0) return 0;
    return this.del(...keys);
  }
}
