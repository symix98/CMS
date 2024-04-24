import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomMasterRoutingModule } from '../../../core/modules/routing/room-master-routing.module';
import { RoomMasterComponent } from './room-master.component';
import { SharedModule } from 'src/app/core/modules/shared.module';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';
import { BedDetailsComponent } from '../bed-details/bed-details.component';
import { RoomReservationComponent } from '../room-reservation/room-reservation.component';
import { AddBedDetailsComponent } from '../bed-details/add-bed-details/add-bed-details.component';
import { EditBedDetailsComponent } from '../bed-details/edit-bed-details/edit-bed-details.component';
import { AddRoomReservationComponent } from '../room-reservation/add-room-reservation/add-room-reservation.component';
import { EditRoomReservationComponent } from '../room-reservation/edit-room-reservation/edit-room-reservation.component';

@NgModule({
  declarations: [
    RoomMasterComponent,
    AddRoomComponent,
    EditRoomComponent,
    RoomReservationComponent,
    BedDetailsComponent,
    EditBedDetailsComponent,
    AddBedDetailsComponent,
    AddRoomReservationComponent,
    EditRoomReservationComponent,
  ],
  imports: [CommonModule, RoomMasterRoutingModule, SharedModule],
})
export class RoomMasterModule {}
