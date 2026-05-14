import { Memoize } from './memoize';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

class TestService {
  callCount = 0;

  @Memoize(100) // 100ms TTL
  getData(id: number) {
    this.callCount++;
    return `data-${id}`;
  }
}

describe('Memoize Decorator', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should memoize the result and not call the original method twice for the same arguments', () => {
    expect(service.getData(1)).toBe('data-1');
    expect(service.callCount).toBe(1);

    expect(service.getData(1)).toBe('data-1');
    expect(service.callCount).toBe(1); // Call count should not increase
  });

  it('should call the original method for different arguments', () => {
    expect(service.getData(10)).toBe('data-10');
    expect(service.callCount).toBe(1);

    expect(service.getData(11)).toBe('data-11');
    expect(service.callCount).toBe(2);
  });

  it('should invalidate cache after TTL expires', () => {
    expect(service.getData(20)).toBe('data-20');
    expect(service.callCount).toBe(1);

    // Advance time by 50ms, cache should still be valid
    vi.advanceTimersByTime(50);
    expect(service.getData(20)).toBe('data-20');
    expect(service.callCount).toBe(1);

    // Advance time by another 51ms (total 101ms), cache should expire
    vi.advanceTimersByTime(51);
    expect(service.getData(20)).toBe('data-20');
    expect(service.callCount).toBe(2); // Call count increases because cache expired
  });
});
