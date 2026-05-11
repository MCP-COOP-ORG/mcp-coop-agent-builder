import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { ProjectStep } from './project-step';

describe('ProjectStep', () => {
  let component: ProjectStep;
  let fixture: ComponentFixture<ProjectStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStep],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectStep);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct step metadata to the view model', () => {
    const expectedData = BUILDER_STEPS.find(step => step.id === STEP_IDS.PROJECT);
    expect(component.view).toBeDefined();
    expect(component.view).toEqual(expectedData!);
  });

  it('should render the step title and description in the DOM', () => {
    const headingEl = fixture.debugElement.query(By.css('h2.tui-text_h3')).nativeElement;
    const descEl = fixture.debugElement.query(By.css('p.tui-text_body-m')).nativeElement;

    expect(headingEl.textContent.trim()).toBe(component.view.title);
    expect(descEl.textContent.trim()).toBe(component.view.description);
  });
});
