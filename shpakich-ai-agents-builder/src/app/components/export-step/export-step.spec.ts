import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStep } from './export-step';

describe('ExportStep', () => {
  let component: ExportStep;
  let fixture: ComponentFixture<ExportStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportStep],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
