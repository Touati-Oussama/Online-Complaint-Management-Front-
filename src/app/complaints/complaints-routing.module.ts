import { ListClientAdminComponent } from './list-client-admin/list-client-admin.component';
import { ForwardComponent } from './forward/forward.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

import { ListAdminComponent } from './list-admin/list-admin.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list-client/list.component';
import { PendingComponent } from './pending/pending.component';
import { ClosedComponent } from './closed/closed.component';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { ZeroActionComponent } from './zero-action/zero-action.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'add', component: AddComponent },
  { path: 'add/:id', component: AddComponent },
  { path: 'edit/:id', component: EditComponent},
  { path: 'details/:id', component:DetailsComponent},
  { path: 'test/:statusname', component:ListAdminComponent},
  { path: 'adminList', component:ListAdminComponent},
  { path: 'employeeList', component:ListEmployeeComponent},
  { path: 'pending',component:PendingComponent},
  { path: 'closed', component:ClosedComponent},
  { path: 'clientAdminList',component: ListClientAdminComponent},
  { path: 'zeroAction', component:ZeroActionComponent},
  { path: 'client-details', component: ClientDetailsComponent},
  { path: 'forward/:id/:complaintName', component: ForwardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule { }
