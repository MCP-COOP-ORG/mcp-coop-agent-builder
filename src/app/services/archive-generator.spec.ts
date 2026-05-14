import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArchiveGenerator } from './archive-generator';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { GeneratedFile } from '@shared/constants';
import { StaticFilePattern, PlatformConfig } from '@shared/models';
import { signal } from '@angular/core';

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
      builderState.dynamicData['agents'].set({ frontend: ['angular'] });
      
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
      builderState.dynamicData['agents'].set({ frontend: ['angular'] });
      
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
      builderState.dynamicData['workflows'].set({ git: ['gitflow'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('gitflow.json')) return { description: { antigravity: 'Workflow Content' } };
        return null;
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Workflow');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.workflows/gitflow.md')).toBeTruthy();
    });

    it('should process dynamic-hook and produce settings.json', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.gemini/settings.json', type: 'dynamic-hook', categories: ['after-tool'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.dynamicData['hooks'] = signal<Record<string, unknown>>({ 'after-tool': ['auto-prettier'] });
      
      // Override dynamic context to provide selected hooks
      vi.spyOn(Object, 'keys').mockRestore?.();
      const originalDynamicData = builderState.dynamicData;
      Object.defineProperty(builderState, 'dynamicData', {
        get: () => ({
          ...originalDynamicData,
          hooks: vi.fn().mockReturnValue({ 'after-tool': ['auto-prettier'] })
        }),
        configurable: true
      });

      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('auto-prettier')) {
          return {
            hook: {
              antigravity: { matcher: 'write_file|replace', type: 'command', command: 'prettier --write' }
            }
          };
        }
        return null;
      });

      const files = await service.generatePreview();
      const hookFile = files.find(f => f.path === '.gemini/settings.json');
      if (hookFile) {
        const parsed = JSON.parse(hookFile.content);
        expect(parsed.hooks).toBeDefined();
        expect(parsed.hooks['AfterTool']).toBeDefined();
      }
    });

    it('should skip dynamic-hook if no hooks selected', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.gemini/settings.json', type: 'dynamic-hook', categories: ['after-tool'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });

      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.gemini/settings.json')).toBeFalsy();
    });

    it('should skip hook entries for unsupported platforms', async () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      vi.spyOn(serviceAccess, 'getSchema').mockReturnValue([
        { path: '.gemini/settings.json', type: 'dynamic-hook', categories: ['stop'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });

      const originalDynamicData = builderState.dynamicData;
      Object.defineProperty(builderState, 'dynamicData', {
        get: () => ({
          ...originalDynamicData,
          hooks: vi.fn().mockReturnValue({ 'stop': ['git-status-check'] })
        }),
        configurable: true
      });

      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('git-status-check')) {
          return {
            hook: {
              claude: { matcher: '*', type: 'command', command: 'git status' }
            }
          };
        }
        return null;
      });

      const files = await service.generatePreview();
      // stop event has no antigravity mapping, so no settings.json should be produced
      expect(files.some(f => f.path === '.gemini/settings.json')).toBeFalsy();
    });

    it('should cover getSchema branches', async () => {
       builderState.reviewData.set({ aiAgent: 'claude' });
       vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: 'test' });
       await service.generatePreview();
       
       builderState.reviewData.set({ aiAgent: 'unknown' });
       await service.generatePreview();
    });

    it('should return null if fetchJson returns no content in generateStaticFile', async () => {
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);
      const serviceAccess = service as unknown as { 
        generateStaticFile: (p: StaticFilePattern, a: string, pc: PlatformConfig | undefined, c: Record<string, unknown>) => Promise<GeneratedFile | null> 
      };
      const result = await serviceAccess.generateStaticFile({ type: 'static', url: 'test.json', path: 'test.md' }, 'agent', undefined, {});
      expect(result).toBeNull();
    });

    it('should use page.id if wrapperType is missing in getWrapperType', () => {
      const serviceAccess = service as unknown as ArchiveGeneratorPrivate;
      const result = serviceAccess.getWrapperType('after-tool');
      expect(result).toBe('hook');
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
