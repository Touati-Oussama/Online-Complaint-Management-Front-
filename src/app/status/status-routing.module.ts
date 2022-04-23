import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'add', component: AddComponent,canActivate:[AdminGuard] },
  { path: 'edit/:id', component: EditComponent ,canActivate:[AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
