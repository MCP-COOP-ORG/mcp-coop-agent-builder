import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewStep } from './review-step';

describe('ReviewStep', () => {
  let component: ReviewStep;
  let fixture: ComponentFixture<ReviewStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewStep],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct step data bound to the view', () => {
    expect(component.view.id).toBe('review');
    expect(component.view.title).toBe('Review & Export');
    expect(component.view.icon).toBe('@tui.file-check');
  });
});
