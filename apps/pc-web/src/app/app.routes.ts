import { Route } from '@angular/router';
import { canActivateLogin } from './guards/login.guards';

export const appRoutes: Route[] = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
}, {
  path: 'join',
  loadComponent: () => import('./join-session/join-session.component').then(m => m.JoinSessionComponent)
}, {
  path: 'session/:id/lobby',
  loadComponent: () => import('./lobby/lobby.component').then(m => m.LobbyComponent)
}, {
  path: 'session/:id',
  loadComponent: () => import('./session/session.component').then(m => m.SessionComponent)
}, {
  path: 'dashboard',
  canActivate: [canActivateLogin],
  loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
  children: [{
    path: '',
    redirectTo: 'sessions',
    pathMatch: 'full'
  }, {
    path: 'sessions',
    loadComponent: () => import('./dashboard/sessions-list/sessions-list.component').then(m => m.SessionsListComponent)
  }, {
    path: 'sessions/create',
    loadComponent: () => import('./dashboard/session-create/session-create.component').then(m => m.SessionCreateComponent)
  }, {
    path: 'sessions/:id',
    loadComponent: () => import('./dashboard/session-details/session-details.component').then(m => m.SessionDetailsComponent)
  }]
}, {
  path: 'review-widget',
  loadComponent: () => import('./review-widget/review-widget.component').then(m => m.ReviewWidgetComponent)
}, {
  path: '**',
  loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
}];
