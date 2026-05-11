import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeStep } from './ide-step';

describe('IdeStep', () => {
  let component: IdeStep;
  let fixture: ComponentFixture<IdeStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeStep],
    }).compileComponents();

    fixture = TestBed.createComponent(IdeStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
