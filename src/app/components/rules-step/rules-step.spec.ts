import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesStep } from './rules-step';

describe('RulesStep', () => {
  let component: RulesStep;
  let fixture: ComponentFixture<RulesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesStep],
    }).compileComponents();

    fixture = TestBed.createComponent(RulesStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct metadata and form', () => {
    expect(component.view.step.id).toBe('rules');
    expect(component.form).toBeDefined();
    expect(Object.keys(component.form.controls).length).toBeGreaterThan(0);
  });

  it('should handle branch coverage for templates', () => {
    const newFixture = TestBed.createComponent(RulesStep);
    const newComponent = newFixture.componentInstance;
    
    (newComponent as any).view.blocksArray = [
      { id: 'b1', type: 'radio', title: 'R', icon: 'i', options: [{ id: '1', label: 'L' }] },
      { id: 'b2', type: 'textarea', title: 'T', icon: 'i', label: 'L' }
    ];

    newFixture.detectChanges();
    expect(newComponent.form.get('b1')).toBeTruthy();
  });
});
