import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuilderBlock } from './builder-block';
import { Component } from '@angular/core';

@Component({
    template: `
        <app-builder-block title="Test Title" icon="@tui.star">
            <div class="test-content">Projected Content</div>
        </app-builder-block>
    `,
    imports: [BuilderBlock],
})
class TestHostComponent {}

describe('BuilderBlock', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and render title and icon', () => {
        expect(component).toBeTruthy();

        const compiled = fixture.nativeElement as HTMLElement;

        const titleEl = compiled.querySelector('h3');
        expect(titleEl?.textContent).toContain('Test Title');

        const iconEl = compiled.querySelector('tui-icon');
        expect(iconEl).toBeTruthy();
    });

    it('should project content', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const projectedEl = compiled.querySelector('.test-content');
        expect(projectedEl).toBeTruthy();
        expect(projectedEl?.textContent).toContain('Projected Content');
    });

    it('should render environment tags when events are provided', () => {
        // Create a new host component with events
        @Component({
            template: `
                <app-builder-block
                    title="Hooks"
                    icon="@tui.webhook"
                    [events]="{ antigravity: 'SessionStart', claude: 'SessionStart' }">
                </app-builder-block>
            `,
            imports: [BuilderBlock],
        })
        class TagsHostComponent {}

        const tagsFixture = TestBed.createComponent(TagsHostComponent);
        tagsFixture.detectChanges();

        const compiled = tagsFixture.nativeElement as HTMLElement;
        const tags = compiled.querySelectorAll('.builder-block__tag');

        expect(tags.length).toBe(2);
        expect(tags[0].textContent).toContain('antigravity');
        expect(tags[1].textContent).toContain('claude');
    });

    it('should render description subtitle when provided', () => {
        @Component({
            template: `
                <app-builder-block title="Hooks" icon="@tui.webhook" description="Test description subtitle">
                </app-builder-block>
            `,
            imports: [BuilderBlock],
        })
        class DescriptionHostComponent {}

        const descFixture = TestBed.createComponent(DescriptionHostComponent);
        descFixture.detectChanges();

        const compiled = descFixture.nativeElement as HTMLElement;
        const descEl = compiled.querySelector('.builder-block__subtitle');

        expect(descEl).toBeTruthy();
        expect(descEl?.textContent).toContain('Test description subtitle');
    });

    it('should render recommended badge when isDefault is true', () => {
        @Component({
            template: `
                <app-builder-block title="Common Rules" icon="@tui.shield" [isDefault]="true"> </app-builder-block>
            `,
            imports: [BuilderBlock],
        })
        class DefaultHostComponent {}

        const defaultFixture = TestBed.createComponent(DefaultHostComponent);
        defaultFixture.detectChanges();

        const compiled = defaultFixture.nativeElement as HTMLElement;
        const recommendedBadge = compiled.querySelector('.builder-block__tag--recommended');

        expect(recommendedBadge).toBeTruthy();
        expect(recommendedBadge?.textContent?.trim()).toBe('recommended');
    });

    it('should not render recommended badge when isDefault is not set', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const recommendedBadge = compiled.querySelector('.builder-block__tag--recommended');

        expect(recommendedBadge).toBeNull();
    });
});
