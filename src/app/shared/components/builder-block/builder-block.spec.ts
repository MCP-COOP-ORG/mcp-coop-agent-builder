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
});
