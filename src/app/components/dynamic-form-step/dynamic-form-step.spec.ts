import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormStep } from './dynamic-form-step';
import { BuilderState } from '@services';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';
import { signal } from '@angular/core';

describe('DynamicFormStep', () => {
  let component: DynamicFormStep;
  let fixture: ComponentFixture<DynamicFormStep>;
  let builderState: BuilderState;

  // Mock a generated config step
  const mockStepId = 'test-step';
  beforeAll(() => {
    (GENERATED_PAGES_CONFIG as Record<string, unknown>)[mockStepId] = {
      id: mockStepId,
      title: 'Test Step',
      description: 'Test description',
      categories: [
        {
          id: 'cat1',
          title: 'Category 1',
          type: 'checkbox',
          items: [
            { id: 'item1', label: 'Item 1' },
            { id: 'item2', label: 'Item 2' }
          ]
        },
        {
          id: 'cat2',
          title: 'Category 2',
          type: 'radio',
          items: [
            { id: 'opt1', label: 'Opt 1' }
          ]
        },
        {
          id: 'cat3',
          title: 'Category 3',
          type: 'textarea',
          items: []
        }
      ]
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DynamicFormStep],
      providers: [
        BuilderState,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { stepId: mockStepId }
            }
          }
        }
      ]
    }).compileComponents();

    builderState = TestBed.inject(BuilderState);
    // Initialize the dynamic signal for testing
    builderState.dynamicData[mockStepId] = builderState.dynamicData[mockStepId] || signal({});
    
    fixture = TestBed.createComponent(DynamicFormStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should construct blocksArray from generated config', () => {
    expect(component.view.blocksArray.length).toBe(3);
    expect(component.view.blocksArray[0].id).toBe('cat1');
    expect(component.view.blocksArray[0].options?.length).toBe(2);
    expect(component.view.blocksArray[1].id).toBe('cat2');
  });

  it('should initialize form from builder state', () => {
    builderState.dynamicData[mockStepId].set({ cat1: ['item1'] });
    
    // Re-init to trigger ngOnInit
    fixture = TestBed.createComponent(DynamicFormStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.form.get('cat1')?.value).toEqual(['item1']);
  });

  it('should update builder state on form changes', () => {
    component.form.patchValue({ cat1: ['item2'] });
    
    const data = builderState.dynamicData[mockStepId]();
    expect(data['cat1']).toEqual(['item2']);
  });

  it('should correctly bind to stateSignal via getter', () => {
    // We bypass typescript to test protected method directly
    const stateSignalGetter = (component as unknown as { stateSignal: unknown }).stateSignal;
    expect(stateSignalGetter).toBe(builderState.dynamicData[mockStepId]);
  });
});
