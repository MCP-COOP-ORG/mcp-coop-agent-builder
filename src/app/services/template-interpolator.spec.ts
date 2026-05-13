import { TestBed } from '@angular/core/testing';
import { TemplateInterpolator } from './template-interpolator';
import { vi } from 'vitest';

describe('TemplateInterpolator', () => {
  let service: TemplateInterpolator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateInterpolator);
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch JSON template correctly', async () => {
    const url = 'assets/test.json';
    const mockResponse = { content: '# {{ projectName }} using {{ aiAgent }}' };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as Response);

    const result = await service.fetchJson(url);

    expect(globalThis.fetch).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockResponse);
  });

  it('should interpolate variables correctly', () => {
    const template = '# {{ projectName }} using {{ aiAgent }}';
    const mockContext = { projectName: 'MCP COOP DAO', aiAgent: 'antigravity' };

    const result = service.interpolate(template, mockContext);
    expect(result).toBe('# MCP COOP DAO using antigravity');
  });

  it('should leave unmatched variables intact', () => {
    const template = 'Project: {{ projectName }}, Agent: {{ missingAgent }}';
    const mockContext = { projectName: 'Test' };

    const result = service.interpolate(template, mockContext);
    expect(result).toBe('Project: Test, Agent: {{ missingAgent }}');
  });

  it('should interpolate arrays correctly', () => {
    const template = 'Domains: {{ domains }}';
    const mockContext = { domains: ['frontend', 'backend'] };

    const result = service.interpolate(template, mockContext);
    expect(result).toBe('Domains: frontend, backend');
  });

  it('should handle HTTP errors gracefully', async () => {
    const url = 'assets/missing.json';
    
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404
    } as Response);

    const result = await service.fetchJson(url);
    expect(result).toBeNull();
  });
});
