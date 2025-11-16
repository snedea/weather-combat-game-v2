/**
 * Cache Service
 * In-memory caching with TTL using node-cache
 */

import NodeCache from 'node-cache';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: env.cache.ttl,
      checkperiod: env.cache.checkPeriod,
      useClones: false,
      maxKeys: 1000,
    });

    this.cache.on('set', (key) => {
      logger.debug(`Cache SET: ${key}`);
    });

    this.cache.on('expired', (key) => {
      logger.debug(`Cache EXPIRED: ${key}`);
    });

    logger.info(`Cache service initialized with TTL: ${env.cache.ttl}s`);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    if (value !== undefined) {
      logger.debug(`Cache HIT: ${key}`);
    } else {
      logger.debug(`Cache MISS: ${key}`);
    }
    return value;
  }

  /**
   * Set value in cache with optional custom TTL
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || env.cache.ttl);
  }

  /**
   * Delete specific key from cache
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clear all cache entries
   */
  flush(): void {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
}

// Export singleton instance
export const cacheService = new CacheService();
