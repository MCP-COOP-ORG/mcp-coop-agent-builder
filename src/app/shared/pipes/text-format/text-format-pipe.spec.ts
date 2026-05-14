import { TestBed } from '@angular/core/testing';
import { SafeHtml } from '@angular/platform-browser';
import { TextFormatPipe } from './text-format-pipe';

describe('TextFormatPipe', () => {
  let pipe: TextFormatPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TextFormatPipe]
    });
    pipe = TestBed.inject(TextFormatPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should replace \\n with <br>', () => {
    const result = pipe.transform('Line 1\nLine 2') as SafeHtml & { changingThisBreaksApplicationSecurity: string };
    expect(result.changingThisBreaksApplicationSecurity).toContain('Line 1<br>Line 2');
  });

  it('should highlight keywords', () => {
    const result = pipe.transform('Highlight this word.', ['word']) as SafeHtml & { changingThisBreaksApplicationSecurity: string };
    expect(result.changingThisBreaksApplicationSecurity).toContain('Highlight this <span class="highlight">word</span>.');
  });

  it('should escape HTML to prevent XSS', () => {
    const result = pipe.transform('<script>alert("XSS")</script>') as SafeHtml & { changingThisBreaksApplicationSecurity: string };
    expect(result.changingThisBreaksApplicationSecurity).toContain('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(result.changingThisBreaksApplicationSecurity).not.toContain('<script>');
  });
});
