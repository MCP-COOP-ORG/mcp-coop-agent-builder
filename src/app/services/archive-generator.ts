import { inject, Injectable, signal } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from '@shared/constants';
import { CLAUDE, CURSOR, ANTIGRAVITY } from '@shared/schemas';
import { ASSET_FILE_PATHS, GENERATED_PLATFORMS_CONFIG, MAIN } from '@shared/configs';
import { ArchivePattern } from '@shared/models';
import { BuilderState } from './builder-state';
import { SKILL_CATEGORIES, RULE_CATEGORIES, WRAPPER_TYPES, WrapperType, DEFAULT_TEMPLATE_PARAMS } from '@shared/constants';
import { TemplateInterpolator } from './template-interpolator';

@Injectable({
  providedIn: 'root'
})
export class ArchiveGenerator {
  private readonly builderState = inject(BuilderState);
  private readonly interpolator = inject(TemplateInterpolator);

  /** In-memory cache of generated files — populated by generatePreview(), consumed by downloadArchive() */
  readonly previewFiles = signal<GeneratedFile[]>([]);

  /**
   * Generates all files in memory without downloading.
   */
  async generatePreview(): Promise<GeneratedFile[]> {
    const desc = this.builderState.descriptionData();
    const agents = this.builderState.agentsData();
    const rules = this.builderState.rulesData();
    const workflows = this.builderState.workflowsData();
    const review = this.builderState.reviewData();
    
    const agent = (review['aiAgent'] as string) || 'antigravity';
    const schema = this.getSchema(agent);
    const platformConfig = GENERATED_PLATFORMS_CONFIG[agent];
    
    const context = {
      ...desc,
      ...(desc['projectIdentity'] as Record<string, unknown> || {}),
      ...agents,
      ...rules,
      ...workflows
    };
    
    const files: GeneratedFile[] = [];

    for (const pattern of schema) {
      if (pattern.type === 'static') {
        // Optimization: if it's the main file, use platformConfig.content directly
        if (platformConfig && pattern.url === MAIN[agent]) {
           const content = this.interpolator.interpolate(platformConfig.content, context);
           files.push({ path: pattern.path, type: 'file', content });
        } else {
           const json = await this.interpolator.fetchJson<{content: string}>(pattern.url!);
           if (json?.content) {
              const content = this.interpolator.interpolate(json.content, context);
              files.push({ path: pattern.path, type: 'file', content });
           }
        }
      } else if (pattern.type === 'dynamic-category' || pattern.type === 'dynamic-item') {
        for (const cat of pattern.categories!) {
           const selectedItems = context[cat] as string[];
           if (!selectedItems || selectedItems.length === 0) continue;
           
           if (pattern.type === 'dynamic-category') {
             let combinedContent = '';
             for (const item of selectedItems) {
               const url = ASSET_FILE_PATHS[item];
               if (!url) continue;
               const snippet = await this.interpolator.fetchJson<{ description: Record<string, string> }>(url);
               const itemContent = snippet?.description?.[agent];
               if (itemContent) combinedContent += itemContent + '\n\n';
             }

             if (combinedContent) {
                const wrapperType = this.getWrapperType(cat);
                const wrapperString = platformConfig?.templates?.[wrapperType as keyof typeof platformConfig.templates] as string;
                
                if (wrapperString) {
                  const finalContent = this.interpolator.interpolate(wrapperString, {
                    name: cat.charAt(0).toUpperCase() + cat.slice(1) + ' Engineering Standard',
                    trigger: DEFAULT_TEMPLATE_PARAMS.trigger,
                    description: DEFAULT_TEMPLATE_PARAMS.getRuleDescription(cat),
                    globs: DEFAULT_TEMPLATE_PARAMS.globs,
                    content: combinedContent.trim()
                  });
                  files.push({ path: pattern.path.replace('[category]', cat), type: 'file', content: finalContent });
                }
             }
           } else {
             // dynamic-item
             for (const item of selectedItems) {
               const url = ASSET_FILE_PATHS[item];
               if (!url) continue;
               const snippet = await this.interpolator.fetchJson<{ description: Record<string, string> }>(url);
               const itemContent = snippet?.description?.[agent];
               
               if (itemContent) {
                  const wrapperType = this.getWrapperType(cat);
                  const wrapperString = platformConfig?.templates?.[wrapperType as keyof typeof platformConfig.templates] as string;
                  
                  if (wrapperString) {
                     const finalContent = this.interpolator.interpolate(wrapperString, {
                       name: item.charAt(0).toUpperCase() + item.slice(1),
                       trigger: DEFAULT_TEMPLATE_PARAMS.trigger,
                       description: DEFAULT_TEMPLATE_PARAMS.getWorkflowDescription(item),
                       globs: DEFAULT_TEMPLATE_PARAMS.globs,
                       content: itemContent.trim()
                     });
                     files.push({ path: pattern.path.replace('[item]', item), type: 'file', content: finalContent });
                  }
               }
             }
           }
        }
      }
    }

    this.previewFiles.set(files);
    return files;
  }

  private getSchema(agent: string): ArchivePattern[] {
    switch (agent) {
      case 'claude': return CLAUDE;
      case 'cursor': return CURSOR;
      case 'antigravity': return ANTIGRAVITY;
      default: return ANTIGRAVITY;
    }
  }

  private getWrapperType(category: string): WrapperType {
    if (SKILL_CATEGORIES.includes(category)) return WRAPPER_TYPES.SKILL;
    if (RULE_CATEGORIES.includes(category)) return WRAPPER_TYPES.RULE;
    return WRAPPER_TYPES.WORKFLOW;
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
    this.triggerDownload(blob, 'ai-context.zip');
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}
