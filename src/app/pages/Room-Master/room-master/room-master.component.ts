import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/core/services/api.service';
import { ProductService } from 'src/app/core/services/fake-data';
import { CustomerService } from 'src/app/core/services/fakedata-customers';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { AddRoomComponent } from '../add-room/add-room.component';
import { EditRoomComponent } from '../edit-room/edit-room.component';
import { Room } from 'src/app/core/models/room.model';
import { Subscription } from 'rxjs';
import { ApiURL } from 'src/app/core/miscellaneous/api.template';
import { TableParameter } from 'src/app/core/models/table-model/table-parameter.model';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RoomReservationComponent } from '../room-reservation/room-reservation.component';
import { BedDetailsComponent } from '../bed-details/bed-details.component';
@Component({
  selector: 'app-room-master',
  templateUrl: './room-master.component.html',
  styleUrls: ['./room-master.component.scss'],
  providers: [ProductService, CustomerService],
})
export class RoomMasterComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  tableParam: TableParameter;
  rooms!: Room[] | null;
  selectedRooms!: Room[] | null;
  subscription = new Subscription();


  constructor(
    private dialogService: DialogService,
    public config: DynamicDialogConfig,
    private apiService: ApiService,
    private utilitiesService: UtilitiesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.getRooms()
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
  }

  async getRooms() {
    this.rooms = null;
    this.subscription.add(
      await this.apiService.get(ApiURL.room_details).subscribe(
        (res) => {
          console.log(res);
          this.rooms = res;
        },
        (err) => {
          this.utilitiesService.notifyError('Could not perform operation!');
        }
      )
    );
  }

  openNewRoom() {
    this.dialogService
      .open(AddRoomComponent, {
        header: 'Add Room',
        height: '85vh',
        width: '85%',
        modal: true,
      })
      .onClose.subscribe((res) => {
        if (res) {
          console.log(res);
          this.rooms.push(res);
          this.utilitiesService.notifySuccess('Room Added');
        }
      });
  }

  openEditRoom(room: Room) {
    this.dialogService
      .open(EditRoomComponent, {
        header: 'Edit Room',
        height: '60vh',
        width: '85%',
        modal: true,
        data: room.id,
      })
      .onClose.subscribe((res) => {
        console.log(res);
        if (res && res === "updated" ) {
          this.getRooms()
        }
      });
  }

  openReserveRoom(){ 
    this.dialogService
      .open(RoomReservationComponent, {
        header: 'Reserve a Room',
        height: '50vh',
        width: '50%',
        modal: true,
        data: this.selectedRooms,
      }).onClose.subscribe((res) => {
        if(res && res === "reserved" ) {
          
          this.getRooms()
        }
      })
  }

  

  deleteRoom(id: number) {
    this.utilitiesService
      .confirmDialog('Are you sure you want to delete this room?')
      .then((confirm) => {
        if (confirm) {
          this.subscription.add(
            this.apiService.delete(ApiURL.room_details + '/' + id).subscribe({
              next: (res) => {},
              complete: () => {
                this.utilitiesService.notifySuccess('Room Deleted');
                this.getRooms()
              },
              error: (err) => {
                this.utilitiesService.notifyWarning('Can not delete room with room details or reservation');
                throw new Error('Could not perform operation!');
              },
            })
          );
        }})
    
  }

  deleteSelectedRooms() {
    this.utilitiesService.confirmDialog('Are you sure you want to delete rooms?')
      .then((confirm) => {
        if (confirm) {
          const deletionRequests = this.selectedRooms.map(room => 
            this.apiService.delete(ApiURL.room_details + '/' + room.id)
          );
  
          forkJoin(deletionRequests)
            .pipe(
              finalize(() => {
                this.getRooms();
              })
            )
            .subscribe({
              next: () => {
                this.utilitiesService.notifySuccess('Selected Rooms Deleted');
              },
              error: () => {
                this.utilitiesService.notifyWarning('Cannot delete room with room and bed details');
              }
            });
        }
      });
  }
  

  openEditRoomDetails(room: any) {
    console.log("clicked");
    console.log(room);
    this.dialogService
    .open(BedDetailsComponent, {
      height: '85vh',
      width: '85%',
      modal: true,
      data: room,
    })
  }

  getSeverity(status: string) {
    switch (status) {
      case 'occupied':
        return 'danger';
      case 'empty':
        return 'success';
        case 'maintenance':
        return 'warning';
        case 'reserved':
        return 'info';
    }
  }

  exportRooms() {
    this.utilitiesService.exportAsExcelFile(this.rooms, 'rooms');
  }

  downloadTemplate() {
    let roomsTemplate = [
      {
        id: null,
        roomDescription: '',
        block: '',
        floor: '',
        roomCategory: '',
        bedCount: null,
        roomNo: '',
        roomAllocation: '',
        roomConfiguration: '',
        availableFrom: '',
        roomStatus: '',
        bedOnly: null,
        monthlyRate: null,
        dailyRate: null,
        bedRate: null,
        reservationRate: null,
        remarks: '',
        createdBy: '',
        createdAt: '',
        modifyBy: '',
        modifyAt: '',
      }
    ];
    
    this.utilitiesService.exportAsExcelFile(roomsTemplate, 'room_template');
  }
}
