import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStep } from './project-step';

describe('ProjectStep', () => {
  let component: ProjectStep;
  let fixture: ComponentFixture<ProjectStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStep],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
