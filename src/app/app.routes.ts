import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'members', loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'donations', loadComponent: () => import('./pages/donations/donations.component').then(m => m.DonationsComponent) },
  { path: 'marriage-register', loadComponent: () => import('./pages/marriage-register/marriage-register.component').then(m => m.MarriageRegisterComponent) },
];
