import { TestBed } from '@angular/core/testing';
import { BuilderState } from './builder-state';

describe('BuilderState', () => {
  let service: BuilderState;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should initialize with empty state if sessionStorage is empty', () => {
    service = TestBed.inject(BuilderState);
    expect(service.setupData()).toEqual({});
    expect(service.stackData()).toEqual({});
  });

  it('should load initial state from sessionStorage', () => {
    const mockState = { setup: { aiAgent: 'cursor' }, stack: { framework: 'angular' } };
    sessionStorage.setItem('builderState', JSON.stringify(mockState));
    
    service = TestBed.inject(BuilderState);
    
    expect(service.setupData()).toEqual({ aiAgent: 'cursor' });
    expect(service.stackData()).toEqual({ framework: 'angular' });
  });

  it('should sync signal changes back to sessionStorage via effect', async () => {
    service = TestBed.inject(BuilderState);
    
    // Change state
    service.setupData.set({ aiAgent: 'antigravity' });
    
    // Effects are scheduled asynchronously. In tests, we can wait for them to flush using TestBed.flushEffects() 
    // For Signal effects without a component fixture, we might need a tick or flushEffects
    TestBed.flushEffects();

    const stored = sessionStorage.getItem('builderState');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored as string);
    expect(parsed.setup).toEqual({ aiAgent: 'antigravity' });
  });

  it('should reset state and clear sessionStorage', () => {
    service = TestBed.inject(BuilderState);
    sessionStorage.setItem('builderState', '{"setup":{"test":true}}');
    
    // Create a mock location object
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    service.reset();

    expect(sessionStorage.getItem('builderState')).toBeNull();
    expect(window.location.href).toBe('/builder/setup');
  });
});
