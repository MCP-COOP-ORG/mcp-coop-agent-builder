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

  it('should fetch template and interpolate variables correctly', async () => {
    const url = 'assets/test.md';
    const mockContext = { projectName: 'Shpakich DAO', aiAgent: 'antigravity' };
    const mockResponse = '# {{ projectName }} using {{ aiAgent }}';

    // Call the service
    const promise = service.fetchAndInterpolate(url, mockContext);

    // Expect an HTTP GET request to the correct URL
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');

    // Flush the mock response
    req.flush(mockResponse);

    // Wait for the promise to resolve
    const result = await promise;

    // Verify interpolation
    expect(result).toBe('# Shpakich DAO using antigravity');
  });

  it('should leave unmatched variables intact', async () => {
    const url = 'assets/test2.md';
    const mockContext = { projectName: 'Test' };
    const mockResponse = 'Project: {{ projectName }}, Agent: {{ missingAgent }}';

    const promise = service.fetchAndInterpolate(url, mockContext);
    httpMock.expectOne(url).flush(mockResponse);

    const result = await promise;
    expect(result).toBe('Project: Test, Agent: {{ missingAgent }}');
  });

  it('should handle HTTP errors gracefully', async () => {
    const url = 'assets/missing.md';
    
    const promise = service.fetchAndInterpolate(url, {});
    
    const req = httpMock.expectOne(url);
    // Simulate a 404 error
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const result = await promise;
    expect(result).toBe(`Error: Failed to load template from ${url}`);
  });
});


