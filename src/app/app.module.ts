import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './core/modules/app-routing.module';
import { SharedModule } from './core/modules/shared.module';
import { MainModule } from './pages/main/main.module';
import { AppComponent } from './app.component';
import { initializeKeycloak } from './core/auth/auth.init';
import { environment } from 'src/environments/environment';
import { TableIconComponent } from './pages/shared/table-template/compnents/table-icon/table-icon.component';
import { CampManagementComponent } from './pages/camp-management/camp-management.component';
import { EmployeeMasterComponent } from './pages/camp-management/employee-master/employee-master.component';
import { EmployeeUpdateComponent } from './pages/camp-management/employee-master/employee-update/employee-update.component';
import { TableRowMenuComponent } from './pages/shared/table-template/compnents/table-row-menu/table-row-menu.component';
import { BatchUploadComponent } from './pages/camp-management/employee-master/batch-upload/batch-upload.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,

        HttpClientModule,
        SharedModule,
        MainModule,
        AppRoutingModule,
        KeycloakAngularModule,
        NgxWebstorageModule.forRoot({ prefix: environment.projectName.replace(/\s/g, '').toLowerCase(), separator: '-' })
    ],
    declarations: [
        AppComponent,
        TableIconComponent,
        CampManagementComponent,
        EmployeeMasterComponent,
        EmployeeUpdateComponent,
        TableRowMenuComponent,
        BatchUploadComponent,
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: initializeKeycloak, multi: true, deps: [KeycloakService] }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
