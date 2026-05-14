import { BUILDER_DICTIONARY } from '@shared/constants';

/**
 * A method decorator that memoizes the result of a method based on its arguments.
 * Useful for caching network requests or heavy computations.
 * Supports TTL (Time To Live) to invalidate stale cache.
 */
export function Memoize(ttlMs: number = BUILDER_DICTIONARY.cache.ttlMs): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { data: unknown; timestamp: number }>();

    descriptor.value = function (...args: unknown[]) {
      const key = JSON.stringify(args);
      const now = Date.now();

      if (cache.has(key)) {
        const cachedItem = cache.get(key)!;
        if (now - cachedItem.timestamp < ttlMs) {
          return cachedItem.data;
        } else {
          cache.delete(key);
        }
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, { data: result, timestamp: now });
      return result;
    };

    return descriptor;
  };
}
