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
   * Fetches a raw string or JSON from a URL.
   * If it's a JSON file, it will return the parsed object.
   */
  async fetchJson<T = unknown>(url: string): Promise<T | null> {
    try {
      return await firstValueFrom(this.http.get<T>(url, { responseType: 'json' }));
    } catch (error) {
      console.error(`Failed to fetch JSON template at ${url}`, error);
      return null;
    }
  }

  /**
   * Simple string interpolation for templates.
   */
  interpolate(template: string, context: Record<string, unknown>): string {
    if (!template) return '';
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      const val = context[key];
      if (Array.isArray(val)) return val.join(', ');
      return val !== undefined ? String(val) : match;
    });
  }
}
