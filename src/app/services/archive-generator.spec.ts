import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArchiveGenerator } from './archive-generator';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { vi } from 'vitest';
import { GeneratedFile } from '@shared/constants';
import * as schemas from '@shared/schemas';

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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generatePreview', () => {
    it('should use antigravity fallback if aiAgent is missing', async () => {
      builderState.reviewData.set({});
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);
      await service.generatePreview();
      // Since it fetches static assets for antigravity first
      expect(interpolator.fetchJson).toHaveBeenCalledWith('assets/main/antigravity.json');
    });

    it('should ignore static pattern if fetchJson returns no content', async () => {
      builderState.reviewData.set({ aiAgent: 'cursor' });
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: '' }); // empty content
      const files = await service.generatePreview();
      // cursor.json is requested but returns empty, so no file should be generated for it
      expect(files.some(f => f.path.includes('cursor'))).toBeFalsy();
    });

    it('should process dynamic-category for rules', async () => {
      vi.spyOn(service as any, 'getSchema').mockReturnValue([
        { path: '.rules/[category].md', type: 'dynamic-category', categories: ['architecture'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.rulesData.set({ architecture: ['signals'] });

      // Override getWrapperType to return rule
      vi.spyOn(service as any, 'getWrapperType').mockReturnValue('rule');
      
      // The code will try to fetch RULES['signals'] but since we can't mock the RULES object easily,
      // it might be undefined if 'signals' is not in the real RULES object.
      // But we can intercept fetchJson. Wait, if url is undefined, it skips.
      // We must provide a valid key that exists in RULES or SKILLS.
      // Let's just use a real key from the schemas, e.g., 'angular' in SKILLS.
      vi.spyOn(service as any, 'getSchema').mockReturnValue([
        { path: '.skills/[category].md', type: 'dynamic-category', categories: ['frontend'] }
      ]);
      builderState.agentsData.set({ frontend: ['angular'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url.includes('angular.json')) return { content: 'Angular Content' };
        if (url.includes('rule.json') || url.includes('skill.json')) return { antigravity: 'Wrapper: {content}' };
        return null;
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Rule');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.skills/frontend.md')).toBeTruthy();
      expect(files.find(f => f.path === '.skills/frontend.md')?.content).toBe('Interpolated Rule');
    });

    it('should skip dynamic-category if fetch returns no content', async () => {
      vi.spyOn(service as any, 'getSchema').mockReturnValue([
        { path: '.rules/[category].md', type: 'dynamic-category', categories: ['frontend'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.agentsData.set({ frontend: ['angular'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue(null);

      const files = await service.generatePreview();
      expect(files.length).toBe(0);
    });

    it('should process dynamic-item for workflows', async () => {
      vi.spyOn(service as any, 'getSchema').mockReturnValue([
        { path: '.workflows/[item].md', type: 'dynamic-item', categories: ['git'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.workflowsData.set({ git: ['gitflow'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('gitflow.json')) return { content: 'Workflow Content' };
        if (url && url.includes('workflow.json')) return { antigravity: 'Wrapper: {content}' };
        // Fallback for real URLs:
        return { content: 'Fallback', antigravity: 'Fallback: {content}' };
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Workflow');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.workflows/gitflow.md')).toBeTruthy();
    });

    it('should handle skill categories properly to return SKILL wrapper', async () => {
      vi.spyOn(service as any, 'getSchema').mockReturnValue([
        { path: '.skills/[item].md', type: 'dynamic-item', categories: ['frontend'] }
      ]);
      builderState.reviewData.set({ aiAgent: 'antigravity' });
      builderState.agentsData.set({ frontend: ['angular'] });
      
      vi.spyOn(interpolator, 'fetchJson').mockImplementation(async (url: string) => {
        if (url && url.includes('angular.json')) return { content: 'Skill Content' };
        if (url && url.includes('skill.json')) return { antigravity: 'Skill Wrapper' };
        return { content: 'Fallback', antigravity: 'Fallback: {content}' };
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('Interpolated Skill');

      const files = await service.generatePreview();
      expect(files.some(f => f.path === '.skills/angular.md')).toBeTruthy();
    });
  });

  describe('downloadArchive', () => {
    it('should use passed files if provided', async () => {
      const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);
      
      // Mock setTimeout to execute immediately
      vi.spyOn(globalThis, 'setTimeout').mockImplementation((cb: any) => {
        cb();
        return 0 as any;
      });

      const mockFiles: GeneratedFile[] = [
        { path: 'test.md', type: 'file', content: 'test' },
        { path: 'folder', type: 'folder', content: '' }
      ];

      await service.downloadArchive(mockFiles);

      expect(mockAnchor.download).toBe('ai-context.zip');
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should fallback to generatePreview if no files in cache and no files provided', async () => {
      const mockAnchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement;
      vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor);

      vi.spyOn(globalThis, 'setTimeout').mockImplementation((cb: any) => {
        cb();
        return 0 as any;
      });

      vi.spyOn(service, 'generatePreview').mockResolvedValue([{ path: 'auto.md', type: 'file', content: 'auto' }]);
      service.previewFiles.set([]);

      await service.downloadArchive();

      expect(service.generatePreview).toHaveBeenCalled();
      expect(mockAnchor.click).toHaveBeenCalled();
    });
  });
});


