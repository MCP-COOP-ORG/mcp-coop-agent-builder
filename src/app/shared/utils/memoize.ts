/**
 * A method decorator that memoizes the result of a method based on its arguments.
 * Useful for caching network requests or heavy computations.
 */
export function Memoize(): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, unknown>();

    descriptor.value = function (...args: unknown[]) {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };

    return descriptor;
  };
}
