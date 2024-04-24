import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomMasterComponent } from 'src/app/pages/Room-Master/room-master/room-master.component';

const routes: Routes = [
  { path: '', component: RoomMasterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomMasterRoutingModule { }
