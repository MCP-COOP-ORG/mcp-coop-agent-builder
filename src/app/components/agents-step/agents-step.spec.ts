import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BUILDER_STEPS, STEP_IDS } from '@shared/constants';
import { AgentsStep } from './agents-step';

describe('AgentsStep', () => {
  let component: AgentsStep;
  let fixture: ComponentFixture<AgentsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentsStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct step metadata to the view model', () => {
    const expectedData = BUILDER_STEPS.find(step => step.id === STEP_IDS.AGENTS);
    expect(component.view).toBeDefined();
    expect(component.view.step).toEqual(expectedData!);
  });

  it('should render the step title and description in the DOM', () => {
    const headingEl = fixture.debugElement.query(By.css('h2.tui-text_h3')).nativeElement;
    const descEl = fixture.debugElement.query(By.css('p.tui-text_body-m')).nativeElement;

    expect(headingEl.textContent.trim()).toBe(component.view.step.title);
    expect(descEl.textContent.trim()).toBe(component.view.step.description);
  });

  it('should generate FormGroup dynamically based on configuration', () => {
    const blockIds = component.view.blocksArray.map(b => b.id);
    const formKeys = Object.keys(component.form.controls);
    expect(formKeys.sort()).toEqual(blockIds.sort());
  });

  it('should sync form changes to BuilderState', () => {
    // Modify form value
    const firstKey = Object.keys(component.form.controls)[0];
    component.form.patchValue({ [firstKey]: ['react'] });
    // Verify signal state has been updated
    const state = component['builderState'].agentsData();
    expect(state[firstKey]).toEqual(['react']);
  });

  it('should handle all block types and initial data sync', () => {
    const newFixture = TestBed.createComponent(AgentsStep);
    const newComponent = newFixture.componentInstance;
    
    (newComponent as any).view.blocksArray = [
      { id: 'radioB', type: 'radio', title: 'R', icon: 'i', options: [{ id: '1', label: 'L' }] },
      { id: 'textB', type: 'textarea', title: 'T', icon: 'i', label: 'L' }
    ];

    // Case 1: Initial data exists
    newComponent['builderState'].agentsData.set({ radioB: '1' });
    newFixture.detectChanges();
    expect(newComponent.form.get('radioB')?.value).toBe('1');

    // Case 2: Form value changes sync back
    newComponent.form.get('textB')?.setValue('new content');
    expect(newComponent['builderState'].agentsData()['textB']).toBe('new content');
  });
});
