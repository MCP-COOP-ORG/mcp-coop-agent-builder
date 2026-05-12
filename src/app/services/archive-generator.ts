import { inject, Injectable, signal } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from '@shared/constants';
import { ARCHIVE_SCHEMA } from '@shared/schemas';
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
    const context = this.buildContext();
    const files: GeneratedFile[] = [];

    for (const node of ARCHIVE_SCHEMA) {
      if (!this.isConditionMet(node.condition, context)) continue;

      if (node.type === 'folder') {
        files.push({ path: node.path, type: 'folder', content: '' });
      } else if (node.type === 'file' && node.templateUrl) {
        const content = await this.interpolator.fetchAndInterpolate(node.templateUrl, context);
        files.push({ path: node.path, type: 'file', content });
      }
    }

    this.previewFiles.set(files);
    return files;
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

  private buildContext(): Record<string, unknown> {
    return {
      ...this.builderState.setupData(),
      ...this.builderState.stackData(),
    };
  }

  private isConditionMet(condition: Record<string, unknown> | undefined, context: Record<string, unknown>): boolean {
    if (!condition) return true;
    return Object.keys(condition).every((key) => context[key] === condition[key]);
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
