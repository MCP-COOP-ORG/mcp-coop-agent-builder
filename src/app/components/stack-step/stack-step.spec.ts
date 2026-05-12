import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { StackStep } from './stack-step';

describe('StackStep', () => {
  let component: StackStep;
  let fixture: ComponentFixture<StackStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackStep],
    }).compileComponents();

    fixture = TestBed.createComponent(StackStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct step metadata to the view model', () => {
    const expectedData = BUILDER_STEPS.find(step => step.id === STEP_IDS.STACK);
    expect(component.view).toBeDefined();
    expect(component.view.step).toEqual(expectedData!);
  });

  it('should render the step title and description in the DOM', () => {
    const headingEl = fixture.debugElement.query(By.css('h2.tui-text_h3')).nativeElement;
    const descEl = fixture.debugElement.query(By.css('p.tui-text_body-m')).nativeElement;

    expect(headingEl.textContent.trim()).toBe(component.view.step.title);
    expect(descEl.textContent.trim()).toBe(component.view.step.description);
  });

  it('should generate FormGroup dynamically based on STACK_BLOCKS', () => {
    const blockIds = component.view.blocksArray.map(b => b.id);
    const formKeys = Object.keys(component.form.controls);
    expect(formKeys.sort()).toEqual(blockIds.sort());
  });

  it('should sync form changes to BuilderState', () => {
    // Modify form value
    component.form.patchValue({ frontend: ['react'] });
    // Verify signal state has been updated
    const state = (component as any).builderState.stackData();
    expect(state.frontend).toEqual(['react']);
  });
});
