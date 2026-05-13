import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionStep } from './description-step';
import { BUILDER_DICTIONARY, STEP_IDS, BUILDER_STEPS } from '@shared/constants';

describe('DescriptionStep', () => {
  let component: DescriptionStep;
  let fixture: ComponentFixture<DescriptionStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionStep],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct step data bound to the view', () => {
    const expectedData = BUILDER_STEPS.find(step => step.id === STEP_IDS.DESCRIPTION);
    expect(component.view.step).toEqual(expectedData!);
  });

  it('should generate FormGroup dynamically based on SETUP_BLOCKS', () => {
    const blockIds = component.view.blocksArray.map(b => b.id);
    const formKeys = Object.keys(component.form.controls);
    expect(formKeys.sort()).toEqual(blockIds.sort());
  });

  it('should sync form changes to BuilderState', () => {
    const firstKey = Object.keys(component.form.controls)[0];
    const mockData = { name: 'Test', domains: ['ecommerce'], description: 'A test project' };
    component.form.patchValue({
      [firstKey]: mockData
    });
    
    const state = component['builderState'].descriptionData();
    expect(state[firstKey]).toEqual(mockData);
  });

  it('should handle all block types in template and form generation', () => {
    // We create a new fixture to avoid interference with ngOnInit already called
    const newFixture = TestBed.createComponent(DescriptionStep);
    const newComponent = newFixture.componentInstance;
    
    // Override blocksArray with all types to hit all branches in BaseFormStep and template
    (newComponent as any).view.blocksArray = [
      { id: 'radioBlock', type: 'radio', title: 'Radio', icon: 'icon', options: [{ id: '1', label: 'L' }] },
      { id: 'checkboxBlock', type: 'checkbox', title: 'Check', icon: 'icon', options: [{ id: '1', label: 'L' }] },
      { id: 'textareaBlock', type: 'textarea', title: 'Text', icon: 'icon', label: 'L', placeholder: 'P' },
      { 
        id: 'compositeBlock', 
        type: 'composite', 
        title: 'Comp', 
        icon: 'icon', 
        fields: [
          { id: 'f1', type: 'input', label: 'L', validators: ['required'] },
          { id: 'f2', type: 'multi-select', label: 'L', options: [{ id: '1', label: 'L' }] },
          { id: 'f3', type: 'textarea', label: 'L' }
        ] 
      }
    ];

    newFixture.detectChanges();

    expect(newComponent.form.get('radioBlock')).toBeTruthy();
    expect(newComponent.form.get('checkboxBlock')).toBeTruthy();
    expect(newComponent.form.get('textareaBlock')).toBeTruthy();
    expect(newComponent.form.get('compositeBlock')).toBeTruthy();
    expect(newComponent.form.get('compositeBlock.f1')).toBeTruthy();
    
    const radioEl = newFixture.nativeElement.querySelector('app-radio-group');
    const checkEl = newFixture.nativeElement.querySelector('app-checkbox-group');
    const textEl = newFixture.nativeElement.querySelector('app-textarea-field');
    const compEl = newFixture.nativeElement.querySelector('.composite-layout');
    
    expect(radioEl).toBeTruthy();
    expect(checkEl).toBeTruthy();
    expect(textEl).toBeTruthy();
    expect(compEl).toBeTruthy();
  });

  it('should initialize state if initialData is empty', () => {
    const newFixture = TestBed.createComponent(DescriptionStep);
    const newComponent = newFixture.componentInstance;
    const stateSignal = newComponent['builderState'].descriptionData;
    stateSignal.set({}); // Ensure it's empty
    
    newFixture.detectChanges();
    
    expect(Object.keys(stateSignal()).length).toBeGreaterThan(0);
  });
});
