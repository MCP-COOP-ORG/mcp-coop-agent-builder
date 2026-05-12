import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TemplateInterpolator } from './template-interpolator';

describe('TemplateInterpolator', () => {
  let service: TemplateInterpolator;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TemplateInterpolator);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should fetch JSON template correctly', async () => {
    const url = 'assets/test.json';
    const mockResponse = { content: '# {{ projectName }} using {{ aiAgent }}' };

    // Call the service
    const promise = service.fetchJson(url);

    // Expect an HTTP GET request to the correct URL
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');

    // Flush the mock response
    req.flush(mockResponse);

    // Wait for the promise to resolve
    const result = await promise;

    // Verify
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
    
    const promise = service.fetchJson(url);
    
    const req = httpMock.expectOne(url);
    // Simulate a 404 error
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const result = await promise;
    expect(result).toBeNull();
  });
});


