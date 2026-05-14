import { inject, Injectable, signal } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from '@shared/constants';
import { CLAUDE, CURSOR, ANTIGRAVITY } from '@shared/schemas';
import { ASSET_FILE_PATHS, GENERATED_PAGES_CONFIG, GENERATED_PLATFORMS_CONFIG, MAIN } from '@shared/configs';
import { ArchivePattern, StaticFilePattern, DynamicCategoryPattern, DynamicItemPattern, DynamicHookPattern, PlatformConfig } from '@shared/models';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';

import { triggerDownload } from '@shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ArchiveGenerator {
  private readonly builderState = inject(BuilderState);
  private readonly interpolator = inject(TemplateInterpolator);

  /** In-memory cache of generated files — populated by generatePreview(), consumed by downloadArchive() */
  readonly previewFiles = signal<GeneratedFile[]>([]);

  async generatePreview(): Promise<GeneratedFile[]> {
    const desc = this.builderState.descriptionData();
    const review = this.builderState.reviewData();
    
    const agent = (review['aiAgent'] as string) || 'antigravity';
    const schema = this.getSchema(agent);
    const platformConfig = GENERATED_PLATFORMS_CONFIG[agent as keyof typeof GENERATED_PLATFORMS_CONFIG];
    
    let dynamicContext = {};
    Object.keys(this.builderState.dynamicData).forEach(key => {
      dynamicContext = { ...dynamicContext, ...this.builderState.dynamicData[key]() };
    });

    const context: Record<string, unknown> = {
      ...desc,
      ...(desc['projectIdentity'] as Record<string, unknown> || {}),
      ...dynamicContext
    };
    
    const files: GeneratedFile[] = [];

    for (const pattern of schema) {
      if (pattern.type === 'static') {
        const staticFile = await this.generateStaticFile(pattern, agent, platformConfig, context);
        if (staticFile) files.push(staticFile);
      } else if (pattern.type === 'dynamic-category' || pattern.type === 'dynamic-item') {
        for (const cat of pattern.categories!) {
           const selectedItems = context[cat] as string[];
           if (!selectedItems || selectedItems.length === 0) continue;
           
           if (pattern.type === 'dynamic-category') {
             const categoryFile = await this.generateDynamicCategory(pattern, cat, selectedItems, agent, platformConfig);
             if (categoryFile) files.push(categoryFile);
           } else {
             const itemFiles = await this.generateDynamicItem(pattern, cat, selectedItems, agent, platformConfig);
             files.push(...itemFiles);
           }
        }
      } else if (pattern.type === 'dynamic-hook') {
        const hookFile = await this.generateHookFile(pattern, context, agent);
        if (hookFile) files.push(hookFile);
      }
    }

    this.previewFiles.set(files);
    return files;
  }

  private async generateStaticFile(pattern: StaticFilePattern, agent: string, platformConfig: PlatformConfig | undefined, context: Record<string, unknown>): Promise<GeneratedFile | null> {
    if (platformConfig && pattern.url === MAIN[agent as keyof typeof MAIN]) {
       const content = this.interpolator.interpolate(platformConfig.content, context);
       return { path: pattern.path, type: 'file', content };
    } else {
       const json = await this.interpolator.fetchJson<{content: string}>(pattern.url!);
       if (json?.content) {
          const content = this.interpolator.interpolate(json.content, context);
          return { path: pattern.path, type: 'file', content };
       }
    }
    return null;
  }

  private async generateDynamicCategory(pattern: DynamicCategoryPattern, cat: string, selectedItems: string[], agent: string, platformConfig: PlatformConfig | undefined): Promise<GeneratedFile | null> {
    let combinedContent = '';
    for (const item of selectedItems) {
      const url = ASSET_FILE_PATHS[item as keyof typeof ASSET_FILE_PATHS];
      if (!url) continue;
      const snippet = await this.interpolator.fetchJson<{ description: Record<string, string> }>(url);
      const itemContent = snippet?.description?.[agent] ?? snippet?.description?.['default'];
      if (itemContent) combinedContent += itemContent + '\n\n';
    }

    if (combinedContent) {
      const wrapperType = this.getWrapperType(cat);
      const wrapperString = platformConfig?.templates?.[wrapperType as keyof typeof platformConfig.templates] as string | undefined;
      
      if (wrapperString) {
        const defaults = platformConfig?.defaults;
        const defaultDesc = wrapperType === 'skill'
          ? (defaults?.skillDescription ?? '')
          : (defaults?.ruleDescription ?? '');

        const finalContent = this.interpolator.interpolate(wrapperString, {
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          trigger: defaults?.trigger ?? '',
          description: defaultDesc.replace('{{category}}', cat),
          ...(defaults?.globs ? { globs: defaults.globs } : {}),
          content: combinedContent.trim()
        });
        return { path: pattern.path.replace('[category]', cat), type: 'file', content: finalContent };
      }
    }
    return null;
  }

  private async generateDynamicItem(pattern: DynamicItemPattern, cat: string, selectedItems: string[], agent: string, platformConfig: PlatformConfig | undefined): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    for (const item of selectedItems) {
      const url = ASSET_FILE_PATHS[item as keyof typeof ASSET_FILE_PATHS];
      if (!url) continue;
      const snippet = await this.interpolator.fetchJson<{ description: Record<string, string> }>(url);
      const itemContent = snippet?.description?.[agent] ?? snippet?.description?.['default'];
      
      if (itemContent) {
        const wrapperType = this.getWrapperType(cat);
        const wrapperString = platformConfig?.templates?.[wrapperType as keyof typeof platformConfig.templates] as string | undefined;
        
        if (wrapperString) {
            const defaults = platformConfig?.defaults;
            const finalContent = this.interpolator.interpolate(wrapperString, {
              name: item.charAt(0).toUpperCase() + item.slice(1),
              trigger: defaults?.trigger ?? '',
              description: (defaults?.workflowDescription ?? '').replace('{{item}}', item),
              ...(defaults?.globs ? { globs: defaults.globs } : {}),
              content: itemContent.trim()
            });
            files.push({ path: pattern.path.replace('[item]', item), type: 'file', content: finalContent });
        }
      }
    }
    return files;
  }

  private async generateHookFile(pattern: DynamicHookPattern, context: Record<string, unknown>, agent: string): Promise<GeneratedFile | null> {
    const hooksPage = GENERATED_PAGES_CONFIG['hooks'];
    if (!hooksPage) return null;

    const hookEntries: Record<string, { matcher: string; hooks: { type: string; command: string }[] }[]> = {};

    for (const catId of pattern.categories) {
      const selectedItems = context[catId] as string[];
      if (!selectedItems || selectedItems.length === 0) continue;

      const category = hooksPage.categories.find(c => c.id === catId);
      const platformEventName = category?.events?.[agent];
      if (!platformEventName) continue;

      for (const itemId of selectedItems) {
        const url = ASSET_FILE_PATHS[itemId as keyof typeof ASSET_FILE_PATHS];
        if (!url) continue;

        const snippet = await this.interpolator.fetchJson<{ hook?: Record<string, { matcher: string; type: string; command: string }> }>(url);
        const hookData = snippet?.hook?.[agent];
        if (!hookData) continue;

        if (!hookEntries[platformEventName]) {
          hookEntries[platformEventName] = [];
        }

        hookEntries[platformEventName].push({
          matcher: hookData.matcher,
          hooks: [{ type: hookData.type, command: hookData.command }]
        });
      }
    }

    if (Object.keys(hookEntries).length === 0) return null;

    const settingsJson = JSON.stringify({ hooks: hookEntries }, undefined, 2);
    return { path: pattern.path, type: 'file', content: settingsJson };
  }

  private getSchema(agent: string): ArchivePattern[] {
    switch (agent) {
      case 'claude': return CLAUDE;
      case 'cursor': return CURSOR;
      case 'antigravity': return ANTIGRAVITY;
      default: return ANTIGRAVITY;
    }
  }

  private getWrapperType(category: string): string {
    for (const page of Object.values(GENERATED_PAGES_CONFIG)) {
      if (page.categories.some(c => c.id === category)) {
        return page.wrapperType ?? page.id;
      }
    }
    return 'workflow';
  }

  async downloadArchive(files?: GeneratedFile[]): Promise<void> {
    let sourceFiles = files ?? this.previewFiles();
    if (sourceFiles.length === 0) sourceFiles = await this.generatePreview();

    const zipData: Record<string, Uint8Array> = {};
    for (const file of sourceFiles) {
      if (file.type === 'file') zipData[file.path] = strToU8(file.content);
    }

    const zipped = zipSync(zipData);
    const blob = new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
    triggerDownload(blob, 'ai-context.zip');
  }
}
