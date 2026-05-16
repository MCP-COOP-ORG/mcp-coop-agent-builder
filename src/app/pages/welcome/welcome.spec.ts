import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

import { Welcome } from './welcome';

describe('Welcome', () => {
    let component: Welcome;
    let fixture: ComponentFixture<Welcome>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Welcome],
            providers: [
                provideRouter([]),
                { provide: IMAGE_LOADER, useValue: (config: ImageLoaderConfig) => `http://localhost/${config.src}` },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Welcome);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
