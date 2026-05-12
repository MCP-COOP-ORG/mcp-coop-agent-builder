import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetupStep } from './setup-step';

describe('SetupStep', () => {
  let component: SetupStep;
  let fixture: ComponentFixture<SetupStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStep],
    }).compileComponents();

    fixture = TestBed.createComponent(SetupStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct step data bound to the view', () => {
    expect(component.view.id).toBe('setup');
    expect(component.view.title).toBe('Project Setup');
    expect(component.view.icon).toBe('@tui.settings');
  });
});
