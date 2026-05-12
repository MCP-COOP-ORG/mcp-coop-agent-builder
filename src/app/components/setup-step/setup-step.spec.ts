import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupStep } from './setup-step';

describe('SetupStep', () => {
  let component: SetupStep;
  let fixture: ComponentFixture<SetupStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStep],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct step data bound to the view', () => {
    expect(component.view.step.id).toBe('setup');
    expect(component.view.step.title).toBe('Project Setup');
    expect(component.view.step.icon).toBe('@tui.settings');
  });

  it('should generate FormGroup dynamically based on SETUP_BLOCKS', () => {
    const blockIds = component.view.blocksArray.map(b => b.id);
    const formKeys = Object.keys(component.form.controls);
    expect(formKeys.sort()).toEqual(blockIds.sort());
  });

  it('should sync form changes to BuilderState', () => {
    // Modify form value
    component.form.patchValue({ aiAgent: 'cursor' });
    // Verify signal state has been updated
    const state = component['builderState'].setupData();
    expect(state['aiAgent']).toBe('cursor');
  });
});
