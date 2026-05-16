import { Routes } from '@angular/router';
import { APP_ROUTES, STEP_IDS } from '@shared/constants';
import { GENERATED_PAGES_CONFIG } from '@shared/configs';

const dynamicRoutes = Object.keys(GENERATED_PAGES_CONFIG).map((stepId) => ({
    path: stepId,
    data: { stepId },
    loadComponent: () => import('./components/dynamic-form-step/dynamic-form-step').then((m) => m.DynamicFormStep),
}));

export const routes: Routes = [
    {
        path: APP_ROUTES.WELCOME_PATH,
        loadComponent: () => import('./pages/welcome/welcome').then((m) => m.Welcome),
    },
    {
        path: APP_ROUTES.BUILDER_PATH,
        loadComponent: () => import('./pages/builder/builder').then((m) => m.Builder),
        children: [
            { path: '', redirectTo: STEP_IDS.DESCRIPTION, pathMatch: 'full' },
            {
                path: STEP_IDS.DESCRIPTION,
                loadComponent: () =>
                    import('./components/description-step/description-step').then((m) => m.DescriptionStep),
            },
            ...dynamicRoutes,
            {
                path: STEP_IDS.REVIEW,
                loadComponent: () => import('./components/review-step/review-step').then((m) => m.ReviewStep),
            },
        ],
    },
    { path: '**', redirectTo: APP_ROUTES.WELCOME_PATH },
];
