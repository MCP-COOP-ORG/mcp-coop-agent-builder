import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTaiga } from '@taiga-ui/core';
import { App } from './app';

// Taiga UI's dark mode token requires matchMedia which jsdom does not provide
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

describe('App', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
            providers: [provideRouter([]), provideTaiga()],
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(App);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should render app-header in the template', () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();
        const header = fixture.nativeElement.querySelector('app-header');
        expect(header).toBeTruthy();
    });
});
