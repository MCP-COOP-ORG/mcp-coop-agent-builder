import { Injectable, inject } from '@angular/core';
import { zipSync, strToU8 } from 'fflate';
import { BuilderState } from './builder-state';
import { TemplateInterpolator } from './template-interpolator';
import { ARCHIVE_SCHEMA } from '@shared/schemas';

@Injectable({
  providedIn: 'root'
})
export class ArchiveGenerator {
  private readonly builderState = inject(BuilderState);
  private readonly interpolator = inject(TemplateInterpolator);

  /**
   * Orchestrates the generation of the ZIP archive based on the user's state
   * and the declarative ARCHIVE_SCHEMA.
   */
  async downloadArchive(): Promise<void> {
    const setupData = this.builderState.setupData();
    const stackData = this.builderState.stackData();
    const context = { ...setupData, ...stackData };

    console.log('=== Archive Generation Started ===');
    console.log('1. Extracted Context from State:', context);

    // The object structure required by fflate
    const zipData: Record<string, Uint8Array | [Uint8Array, { mtime?: number }]> = {};

    console.log('2. Iterating ARCHIVE_SCHEMA:');
    for (const node of ARCHIVE_SCHEMA) {
      const isMet = this.isConditionMet(node.condition, context);
      console.log(`   - Node path: ${node.path}, Condition:`, node.condition, `=> Met: ${isMet}`);
      
      if (isMet) {
        if (node.type === 'folder') {
          console.log(`     -> Adding empty folder: ${node.path}`);
          zipData[`${node.path}/.keep`] = strToU8(''); 
        } else if (node.type === 'file' && node.templateUrl) {
          console.log(`     -> Fetching template for file: ${node.path} from ${node.templateUrl}`);
          const content = await this.interpolator.fetchAndInterpolate(node.templateUrl, context);
          console.log(`     -> Interpolated content length: ${content.length} characters`);
          zipData[node.path] = strToU8(content);
        }
      }
    }

    console.log('3. Final zipData Object keys:', Object.keys(zipData));

    // Generate the ZIP blob synchronously using fflate
    const zipped = zipSync(zipData);
    console.log(`4. Zip blob created. Size: ${zipped.length} bytes`);
    
    const blob = new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
    
    console.log('5. Triggering download...');
    this.triggerDownload(blob, 'ai-context.zip');
    console.log('=== Archive Generation Finished ===');
  }

  /**
   * Validates if the node should be included based on the current state.
   */
  private isConditionMet(condition: Record<string, unknown> | undefined, context: Record<string, unknown>): boolean {
    if (!condition) return true; // No conditions = always include
    
    // Check if every key in the condition matches the corresponding key in the context
    return Object.keys(condition).every(key => context[key] === condition[key]);
  }

  /**
   * Native browser download trigger
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}
