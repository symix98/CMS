import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessDeniedPageComponent } from 'src/app/pages/main/access-denied-page/access-denied-page.component';
import { ErrorPageComponent } from 'src/app/pages/main/error-page/error-page.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import { NotFoundPageComponent } from 'src/app/pages/main/not-found-page/not-found-page.component';
import { KeycloakGuard } from '../../auth/keycloak.guard';
import { RoleGroupsComponent } from 'src/app/pages/settings/role-groups/role-groups.component';
import { EmployeeMasterComponent } from 'src/app/pages/camp-management/employee-master/employee-master.component';
import { RoomReservationComponent } from 'src/app/pages/Room-Master/room-reservation/room-reservation.component';

const routes: Routes = [
  { path: 'access', component: AccessDeniedPageComponent },
  
  {
    path: '', component: MainComponent, canActivate: [KeycloakGuard], children: [
      { path: '', loadChildren: () => import("../../../pages/Room-Master/room-master/room-master.module").then(m => m.RoomMasterModule) },
      { path: 'bookings', loadChildren: () => import("../../../pages/transaction/transaction.module").then(m => m.TransactionModule) },
      { path: 'rooms', loadChildren: () => import("../../../pages/Room-Master/room-master/room-master.module").then(m => m.RoomMasterModule) },
      { path: 'advanced-bookings', component: RoomReservationComponent },
      { path: 'dashboard', loadChildren: () => import("../../../pages/dashboard/dashboard.module").then(m => m.DashboardModule) },
      { path: 'employees', component: EmployeeMasterComponent}, 
      { path: 'services', loadChildren: () => import("../../../pages/storage-services/storage-services.module").then(m => m.ServicesModule) },
      { path: 'settings', loadChildren: () => import("../../../pages/settings/settings.module").then(m => m.SettingsModule) },
      { path: 'profile', loadChildren: () => import("../../../pages/shared/user-profile/user-profile.module").then(m => m.profileModule) },
      { path: 'form-engine', loadChildren: () => import("../../../pages/form-engine/form-engine.module").then(m => m.FormEngineModule) },
      { path: 'role-groups', component: RoleGroupsComponent },
    ],
  },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainRoutingModule { }
