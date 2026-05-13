import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArchiveGenerator } from './archive-generator';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { vi } from 'vitest';
import { GeneratedFile } from '@shared/constants';

interface ArchiveGeneratorPrivate {
  getSchema(agent: string): { path: string; type: string; categories?: string[]; url?: string }[];
  getWrapperType(cat: string): string;
}

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
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('generatePreview', () => {
    it('should use antigravity fallback if aiAgent is missing', async () => {
      builderState.reviewData.set({});
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);
      await service.generatePreview();
      // Verifying it completes without error
    });

    it('should ignore static pattern if fetchJson returns no content', async () => {
      builderState.reviewData.set({ aiAgent: 'cursor' });
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: '' });
      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.cursorrules')).toBeTruthy();
    });

    it('should process dynamic-category for rules', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.rules/[category].md', type: 'dynamic-category', categories: ['frontend'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.agentsData.set({ frontend: ['angular'] });
      
      vi.spyOn(serviceAccess, 'getWrapperType').mockReturnValue('rule');
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url.includes('angular.json')) return { description: { antigravity: 'Angular Content' } };
        return null;
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Rule');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.rules/frontend.md')).toBeTruthy();
    });

    it('should skip dynamic-category if fetch returns no content', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.rules/[category].md', type: 'dynamic-category', categories: ['frontend'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.agentsData.set({ frontend: ['angular'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);

      const files = await service.generatePreview();
      expect(files.filter(f => f.path !== 'GEMINI.md').length).toBe(0);
    });

    it('should process dynamic-item for workflows', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.workflows/[item].md', type: 'dynamic-item', categories: ['git'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.workflowsData.set({ git: ['gitflow'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('gitflow.json')) return { description: { antigravity: 'Workflow Content' } };
        return null;
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Workflow');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.workflows/gitflow.md')).toBeTruthy();
    });

    it('should cover getSchema branches', async () => {
       builderState.reviewData.set({ aiAgent: 'claude' });
       vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: 'test' });
       await service.generatePreview();
       
       builderState.reviewData.set({ aiAgent: 'unknown' });
       await service.generatePreview();
    });

    it('should process static files that are not main', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: 'extra.md', type: 'static', url: 'extra.json' }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: 'Extra Content' });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Extra');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === 'extra.md')).toBeTruthy();
    });
  });

  describe('downloadArchive', () => {
    it('should use passed files if provided', async () => {
      const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);
      
      const mockFiles: GeneratedFile[] = [
        { path: 'test.md', type: 'file', content: 'test' },
        { path: 'folder', type: 'folder', content: '' }
      ];

      const downloadPromise = service.downloadArchive(mockFiles);
      vi.runAllTimers();
      await downloadPromise;

      expect(mockAnchor.download).toBe('ai-context.zip');
      expect(mockAnchor.click).toHaveBeenCalled();
    });

    it('should fallback to generatePreview if no files in cache', async () => {
      const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);

      vi.spyOn(service, 'generatePreview').mockResolvedValue([{ path: 'auto.md', type: 'file', content: 'auto' }]);
      service.previewFiles.set([]);

      const downloadPromise = service.downloadArchive();
      vi.runAllTimers();
      await downloadPromise;

      expect(service.generatePreview).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
    });
  });
});
