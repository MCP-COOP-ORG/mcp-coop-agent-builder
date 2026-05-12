import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * Service responsible for fetching templates and replacing variables.
 * Designed to support the Zero Literals Policy by loading content from external assets.
 */
@Injectable({
  providedIn: 'root'
})
export class TemplateInterpolator {
  private readonly http = inject(HttpClient);

  /**
   * Fetches a template by URL and interpolates the provided context into it.
   * TODO: Implement advanced Handlebars-like parsing or fragment composition later.
   * For now, it just fetches the static string and returns it.
   * 
   * @param url The relative path to the asset (e.g. 'assets/templates/ai/cursor.md')
   * @param context The state object from BuilderState to interpolate variables
   */
  async fetchAndInterpolate(url: string, context: Record<string, unknown>): Promise<string> {
    try {
      // Fetch the raw text content from the URL
      const content = await firstValueFrom(this.http.get(url, { responseType: 'text' }));
      
      // Basic interpolation (e.g., replacing {{ projectName }} with context.projectName)
      // We will expand this logic in future tasks.
      return content.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
        return context[key] !== undefined ? String(context[key]) : match;
      });
    } catch (error) {
      console.error(`Failed to fetch template at ${url}`, error);
      return `Error: Failed to load template from ${url}`;
    }
  }
}
