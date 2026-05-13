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
      { path: '', redirectTo: STEP_IDS.DESCRIPTION, pathMatch: 'full' },
      { path: STEP_IDS.DESCRIPTION, loadComponent: () => import('./components/description-step/description-step').then(m => m.DescriptionStep) },
      { path: STEP_IDS.AGENTS, loadComponent: () => import('./components/agents-step/agents-step').then(m => m.AgentsStep) },
      { path: STEP_IDS.RULES, loadComponent: () => import('./components/rules-step/rules-step').then(m => m.RulesStep) },
      { path: STEP_IDS.WORKFLOWS, loadComponent: () => import('./components/workflows-step/workflows-step').then(m => m.WorkflowsStep) },
      { path: STEP_IDS.REVIEW, loadComponent: () => import('./components/review-step/review-step').then(m => m.ReviewStep) }
    ]
  },
  { path: '**', redirectTo: APP_ROUTES.WELCOME_PATH }
];
