import { inject, Injectable, signal } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from '@shared/constants';
import { ANTIGRAVITY, CLAUDE, CURSOR, TEMPLATES, SKILLS, RULES, WORKFLOWS } from '@shared/schemas';
import { ArchivePattern } from '@shared/models';
import { BuilderState } from './builder-state';
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
   * Caches results in previewFiles signal for the Review step UI and later download.
   */
  async generatePreview(): Promise<GeneratedFile[]> {
    const setup = this.builderState.setupData();
    const stack = this.builderState.stackData();
    
    const agent = (setup['aiAgent'] as string) || 'antigravity';
    const schema = this.getSchema(agent);
    
    // Flatten projectIdentity so top-level variables (name, description, domains) are accessible
    const context = {
      ...setup,
      ...(setup['projectIdentity'] as Record<string, unknown> || {}),
      ...stack
    };
    
    const files: GeneratedFile[] = [];

    for (const pattern of schema) {
      if (pattern.type === 'static') {
        const json = await this.interpolator.fetchJson<{content: string}>(pattern.url);
        if (json?.content) {
           const content = this.interpolator.interpolate(json.content, context);
           files.push({ path: pattern.path, type: 'file', content });
        }
      } else if (pattern.type === 'dynamic-category') {
        for (const cat of pattern.categories) {
           const selectedItems = stack[cat] as string[];
           if (!selectedItems || selectedItems.length === 0) continue;
           
           let combinedContent = '';
           for (const item of selectedItems) {
             const url = SKILLS[item] || RULES[item] || WORKFLOWS[item];
             if (!url) continue;
             
             const snippet = await this.interpolator.fetchJson<{content: string}>(url);
             if (snippet?.content) {
                combinedContent += snippet.content + '\n\n';
             }
           }

           if (combinedContent) {
              const wrapperType = this.getWrapperType(cat);
              const wrapperUrl = TEMPLATES[wrapperType];
              if (wrapperUrl) {
                 const wrapperJson = await this.interpolator.fetchJson<Record<string, string>>(wrapperUrl);
                 if (wrapperJson && wrapperJson[agent]) {
                    const wrapperString = wrapperJson[agent];
                    const catName = cat.charAt(0).toUpperCase() + cat.slice(1) + ' Engineering Standard';
                    
                    const finalContent = this.interpolator.interpolate(wrapperString, {
                      name: catName,
                      description: `Standard rules and conventions for ${cat}.`,
                      globs: '*',
                      content: combinedContent.trim()
                    });

                    const path = pattern.path.replace('[category]', cat);
                    files.push({ path, type: 'file', content: finalContent });
                 }
              }
           }
        }
      } else if (pattern.type === 'dynamic-item') {
        for (const cat of pattern.categories) {
           const selectedItems = stack[cat] as string[];
           if (!selectedItems || selectedItems.length === 0) continue;
           
           for (const item of selectedItems) {
             const url = SKILLS[item] || RULES[item] || WORKFLOWS[item];
             if (!url) continue;
             
             const snippet = await this.interpolator.fetchJson<{content: string}>(url);
             if (snippet?.content) {
                const wrapperType = this.getWrapperType(cat);
                const wrapperUrl = TEMPLATES[wrapperType];
                if (wrapperUrl) {
                   const wrapperJson = await this.interpolator.fetchJson<Record<string, string>>(wrapperUrl);
                   if (wrapperJson && wrapperJson[agent]) {
                      const wrapperString = wrapperJson[agent];
                      const itemName = item.charAt(0).toUpperCase() + item.slice(1);
                      
                      const finalContent = this.interpolator.interpolate(wrapperString, {
                        name: itemName,
                        description: `Standard operational workflow for ${item}.`,
                        globs: '*',
                        content: snippet.content.trim()
                      });

                      const path = pattern.path.replace('[item]', item);
                      files.push({ path, type: 'file', content: finalContent });
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
    if (agent === 'claude') return CLAUDE;
    if (agent === 'cursor') return CURSOR;
    return ANTIGRAVITY;
  }

  private getWrapperType(category: string): 'skill' | 'rule' | 'workflow' {
    if (['frontend', 'backend', 'database'].includes(category)) return 'skill';
    if (['conventions', 'tooling'].includes(category)) return 'rule';
    return 'workflow';
  }

  /**
   * Packs the given files into a ZIP and triggers browser download.
   * Uses cached previewFiles as a fallback if no argument is provided.
   */
  async downloadArchive(files?: GeneratedFile[]): Promise<void> {
    let sourceFiles = files ?? this.previewFiles();

    // If still no files, generate them now (fallback for direct calls)
    if (sourceFiles.length === 0) {
      sourceFiles = await this.generatePreview();
    }

    const zipData: Record<string, Uint8Array | [Uint8Array, { mtime?: number }]> = {};

    for (const file of sourceFiles) {
      if (file.type === 'folder') {
        zipData[`${file.path}/.keep`] = strToU8('');
      } else {
        zipData[file.path] = strToU8(file.content);
      }
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
