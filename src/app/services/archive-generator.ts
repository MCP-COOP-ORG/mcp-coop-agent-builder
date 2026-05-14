import { inject, Injectable, signal } from '@angular/core';
import { strToU8, zipSync } from 'fflate';
import { GeneratedFile } from '@shared/constants';
import { CLAUDE, CURSOR, ANTIGRAVITY } from '../shared/schemas';
import { GENERATED_PLATFORMS_CONFIG } from '@shared/configs';
import { ArchivePattern } from '@shared/models';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { triggerDownload, ArchiveStrategy, StaticFileStrategy, DynamicCategoryStrategy, DynamicItemStrategy, DynamicHookStrategy } from '@shared/utils';

// -----------------------------------------------------------------------------
// Factory & Registry (GoF)
// -----------------------------------------------------------------------------
const SCHEMA_MAP: Record<string, ArchivePattern[]> = {
  claude: CLAUDE,
  cursor: CURSOR,
  antigravity: ANTIGRAVITY
};

// -----------------------------------------------------------------------------
// Generator Engine
// -----------------------------------------------------------------------------
@Injectable({
  providedIn: 'root'
})
export class ArchiveGenerator {
  private readonly builderState = inject(BuilderState);
  private readonly interpolator = inject(TemplateInterpolator);

  private readonly strategies: Record<string, ArchiveStrategy<ArchivePattern>> = {
    'static': new StaticFileStrategy(),
    'dynamic-category': new DynamicCategoryStrategy(),
    'dynamic-item': new DynamicItemStrategy(),
    'dynamic-hook': new DynamicHookStrategy()
  };

  /** In-memory cache of generated files — populated by generatePreview(), consumed by downloadArchive() */
  readonly previewFiles = signal<GeneratedFile[]>([]);

  async generatePreview(): Promise<GeneratedFile[]> {
    const desc = this.builderState.descriptionData();
    const review = this.builderState.reviewData();
    
    const agent = (review['aiAgent'] as string) || 'antigravity';
    const schema = SCHEMA_MAP[agent] ?? ANTIGRAVITY;
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
      const strategy = this.strategies[pattern.type];
      if (strategy) {
        const generated = await strategy.generate(pattern, context, agent, platformConfig, this.interpolator);
        files.push(...generated);
      }
    }

    this.previewFiles.set(files);
    return files;
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
