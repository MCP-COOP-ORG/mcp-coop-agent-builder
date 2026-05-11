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
      { path: '', redirectTo: STEP_IDS.PROJECT, pathMatch: 'full' },
      { path: STEP_IDS.IDE, loadComponent: () => import('./components/ide-step/ide-step').then(m => m.IdeStep) },
      { path: STEP_IDS.PROJECT, loadComponent: () => import('./components/project-step/project-step').then(m => m.ProjectStep) },
      { path: STEP_IDS.STACK, loadComponent: () => import('./components/stack-step/stack-step').then(m => m.StackStep) },
      { path: STEP_IDS.EXPORT, loadComponent: () => import('./components/export-step/export-step').then(m => m.ExportStep) }
    ]
  },
  { path: '**', redirectTo: APP_ROUTES.WELCOME_PATH }
];
