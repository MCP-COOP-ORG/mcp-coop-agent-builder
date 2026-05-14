import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'textFormat',
  standalone: true
})
export class TextFormatPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | undefined | null, keywords: string[] | readonly string[] = []): SafeHtml | string {
    if (!value) {
      return '';
    }

    // Basic HTML escaping to prevent XSS before applying structural tags
    let formattedText = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Highlight the specified keywords
    if (keywords && keywords.length > 0) {
      keywords.forEach(keyword => {
        if (keyword) {
          // Escape the keyword for safe Regex execution
          const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedKeyword})`, 'gi');
          formattedText = formattedText.replace(regex, '<span class="highlight">$1</span>');
        }
      });
    }

    // Convert newline characters into <br> tags
    formattedText = formattedText.replace(/\n/g, '<br>');

    // Bypass security since we manually sanitized and only added safe structural elements
    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }
}
