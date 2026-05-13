import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideTaiga, TUI_DARK_MODE } from '@taiga-ui/core';
import { AppHeader } from './app-header';
import { BUILDER_DICTIONARY } from '@shared/constants';

// Taiga UI dark mode requires matchMedia which jsdom does not provide
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

describe('AppHeader', () => {
  let fixture: ComponentFixture<AppHeader>;
  let component: AppHeader;
  const mockDarkMode = signal(false);

  beforeEach(async () => {
    mockDarkMode.set(false);

    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [
        provideTaiga(),
        { provide: TUI_DARK_MODE, useValue: mockDarkMode },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show moon icon in light mode', () => {
    mockDarkMode.set(false);
    fixture.detectChanges();
    expect(component['view'].themeIcon()).toBe(BUILDER_DICTIONARY.header.darkModeIcon);
  });

  it('should show sun icon in dark mode', () => {
    mockDarkMode.set(true);
    fixture.detectChanges();
    expect(component['view'].themeIcon()).toBe(BUILDER_DICTIONARY.header.lightModeIcon);
  });

  it('should toggle theme from light to dark', () => {
    mockDarkMode.set(false);
    component['toggleTheme']();
    expect(mockDarkMode()).toBe(true);
  });

  it('should toggle theme from dark to light', () => {
    mockDarkMode.set(true);
    component['toggleTheme']();
    expect(mockDarkMode()).toBe(false);
  });
});
