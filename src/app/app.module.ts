import { MatCardModule } from '@angular/material/card';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';








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
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AddroomComponent } from './addroom/addroom.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { TestLoginComponent } from './test-login/test-login.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { InboxListComponent } from './inbox-list/inbox-list.component';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { ToastrModule } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AvatarModule } from 'ngx-avatar';


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
    AddroomComponent,
    ChatroomComponent,
    TestLoginComponent,
    RoomlistComponent,
    InboxListComponent,

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
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatInputModule,
    MatTooltipModule,
    AvatarModule,
    MatFormFieldModule,
    TranslateModule,
    MatTableExporterModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    SplitterModule,
    ToastrModule.forRoot(),
    
  ],
  providers: [StompService,DatePipe,NgbActiveModal],
  bootstrap: [AppComponent],
  entryComponents:[LoginComponent]
})
export class AppModule { }
