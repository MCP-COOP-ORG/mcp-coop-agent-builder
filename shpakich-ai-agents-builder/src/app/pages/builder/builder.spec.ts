import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Builder } from './builder';
import { APP_ROUTES, BUILDER_STEPS } from '@shared/constants';
import { vi } from 'vitest';

describe('Builder', () => {
  let component: Builder;
  let fixture: ComponentFixture<Builder>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Builder],
      providers: [
        provideRouter([
          { path: '**', component: Builder } // Catch-all route for testing URL changes
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Builder);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate activeStepIndex correctly based on URL', async () => {
    await router.navigateByUrl(`${APP_ROUTES.BUILDER}/${BUILDER_STEPS[2].id}`);
    fixture.detectChanges();
    expect(component.activeStepIndex()).toBe(2);
  });

  describe('nextStep', () => {
    it('should navigate to the next step', async () => {
      await router.navigateByUrl(`${APP_ROUTES.BUILDER}/${BUILDER_STEPS[0].id}`);
      fixture.detectChanges();
      
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.nextStep();
      expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.BUILDER, BUILDER_STEPS[1].id]);
    });

    it('should not navigate if already on the last step', async () => {
      await router.navigateByUrl(`${APP_ROUTES.BUILDER}/${BUILDER_STEPS[BUILDER_STEPS.length - 1].id}`);
      fixture.detectChanges();
      
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.nextStep();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('prevStep', () => {
    it('should navigate to the previous step', async () => {
      await router.navigateByUrl(`${APP_ROUTES.BUILDER}/${BUILDER_STEPS[1].id}`);
      fixture.detectChanges();
      
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.prevStep();
      expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.BUILDER, BUILDER_STEPS[0].id]);
    });

    it('should not navigate if already on the first step', async () => {
      await router.navigateByUrl(`${APP_ROUTES.BUILDER}/${BUILDER_STEPS[0].id}`);
      fixture.detectChanges();
      
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.prevStep();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('onStepClick', () => {
    it('should navigate to the requested step index', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.onStepClick(2);
      expect(navigateSpy).toHaveBeenCalledWith([APP_ROUTES.BUILDER, BUILDER_STEPS[2].id]);
    });

    it('should not navigate if index is out of bounds', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');
      component.onStepClick(-1);
      component.onStepClick(99);
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('should call console.log (placeholder)', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      component.download();
      expect(consoleSpy).toHaveBeenCalledWith('Downloading context archive...');
    });
  });
});
