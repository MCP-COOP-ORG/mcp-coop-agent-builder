import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArchiveGenerator } from './archive-generator';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { vi } from 'vitest';

describe('ArchiveGenerator', () => {
  let service: ArchiveGenerator;
  let builderState: BuilderState;
  let interpolator: TemplateInterpolator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ArchiveGenerator);
    builderState = TestBed.inject(BuilderState);
    interpolator = TestBed.inject(TemplateInterpolator);

    // Mock URL functions
    window.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    window.URL.revokeObjectURL = vi.fn();
  });

  it('should generate archive and trigger download for Antigravity', async () => {
    // Arrange state
    builderState.setupData.set({ aiAgent: 'antigravity' });
    
    // Mock interpolator
    vi.spyOn(interpolator, 'fetchAndInterpolate').mockResolvedValue('Mock Antigravity Content');
    
    // Mock document.createElement to intercept the download trigger
    const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);

    // Act
    await service.downloadArchive();

    // Assert
    expect(interpolator.fetchAndInterpolate).toHaveBeenCalledWith('assets/templates/ai/antigravity.md', { aiAgent: 'antigravity' });
    
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.download).toBe('ai-context.zip');
    expect(mockAnchor.click).toHaveBeenCalled();
  });

  it('should generate archive and trigger download for Cursor', async () => {
    // Arrange state
    builderState.setupData.set({ aiAgent: 'cursor' });
    
    // Mock interpolator
    vi.spyOn(interpolator, 'fetchAndInterpolate').mockResolvedValue('Mock Cursor Content');
    
    // Mock document.createElement
    const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);

    // Act
    await service.downloadArchive();

    // Assert
    expect(interpolator.fetchAndInterpolate).toHaveBeenCalledWith('assets/templates/ai/cursor.md', { aiAgent: 'cursor' });
    expect(mockAnchor.click).toHaveBeenCalled();
  });
});


