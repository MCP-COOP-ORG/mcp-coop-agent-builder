import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
