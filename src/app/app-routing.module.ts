import { DashboardCustomerAdminComponent } from './dashboard-customer-admin/dashboard-customer-admin.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminGuard } from './guards/admin.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'status', loadChildren:()=> import('./status/status.module').then(m => m.StatusModule)},
  {path: 'types', loadChildren:()=> import('./types/types.module').then(m => m.TypesModule)},
  {path: 'specialties', loadChildren:()=> import('./specialties/specialties.module').then(m => m.SpecialtiesModule)},
  {path: 'projects', loadChildren:()=> import('./projects/projects.module').then(m => m.ProjectsModule)},
  {path: 'customers', loadChildren:()=> import('./customers/customers.module').then(m => m.CustomersModule)},
  {path: 'clients', loadChildren:()=> import('./clients/clients.module').then(m => m.ClientsModule)},
  {path: 'societies', loadChildren:()=> import('./societe/societe.module').then(m => m.SocieteModule),canActivate:[AdminGuard]},
  {path: 'teams', loadChildren:()=> import('./teams/teams.module').then(m => m.TeamsModule)},
  {path: 'complaints', loadChildren:()=> import('./complaints/complaints.module').then(m => m.ComplaintsModule)},
  {path: 'client/projects', loadChildren:()=> import('./client-projects/client-projects.module').then(m => m.ClientProjectsModule)},
  {path:  'login', component: LoginComponent},
  {path:  'app-forbidden', component: ForbiddenComponent},
  {path: 'dashboard-admin',component:DashboardAdminComponent,canActivate:[AdminGuard]},
  {path: 'dashboard-customer',component:DashboardCustomerComponent},
  {path: 'dashboard-employee', component:DashboardEmployeeComponent},
  {path: 'dashboard-customer-admin', component:DashboardCustomerAdminComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
