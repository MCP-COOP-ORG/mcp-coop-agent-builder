import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
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
    expect(service.descriptionData()).toEqual({});
    expect(service.agentsData()).toEqual({});
    expect(service.rulesData()).toEqual({});
    expect(service.workflowsData()).toEqual({});
    expect(service.reviewData()).toEqual({});
  });

  it('should load initial state from sessionStorage', () => {
    const mockState = { description: { aiAgent: 'cursor' }, agents: { framework: 'angular' } };
    sessionStorage.setItem('builderState', JSON.stringify(mockState));
    
    service = TestBed.inject(BuilderState);
    
    expect(service.descriptionData()).toEqual({ aiAgent: 'cursor' });
    expect(service.agentsData()).toEqual({ framework: 'angular' });
  });

  it('should sync signal changes back to sessionStorage via effect', async () => {
    service = TestBed.inject(BuilderState);
    
    // Change state
    service.descriptionData.set({ aiAgent: 'antigravity' });
    
    // Effects are scheduled asynchronously. In tests, we can wait for them to flush using TestBed.flushEffects() 
    // For Signal effects without a component fixture, we might need a tick or flushEffects
    TestBed.flushEffects();

    const stored = sessionStorage.getItem('builderState');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored as string);
    expect(parsed.description).toEqual({ aiAgent: 'antigravity' });
  });

  it('should reset state and clear sessionStorage', () => {
    service = TestBed.inject(BuilderState);
    sessionStorage.setItem('builderState', '{"description":{"test":true}}');
    
    // Create a mock location object
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    service.reset();

    expect(sessionStorage.getItem('builderState')).toBeNull();
    expect(window.location.href).toBe('/builder/description');
  });

  it('should handle JSON parse error gracefully', () => {
    sessionStorage.setItem('builderState', '{bad json}');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    
    service = TestBed.inject(BuilderState);
    
    expect(consoleSpy).toHaveBeenCalledWith('Failed to parse builder state from sessionStorage', expect.any(Error));
  });

  it('should not access sessionStorage or redirect on reset if not in browser (SSR)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    
    const removeItemSpy = vi.spyOn(sessionStorage, 'removeItem');
    service = TestBed.inject(BuilderState);
    
    service.reset();
    
    expect(removeItemSpy).not.toHaveBeenCalled();
  });
});
