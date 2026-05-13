import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkflowsStep } from './workflows-step';
import { BuilderState } from '@services';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';

describe('WorkflowsStep', () => {
  let component: WorkflowsStep;
  let fixture: ComponentFixture<WorkflowsStep>;
  let builderState: BuilderState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WorkflowsStep],
      providers: [BuilderState]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowsStep);
    component = fixture.componentInstance;
    builderState = TestBed.inject(BuilderState);
    fixture.detectChanges();
  });

  it('should create and initialize form based on config', () => {
    expect(component).toBeTruthy();
    const config = GENERATED_PAGES_CONFIG['workflows'];
    config.categories.forEach(cat => {
      expect(component.form.get(cat.id)).toBeTruthy();
    });
  });

  it('should update builder state when form changes', () => {
    const config = GENERATED_PAGES_CONFIG['workflows'];
    const firstCat = config.categories[0].id;
    component.form.get(firstCat)?.setValue(['gitflow']);
    
    expect(builderState.workflowsData()[firstCat]).toEqual(['gitflow']);
  });

  it('should handle different block types in template', () => {
    const customBlocks = [
      { id: 'r1', title: 'R1', icon: 'i', type: 'radio' as const, options: [{ id: 'o1', label: 'O1' }] },
      { id: 't1', title: 'T1', icon: 'i', type: 'textarea' as const }
    ];
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WorkflowsStep],
      providers: [BuilderState]
    });
    const newFixture = TestBed.createComponent(WorkflowsStep);
    const newComponent = newFixture.componentInstance;
    const newComponentAccess = newComponent as unknown as { view: unknown };
    newComponentAccess.view = { 
      blocksArray: customBlocks,
      step: { id: 'test', label: 'test', icon: 'test', title: 'test', description: 'test' }
    };
    newFixture.detectChanges();
    
    expect(newComponent.form.get('r1')).toBeTruthy();
    expect(newComponent.form.get('t1')).toBeTruthy();
  });
});
