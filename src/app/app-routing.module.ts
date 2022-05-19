import { TestLoginComponent } from './test-login/test-login.component';
import { DashboardCustomerAdminComponent } from './dashboard-customer-admin/dashboard-customer-admin.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { AdminGuard } from './guards/admin.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { AddroomComponent } from './addroom/addroom.component';
import { ChatroomComponent } from './chatroom/chatroom.component';

const routes: Routes = [
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
  { path: 'loginTest', component: TestLoginComponent },
  { path: 'roomlist', component: RoomlistComponent },
  { path: 'addroom', component: AddroomComponent },
  { path: 'chatroom/:roomname', component: ChatroomComponent },
  /*{ path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
