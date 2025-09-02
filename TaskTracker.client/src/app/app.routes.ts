import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Departments } from './pages/departments/departments';
import { Employees } from './pages/employees/employees';
import { Projects } from './pages/projects/projects';
import { Roles } from './pages/roles/roles';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'departments', component: Departments },
  { path: 'employees', component: Employees },
  { path: 'projects', component: Projects },
  { path: 'roles', component: Roles },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
