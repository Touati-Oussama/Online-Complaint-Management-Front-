import { StompService } from './services/stomp-service.service';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { NavbarClientComponent } from './navbar-client/navbar-client.component';
import { ClientProjectsComponent } from './client-projects/client-projects.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardCustomerComponent } from './dashboard-customer/dashboard-customer.component';
import { NavbarEmployeeComponent } from './navbar-employee/navbar-employee.component';
import { DashboardEmployeeComponent } from './dashboard-employee/dashboard-employee.component';
import { HeaderComponent } from './header/header.component';
import { NavbarAdminClientComponent } from './navbar-admin-client/navbar-admin-client.component';
import { DashboardCustomerAdminComponent } from './dashboard-customer-admin/dashboard-customer-admin.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarAdminComponent,
    LoginComponent,
    NavbarClientComponent,
    ForbiddenComponent,
    ClientProjectsComponent,
    DashboardAdminComponent,
    DashboardCustomerComponent,
    NavbarEmployeeComponent,
    DashboardEmployeeComponent,
    HeaderComponent,
    NavbarAdminClientComponent,
    DashboardCustomerAdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    MatDialogModule,
    MatTableModule,
    MatIconModule,
    MatTableExporterModule
    
  ],
  providers: [StompService],
  bootstrap: [AppComponent],
  entryComponents:[LoginComponent]
})
export class AppModule { }
