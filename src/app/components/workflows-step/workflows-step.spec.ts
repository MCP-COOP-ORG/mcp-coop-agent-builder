import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowsStep } from './workflows-step';

describe('WorkflowsStep', () => {
  let component: WorkflowsStep;
  let fixture: ComponentFixture<WorkflowsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct metadata and form', () => {
    expect(component.view.step.id).toBe('workflows');
    expect(component.form).toBeDefined();
    expect(Object.keys(component.form.controls).length).toBeGreaterThan(0);
  });

  it('should handle branch coverage for templates', () => {
    const newFixture = TestBed.createComponent(WorkflowsStep);
    const newComponent = newFixture.componentInstance;
    
    (newComponent as any).view.blocksArray = [
      { id: 'b1', type: 'radio', title: 'R', icon: 'i', options: [{ id: '1', label: 'L' }] },
      { id: 'b2', type: 'textarea', title: 'T', icon: 'i', label: 'L' }
    ];

    newFixture.detectChanges();
    expect(newComponent.form.get('b1')).toBeTruthy();
  });
});
