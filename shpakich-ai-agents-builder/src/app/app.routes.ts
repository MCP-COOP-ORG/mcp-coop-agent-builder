import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/welcome/welcome').then(m => m.Welcome)
  },
  {
    path: 'builder',
    loadComponent: () => import('./pages/builder/builder').then(m => m.Builder),
    children: [
      { path: '', redirectTo: 'project', pathMatch: 'full' },
      { path: 'ide', loadComponent: () => import('./components/ide-step/ide-step').then(m => m.IdeStep) },
      { path: 'project', loadComponent: () => import('./components/project-step/project-step').then(m => m.ProjectStep) },
      { path: 'stack', loadComponent: () => import('./components/stack-step/stack-step').then(m => m.StackStep) },
      { path: 'export', loadComponent: () => import('./components/export-step/export-step').then(m => m.ExportStep) }
    ]
  },
  { path: '**', redirectTo: '' }
];
