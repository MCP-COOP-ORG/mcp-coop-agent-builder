import { Routes } from '@angular/router';
import { APP_ROUTES, STEP_IDS } from '@shared/constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.WELCOME_PATH,
    loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: APP_ROUTES.BUILDER_PATH,
    loadComponent: () => import('./pages/builder/builder').then(m => m.Builder),
    children: [
      { path: '', redirectTo: STEP_IDS.SETUP, pathMatch: 'full' },
      { path: STEP_IDS.SETUP, loadComponent: () => import('./components/setup-step/setup-step').then(m => m.SetupStep) },
      { path: STEP_IDS.STACK, loadComponent: () => import('./components/stack-step/stack-step').then(m => m.StackStep) },
      { path: STEP_IDS.REVIEW, loadComponent: () => import('./components/review-step/review-step').then(m => m.ReviewStep) }
    ]
  },
  { path: '**', redirectTo: APP_ROUTES.WELCOME_PATH }
];
