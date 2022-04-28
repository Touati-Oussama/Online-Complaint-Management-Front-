import { StompService } from './../services/stomp-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComplaintsRoutingModule } from './complaints-routing.module';
import { ComplaintsComponent } from './complaints.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list-client/list.component';
import { DetailsComponent } from './details/details.component';
import { ListAdminComponent } from './list-admin/list-admin.component';
import { PendingComponent } from './pending/pending.component';
import { ClosedComponent } from './closed/closed.component';
import { ZeroActionComponent } from './zero-action/zero-action.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientDetailsComponent } from './client-details/client-details.component';
import {MatCardModule} from '@angular/material/card';
import { ForwardComponent } from './forward/forward.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ListEmployeeComponent } from './list-employee/list-employee.component';
import { ListClientAdminComponent } from './list-client-admin/list-client-admin.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ComplaintsComponent, AddComponent, EditComponent, ListComponent, DetailsComponent, ListAdminComponent, PendingComponent, ClosedComponent, ZeroActionComponent, ClientDetailsComponent, ForwardComponent, ListEmployeeComponent, ListClientAdminComponent],
  imports: [
    CommonModule,
    ComplaintsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatCardModule,
    MatTableExporterModule,
    FontAwesomeModule,
    MatSelectModule
  ],
  providers: [StompService],

})
export class ComplaintsModule { }
