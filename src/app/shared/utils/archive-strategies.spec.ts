import { TestBed } from '@angular/core/testing';
import { StaticFileStrategy, DynamicCategoryStrategy, DynamicItemStrategy, DynamicHookStrategy, fetchItemsConcurrently, getWrapperType } from './archive-strategies';
import { TemplateInterpolator } from '../../services/template-interpolator';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';

describe('Archive Strategies', () => {
  let interpolator: TemplateInterpolator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        TemplateInterpolator
      ]
    });
    interpolator = TestBed.inject(TemplateInterpolator);
  });

  describe('fetchItemsConcurrently', () => {
    it('should return empty array if items is empty', async () => {
      const result = await fetchItemsConcurrently([], interpolator);
      expect(result).toEqual([]);
    });
  });

  describe('getWrapperType', () => {
    it('should fallback to workflow', () => {
      expect(getWrapperType('nonexistent-category')).toBe('workflow');
    });
  });

  describe('StaticFileStrategy', () => {
    it('should generate file from fetchJson if platformConfig is missing', async () => {
      const strategy = new StaticFileStrategy();
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({ content: 'test content' });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('test content');

      const files = await strategy.generate({ type: 'static', path: 'test.md', url: 'test.json' }, {}, 'custom', undefined, interpolator);
      
      expect(files.length).toBe(1);
      expect(files[0].content).toBe('test content');
    });
  });

  describe('DynamicCategoryStrategy', () => {
    it('should generate files with valid items', async () => {
      const strategy = new DynamicCategoryStrategy();
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({
        description: { custom: 'custom content', default: 'default content' }
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('interpolated');

      const files = await strategy.generate(
        { type: 'dynamic-category', path: '[category].md', categories: ['cat1'] },
        { cat1: ['eslint'] },
        'custom',
        { id: 'mock', label: 'mock', content: '', templates: { workflow: 'wrapper', skill: 'wrapper', rule: 'wrapper' } },
        interpolator
      );
      console.log('DynamicCategoryStrategy files:', files);

      expect(files.length).toBe(1);
      expect(files[0].content).toBe('interpolated');
    });

    it('should ignore if selectedItems is empty', async () => {
      const strategy = new DynamicCategoryStrategy();
      const files = await strategy.generate(
        { type: 'dynamic-category', path: '[category].md', categories: ['cat1'] },
        { cat1: [] },
        'custom',
        undefined,
        interpolator
      );
      expect(files.length).toBe(0);
    });
  });

  describe('DynamicItemStrategy', () => {
    it('should generate files with valid items', async () => {
      const strategy = new DynamicItemStrategy();
      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({
        description: { default: 'default content' }
      });
      vi.spyOn(interpolator, 'interpolate').mockReturnValue('interpolated');

      const files = await strategy.generate(
        { type: 'dynamic-item', path: '[item].md', categories: ['cat1'] },
        { cat1: ['eslint'] },
        'custom',
        { id: 'mock', label: 'mock', content: '', templates: { workflow: 'wrapper', skill: 'wrapper', rule: 'wrapper' } },
        interpolator
      );

      expect(files.length).toBe(1);
      expect(files[0].content).toBe('interpolated');
    });
  });

  describe('DynamicHookStrategy', () => {
    it('should generate hooks JSON if valid events exist', async () => {
      const strategy = new DynamicHookStrategy();
      
      // Mock the hooks config
      const originalHooks = GENERATED_PAGES_CONFIG['hooks'];
      GENERATED_PAGES_CONFIG['hooks'] = {
        id: 'hooks',
        title: 'Hooks',
        label: 'Hooks',
        icon: 'icon',
        description: 'Hooks',
        categories: [
          {
            id: 'hookCat',
            title: 'Hook Cat',
            icon: 'icon',
            type: 'checkbox',
            events: { custom: 'onCustomEvent' },
            items: []
          }
        ]
      };

      vi.spyOn(interpolator, 'fetchJson').mockResolvedValue({
        hook: {
          custom: { matcher: 'test', type: 'command', command: 'echo test' }
        }
      });

      const files = await strategy.generate(
        { type: 'dynamic-hook', path: 'settings.json', categories: ['hookCat'] },
        { hookCat: ['eslint'] },
        'custom',
        undefined,
        interpolator
      );

      expect(files.length).toBe(1);
      expect(files[0].content).toContain('onCustomEvent');
      
      // Restore
      GENERATED_PAGES_CONFIG['hooks'] = originalHooks;
    });

    it('should return empty if hooksPage does not exist', async () => {
      const strategy = new DynamicHookStrategy();
      const originalHooks = GENERATED_PAGES_CONFIG['hooks'];
      delete (GENERATED_PAGES_CONFIG as Record<string, unknown>)['hooks'];

      const files = await strategy.generate(
        { type: 'dynamic-hook', path: 'settings.json', categories: ['hookCat'] },
        {},
        'custom',
        undefined,
        interpolator
      );

      expect(files.length).toBe(0);
      GENERATED_PAGES_CONFIG['hooks'] = originalHooks;
    });
  });
});
