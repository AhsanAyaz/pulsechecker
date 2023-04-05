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
  path: 'login',
  loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
}, {
  path: 'dashboard',
  canActivate: [canActivateLogin],
  loadComponent: () => import('./dashboard/layout/layout.component').then(m => m.LayoutComponent),
  children: [{
    path: '',
    loadComponent: () => import('./dashboard/sessions-list/sessions-list.component').then(m => m.SessionsListComponent)
  }, {
    path: 'create',
    loadComponent: () => import('./dashboard/session-create/session-create.component').then(m => m.SessionCreateComponent)
  }, {
    path: ':id',
    loadComponent: () => import('./dashboard/session-details/session-details.component').then(m => m.SessionDetailsComponent)
  }]
}, {
  path: '**',
  loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
}];
